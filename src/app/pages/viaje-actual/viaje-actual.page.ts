import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { RolUsuarioService } from 'src/app/services/rol-usuario.service';

@Component({
  selector: 'app-viaje-actual',
  templateUrl: './viaje-actual.page.html',
  styleUrls: ['./viaje-actual.page.scss'],
})
export class ViajeActualPage implements OnInit, OnDestroy {
  viajeActual: any = null;
  botonHabilitado: boolean = true;
  tiempoRestante: number = 10; // Temporizador de 10 segundos
  intervalo: any; // Para almacenar la referencia al setInterval
  datosConductor: any = null;
  esConductor: boolean = false; // Variable para verificar si es conductor

  constructor(
    private rolUsuarioService: RolUsuarioService,
    private toastController: ToastController,
    private navController: NavController,
    private firestoreService: FirestoreService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.esConductor = this.rolUsuarioService.esConductor();
    const viajeId = this.route.snapshot.paramMap.get('id'); // ID del viaje desde la URL

    this.intervalo = setInterval(() => {
      this.verificarEstadoViaje();
    }, 3000); // Verifica el estado cada 3 segundos

    if (viajeId) {
      try {
        this.viajeActual = await this.firestoreService.getViajeActual(viajeId);

        if (this.viajeActual) {
          console.log('Datos del viaje cargados:', this.viajeActual);

          // Cargar datos del conductor
          if (this.viajeActual.conductorCorreo) {
            const conductores = await this.firestoreService.getDocumentsByQuery(
              'users',
              'email',
              this.viajeActual.conductorCorreo
            );

            if (conductores.length > 0) {
              this.datosConductor = conductores[0];
              console.log('Datos del conductor:', this.datosConductor);
            } else {
              console.warn('No se encontraron datos del conductor.');
            }
          }
        } else {
          console.warn('El viaje no existe o no se pudo cargar.');
          await this.mostrarMensaje('No se encontraron datos del viaje.');
          this.navController.navigateRoot('/listado-de-viajes');
        }
      } catch (error) {
        console.error('Error al cargar el viaje:', error);
        await this.mostrarMensaje('Error al cargar los datos del viaje.');
        this.navController.navigateRoot('/listado-de-viajes');
      }
    }

    console.log('Estado del viaje al cargar:', this.viajeActual.estado);

    // Manejo según el estado del viaje
    switch (this.viajeActual.estado) {
      case 'pendiente':
        this.iniciarTemporizador();
        break;
      case 'aceptado':
        await this.mostrarMensaje('El viaje ya está en progreso.');
        break;
      case 'en curso':
        console.log('El viaje ya está en curso.');
        // Permitir al pasajero permanecer en la vista sin redirección
        break;
      default:
        console.warn('Estado del viaje desconocido:', this.viajeActual.estado);
        await this.mostrarMensaje('El estado del viaje no es válido.');
        this.navController.navigateRoot('/listado-de-viajes');
    }
  }

  // Método para mostrar mensajes con ToastController
  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: 'warning',
    });
    await toast.present();
  }

  // Iniciar un temporizador regresivo
  iniciarTemporizador() {
    if (this.intervalo) {
      clearInterval(this.intervalo); // Detener cualquier temporizador previo
    }

    this.intervalo = setInterval(async () => {
      this.tiempoRestante--;

      // Si el contador llega a 0
      if (this.tiempoRestante === 0) {
        this.botonHabilitado = false; // Deshabilitar el botón
        clearInterval(this.intervalo); // Detener el temporizador

        // Actualizar el estado del viaje a "activo" en Firestore
        await this.firestoreService.actualizarEstadoViaje(
          this.viajeActual.id,
          'aceptado'
        );
        this.viajeActual.estado = 'aceptado'; // Actualizar estado local
        console.log('Estado del viaje actualizado a "aceptado".');
      }

      // Si el botón es habilitado por cancelar el viaje
      if (this.viajeActual.estado === 'pendiente' && this.botonHabilitado) {
        clearInterval(this.intervalo); // Detener el temporizador
        this.botonHabilitado = true; // Mantienehabilitado el botón
        this.tiempoRestante = 10; // Reinicia el contador
        console.log('El viaje fue cancelado. Estado: pendiente.');

        // Redirigir al listado de viajes
        this.navController.navigateRoot('/listado-de-viajes');
      }
    }, 1000); // Actualización cada segundo
  }

  // Método para cancelar el viaje
  async cancelarViaje() {
    if (!this.viajeActual) {
      console.warn('No se encontró un viaje para cancelar.');
      return;
    }

    if (this.botonHabilitado) {
      console.log('Cancelando el viaje...');

      // Cambiar el estado del viaje en Firestore a "pendiente"
      await this.firestoreService.actualizarEstadoViaje(
        this.viajeActual.id,
        'pendiente'
      );

      // Actualizar localmente el estado del viaje
      this.viajeActual.estado = 'pendiente';

      // Mostrar mensaje de éxito
      await this.mostrarMensaje('Viaje cancelado exitosamente.');

      // Detener el temporizador actual
      clearInterval(this.intervalo);

      // Reactivar el botón y reiniciar el contador
      this.botonHabilitado = true;
      this.tiempoRestante = 10;

      // Redirigir al listado de viajes
      this.navController.navigateRoot('/listado-de-viajes');

      console.log(
        'Estado del viaje actualizado localmente a "pendiente" y redirigido.'
      );
    } else {
      console.warn('El temporizador ya finalizó. No se puede cancelar.');
      await this.mostrarMensaje(
        'El viaje no puede ser cancelado en este momento.'
      );
    }
  }

  async terminarViaje() {
    console.log('🚦 Terminando el viaje...');

    try {
      // Actualizar el estado del viaje en Firestore
      await this.firestoreService.actualizarEstadoViaje(
        this.viajeActual.id,
        'finalizado'
      );
      console.log(`✅ Viaje con ID ${this.viajeActual.id} finalizado.`);

      // Mostrar mensaje de confirmación al conductor
      const toast = await this.toastController.create({
        message: 'El viaje ha finalizado correctamente.',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();

      // Redirigir al conductor o al pasajero según el rol
      if (this.esConductor) {
        this.navController.navigateRoot('/listado-de-viajes'); // Vista de conductor
      } else {
        this.navController.navigateRoot(
          `/resumen-viaje/${this.viajeActual.id}`
        );
      }
    } catch (error) {
      console.error('❌ Error al finalizar el viaje:', error);

      const toastError = await this.toastController.create({
        message: 'Hubo un error al finalizar el viaje. Inténtalo nuevamente.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toastError.present();
    }
  }

  async verificarEstadoViaje() {
    const viaje = await this.firestoreService.getViajeActual(
      this.viajeActual.id
    );
    if (viaje) {
      this.viajeActual.estado = viaje.estado;
      console.log('Estado del viaje actualizado:', this.viajeActual.estado);

      // Si el estado es "finalizado", redirige al resumen del viaje
      if (this.viajeActual.estado === 'finalizado') {
        console.log('El viaje ha terminado. Redirigiendo al resumen...');
        clearInterval(this.intervalo); // Detenemos cualquier intervalo en curso
        this.navController.navigateRoot(
          `/resumen-viaje/${this.viajeActual.id}`
        );
      }
    } else {
      console.error('No se encontraron datos del viaje.');
    }
  }

  // Limpiar el temporizador al destruir el componente
  ngOnDestroy() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }
}
