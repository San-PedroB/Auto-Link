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

  async cargarTodosLosViajes() {
    try {
      // Obtener viajes pendientes
      this.viajesPendientes = await this.firestoreService.getDocumentsByQuery(
        'viajes',
        'estado',
        'pendiente'
      );

      // Agregar datos del conductor y pasajero a los viajes pendientes
      for (const viaje of this.viajesPendientes) {
        if (viaje.conductorCorreo) {
          const datosConductor =
            await this.firestoreService.obtenerDatosConductor(
              viaje.conductorCorreo
            );
          viaje.conductorNombre = datosConductor?.nombre || 'N/A';
          viaje.conductorApellido = datosConductor?.apellido || 'N/A';
        }
        if (viaje.pasajeroCorreo) {
          const datosPasajero =
            await this.firestoreService.obtenerDatosPasajero(
              viaje.pasajeroCorreo
            );
          viaje.pasajeroNombre = datosPasajero?.nombre || 'N/A';
          viaje.pasajeroApellido = datosPasajero?.apellido || 'N/A';
        }
      }

      // Obtener viajes aceptados
      this.viajesAceptados = await this.firestoreService.getDocumentsByQuery(
        'viajes',
        'estado',
        'aceptado'
      );

      // Agregar datos del conductor y pasajero a los viajes aceptados
      for (const viaje of this.viajesAceptados) {
        if (viaje.conductorCorreo) {
          const datosConductor =
            await this.firestoreService.obtenerDatosConductor(
              viaje.conductorCorreo
            );
          viaje.conductorNombre = datosConductor?.nombre || 'N/A';
          viaje.conductorApellido = datosConductor?.apellido || 'N/A';
        }
        if (viaje.pasajeroCorreo) {
          const datosPasajero =
            await this.firestoreService.obtenerDatosPasajero(
              viaje.pasajeroCorreo
            );
          viaje.pasajeroNombre = datosPasajero?.nombre || 'N/A';
          viaje.pasajeroApellido = datosPasajero?.apellido || 'N/A';
        }
      }

      console.log(
        'Viajes pendientes con datos adicionales:',
        this.viajesPendientes
      );
      console.log(
        'Viajes aceptados con datos adicionales:',
        this.viajesAceptados
      );
    } catch (error) {
      console.error('Error al cargar todos los viajes:', error);
    }
  }

  // Función auxiliar para agregar datos del conductor a una lista de viajes
  private async agregarDatosConductor(viajes: any[]): Promise<any[]> {
    for (const viaje of viajes) {
      if (viaje.conductorCorreo) {
        const datosConductor = await this.obtenerDatosConductor(
          viaje.conductorCorreo
        );
        viaje.conductorNombre = datosConductor?.nombre || 'N/A';
        viaje.conductorApellido = datosConductor?.apellido || 'N/A';
      }
    }
    return viajes;
  }

  // Método corregido para obtener los datos del conductor
  async obtenerDatosConductor(correo: string): Promise<any> {
    const conductores = await this.firestoreService.getDocumentsByQuery(
      'users',
      'email',
      correo
    );
    return conductores.length > 0 ? conductores[0] : null; // Retorna el primer conductor encontrado
  }

  // Función para tomar un viaje (solo para pasajeros)
  async tomarViaje(viaje: any) {
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

    // Cambiar el estado del viaje a "aceptado"
    await this.firestoreService.actualizarEstadoViaje(viaje.id, 'aceptado');

    // Actualizar dinámicamente la lista de viajes pendientes
    this.viajesPendientes = this.viajesPendientes.filter(
      (item) => item.id !== viaje.id
    );

    const toast = await this.toastController.create({
      message: 'Has tomado el viaje exitosamente.',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();

    // Navegar a la página de viaje actual
    this.navController.navigateRoot(`/viaje-actual/${viaje.id}`);
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
