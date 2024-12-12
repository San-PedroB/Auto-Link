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

    if (viajeId) {
      this.viajeActual = await this.firestoreService.getViajeActual(viajeId);
      if (this.viajeActual?.conductorCorreo) {
        // Obtener datos del conductor usando el correo
        const conductores = await this.firestoreService.getDocumentsByQuery(
          'users',
          'email',
          this.viajeActual.conductorCorreo
        );
        if (conductores.length > 0) {
          this.datosConductor = conductores[0];
        }
      }
    }

    if (!this.viajeActual) {
      console.warn('No se encontraron datos para el viaje actual.');
      await this.mostrarMensaje('No hay información del viaje actual.');
      this.navController.navigateRoot('/listado-de-viajes');
      return;
    }

    console.log('Estado del viaje al cargar:', this.viajeActual.estado);

    // Manejo según el estado del viaje
    switch (this.viajeActual.estado) {
      case 'pendiente':
        this.iniciarTemporizador(); // Inicia temporizador si está pendiente
        break;
      case 'aceptado':
        // Si ya está activo, permanece en la vista
        await this.mostrarMensaje('El viaje ya está en progreso.');
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

  // Limpiar el temporizador al destruir el componente
  ngOnDestroy() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }
}
