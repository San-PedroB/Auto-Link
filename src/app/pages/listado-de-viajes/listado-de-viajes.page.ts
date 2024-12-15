import { Component, OnInit } from '@angular/core';
import { RolUsuarioService } from '../../services/rol-usuario.service'; // Servicio de rol de usuario
import { ToastController, NavController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore/firestore.service';

@Component({
  selector: 'app-listado-de-viajes',
  templateUrl: './listado-de-viajes.page.html',
  styleUrls: ['./listado-de-viajes.page.scss'],
})
export class ListadoDeViajesPage implements OnInit {
  viajesPendientes: any[] = []; // Arreglo para almacenar los viajes pendientes
  viajesAceptados: any[] = []; // Lista de viajes aceptados para el usuario
  esConductor: boolean = false;
  esPasajero: boolean = false;
  usuarioActualCorreo: string | null = null;

  constructor(
    private rolUsuarioService: RolUsuarioService,
    private toastController: ToastController,
    private navController: NavController,
    private firestoreService: FirestoreService
  ) {}

  async ngOnInit() {
    console.log('Inicializando listado de viajes...');

    // Obtener el correo del usuario actual
    this.usuarioActualCorreo = this.firestoreService.getCorreoUsuarioActual();
    if (!this.usuarioActualCorreo) {
      console.error('No se pudo obtener el correo del usuario actual.');
      return;
    }
    console.log('Correo del usuario actual:', this.usuarioActualCorreo);

    // Verificar el rol del usuario
    this.esConductor = this.rolUsuarioService.esConductor();
    this.esPasajero = this.rolUsuarioService.esPasajero();
    console.log(
      'Rol del usuario - esConductor:',
      this.esConductor,
      'esPasajero:',
      this.esPasajero
    );

    // Redirigir al pasajero si tiene un viaje aceptado
    if (this.esPasajero) {
      const viajesAceptados = await this.firestoreService.getDocumentsByQuery(
        'viajes',
        'estado',
        'aceptado'
      );

      // Buscar un viaje aceptado donde el pasajero es el usuario actual
      const viajeActual = viajesAceptados.find(
        (viaje) => viaje.pasajeroCorreo === this.usuarioActualCorreo
      );

      if (viajeActual) {
        console.log('Redirigiendo al viaje actual:', viajeActual.id);
        this.navController.navigateRoot(`/viaje-actual/${viajeActual.id}`);
        return; // Terminar la ejecución
      }
    }

    // Cargar los viajes para conductores y pasajeros
    await this.cargarTodosLosViajes();
  }

  async iniciarViaje(viajeId: string) {
    console.log('🚀 ID del viaje recibido para iniciar:', viajeId);

    if (!viajeId) {
      console.error('❌ El ID del viaje no es válido. No se puede iniciar.');
      return;
    }

    try {
      // Cambiar el estado del viaje a "en curso"
      await this.firestoreService.actualizarEstadoViaje(viajeId, 'en curso');
      console.log(`✅ El viaje con ID ${viajeId} ha sido iniciado.`);

      // Notificar a los pasajeros que el viaje ha comenzado
      try {
        await this.notificarPasajeros(viajeId);
        console.log('✅ Pasajeros notificados correctamente.');
      } catch (error) {
        console.warn('⚠️ No se pudo notificar a todos los pasajeros:', error);
      }

      // Actualizar las listas locales
      await this.cargarTodosLosViajes();

      // Mostrar confirmación al conductor
      const toast = await this.toastController.create({
        message: 'El viaje ha sido iniciado exitosamente.',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();

      // 👉 Redirigir al conductor a la vista "Viaje Actual"
      this.navController.navigateRoot(`/viaje-actual/${viajeId}`);
      console.log('🔄 Redirigiendo a la vista de "Viaje Actual"...');
    } catch (error) {
      console.error('❌ Error al iniciar el viaje:', error);

      const toastError = await this.toastController.create({
        message: 'Hubo un error al iniciar el viaje. Inténtalo de nuevo.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toastError.present();
    }
  }

  // Método adicional para notificar a los pasajeros
  private async notificarPasajeros(viajeId: string) {
    console.log('Notificando a los pasajeros del viaje:', viajeId);

    // Obtener el documento del viaje para verificar pasajeros
    const viaje = await this.firestoreService.getViajeActual(viajeId);

    if (viaje && viaje.pasajerosCorreo) {
      for (const correoPasajero of viaje.pasajerosCorreo) {
        console.log(`Notificando al pasajero: ${correoPasajero}`);
        // Aquí podrías implementar más lógica como enviar una notificación push
      }
    }
  }

  async cargarTodosLosViajes() {
    try {
      // Obtener todos los viajes en Firestore
      const todosLosViajes = await this.firestoreService.getDocumentsByQuery(
        'viajes',
        'estado',
        'pendiente'
      );

      // Filtrar viajes
      this.filtrarViajes(todosLosViajes);

      // Añadir datos del conductor a los viajes pendientes
      for (const viaje of this.viajesPendientes) {
        if (viaje.conductorCorreo) {
          const datosConductor = await this.obtenerDatosConductor(
            viaje.conductorCorreo
          );
          viaje.conductorNombre = datosConductor?.nombre || 'N/A';
          viaje.conductorApellido = datosConductor?.apellido || 'N/A';
        }
      }

      console.log(
        'Viajes pendientes con datos del conductor:',
        this.viajesPendientes
      );
      console.log('Viajes aceptados:', this.viajesAceptados);

      // Verificar si existe un viaje en curso
      this.verificarViajeEnCurso(todosLosViajes);
    } catch (error) {
      console.error('Error al cargar los viajes:', error);
    }
  }

  private filtrarViajes(todosLosViajes: any[]) {
    // Clasificar viajes pendientes
    this.viajesPendientes = todosLosViajes.filter((v) => {
      if (this.esConductor) {
        // Mostrar todos los viajes si es conductor (incluido el suyo)
        return v.estado === 'pendiente';
      } else {
        // Mostrar solo viajes donde el usuario no es el conductor
        return (
          v.estado === 'pendiente' &&
          v.conductorCorreo !== this.usuarioActualCorreo
        );
      }
    });

    // Clasificar viajes aceptados para el pasajero
    this.viajesAceptados = todosLosViajes.filter(
      (v) =>
        v.estado === 'aceptado' &&
        v.usuariosAceptados?.includes(this.usuarioActualCorreo)
    );
  }

  private verificarViajeEnCurso(todosLosViajes: any[]) {
    const viajesEnCurso = todosLosViajes.filter(
      (v) =>
        v.estado === 'en curso' &&
        (v.conductorCorreo === this.usuarioActualCorreo ||
          v.usuariosAceptados?.includes(this.usuarioActualCorreo))
    );

    if (viajesEnCurso.length > 0) {
      console.log('Viaje en curso detectado:', viajesEnCurso[0]);
      this.navController.navigateRoot(`/viaje-actual/${viajesEnCurso[0].id}`);
    }
  }

  // Método corregido para obtener los datos del conductor
  async obtenerDatosConductor(correo: string): Promise<any> {
    console.log('📨 Buscando datos del conductor con correo:', correo);

    const conductores = await this.firestoreService.getDocumentsByQuery(
      'users',
      'email',
      correo
    );

    if (conductores.length > 0) {
      console.log('✅ Datos del conductor encontrados:', conductores[0]);
      return conductores[0]; // Retorna el primer documento que coincida
    } else {
      console.warn(
        `⚠️ No se encontraron datos para el conductor con correo: ${correo}`
      );
      return null;
    }
  }

  async tomarViaje(viaje: any) {
    // Verificar si el viaje tiene un ID válido
    if (!viaje.id) {
      console.warn('El viaje seleccionado no tiene un ID válido.');
      const toast = await this.toastController.create({
        message: 'Error: Este viaje no tiene un ID válido.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
      return;
    }

    console.log('ID del viaje tomado:', viaje.id);

    try {
      // Verificar si el correo del usuario actual es válido
      if (!this.usuarioActualCorreo) {
        console.error('El correo del usuario actual no está disponible.');
        const toast = await this.toastController.create({
          message:
            'Error: No se pudo obtener tu información. Inténtalo de nuevo.',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
        });
        await toast.present();
        return;
      }

      // Llamar a aceptarViaje en FirestoreService para reducir plazas y agregar al usuario
      await this.firestoreService.aceptarViaje(
        viaje.id,
        this.usuarioActualCorreo
      );

      console.log('El usuario fue agregado al viaje correctamente.');

      // Actualizar dinámicamente la lista de viajes pendientes
      this.viajesPendientes = this.viajesPendientes.filter(
        (item) => item.id !== viaje.id
      );

      const toast = await this.toastController.create({
        message: 'Te has unido al viaje exitosamente.',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();

      // Navegar a la página de sala de espera
      this.navController.navigateRoot('/sala-de-espera', {
        state: { viajeId: viaje.id },
      });
    } catch (error) {
      console.error('Error al unirse al viaje:', error);

      const toast = await this.toastController.create({
        message: 'Error al unirse al viaje. Inténtalo de nuevo.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
  }

  async terminarViaje(viajeId: string) {
    console.log('ID del viaje recibido para eliminación:', viajeId);

    if (!viajeId) {
      console.error('El ID del viaje no es válido. No se puede eliminar.');
      return;
    }

    try {
      // Llama al servicio Firestore para eliminar el viaje
      await this.firestoreService.eliminarViaje(viajeId);

      console.log(
        `Viaje con ID ${viajeId} eliminado exitosamente de Firestore.`
      );

      // Actualiza dinámicamente las listas locales
      this.viajesPendientes = this.viajesPendientes.filter(
        (viaje) => viaje.id !== viajeId
      );
      console.log(
        'Lista actualizada de viajes pendientes:',
        this.viajesPendientes
      );

      this.viajesAceptados = this.viajesAceptados.filter(
        (viaje) => viaje.id !== viajeId
      );
      console.log(
        'Lista actualizada de viajes aceptados:',
        this.viajesAceptados
      );

      const toast = await this.toastController.create({
        message: 'El viaje ha sido eliminado correctamente.',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();
    } catch (error) {
      console.error(
        `Error al intentar eliminar el viaje:`,
        (error as Error).message
      );

      const toast = await this.toastController.create({
        message:
          (error as Error).message ||
          'No tienes permisos para eliminar este viaje.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
  }

  async cancelarViaje(viajeId: string) {
    console.log('ID del viaje recibido para cancelar:', viajeId);

    if (!viajeId) {
      console.error('El ID del viaje no es válido. No se puede cancelar.');
      return;
    }

    try {
      // Llama al servicio Firestore para eliminar el viaje
      await this.firestoreService.eliminarViaje(viajeId);

      console.log(
        `Viaje con ID ${viajeId} cancelado exitosamente de Firestore.`
      );

      // Actualiza dinámicamente la lista de viajes pendientes
      this.viajesPendientes = this.viajesPendientes.filter(
        (viaje) => viaje.id !== viajeId
      );
      console.log(
        'Lista actualizada de viajes pendientes:',
        this.viajesPendientes
      );

      const toast = await this.toastController.create({
        message: 'El viaje ha sido cancelado correctamente.',
        duration: 2000,
        position: 'bottom',
        color: 'warning',
      });
      await toast.present();
    } catch (error) {
      console.error(
        `Error al intentar cancelar el viaje:`,
        (error as Error).message
      );

      const toast = await this.toastController.create({
        message: 'Hubo un error al cancelar el viaje. Inténtalo de nuevo.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
  }
}
