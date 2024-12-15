import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-sala-de-espera',
  templateUrl: './sala-de-espera.page.html',
  styleUrls: ['./sala-de-espera.page.scss'],
})
export class SalaDeEsperaPage implements OnInit, OnDestroy {
  viajeId: string = ''; // ID del viaje actual
  intervalo: any; // Almacena el setInterval
  estadoViaje: string = 'pendiente'; // Estado inicial
  conductorNombre: string = '';
  conductorApellido: string = '';

  constructor(
    private firestoreService: FirestoreService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.viajeId = history.state.viajeId; // Obtenemos el ID del viaje desde la navegación
    console.log('ID del viaje:', this.viajeId);

    // Iniciar verificación periódica del estado del viaje
    this.verificarEstadoViaje();
    this.intervalo = setInterval(() => {
      this.verificarEstadoViaje();
    }, 3000); // Verificación cada 3 segundos
  }
  async verificarEstadoViaje() {
    const viaje = await this.firestoreService.getViajeActual(this.viajeId);
    if (viaje) {
      this.estadoViaje = viaje.estado;
      console.log('Estado del viaje:', this.estadoViaje);

      // Obtener datos del conductor si existe su correo
      if (viaje.conductorCorreo) {
        const datosConductor =
          await this.firestoreService.obtenerDatosConductor(
            viaje.conductorCorreo
          );

        if (datosConductor) {
          this.conductorNombre = datosConductor.nombre || 'Desconocido';
          this.conductorApellido = datosConductor.apellido || '';
          console.log(
            'Conductor:',
            this.conductorNombre,
            this.conductorApellido
          );
        } else {
          console.warn('No se encontraron datos del conductor.');
        }
      } else {
        console.warn('El viaje no tiene un correo de conductor asociado.');
      }

      // Verificar si el viaje está "en curso" para redirigir
      if (this.estadoViaje === 'en curso') {
        console.log('El viaje ha iniciado. Redirigiendo...');

        // Esperar un momento antes de redirigir
        setTimeout(() => {
          clearInterval(this.intervalo); // Detenemos el intervalo
          this.navCtrl.navigateRoot(`/viaje-actual/${this.viajeId}`);
        }, 2000); // Añadir 1 segundo para asegurar que Firestore se actualizó
      }
    } else {
      console.error('No se encontró el viaje.');
    }
  }

  async cancelarEspera() {
    console.log('Cancelando la espera del pasajero...');

    try {
      const correoPasajero = this.firestoreService.getCorreoUsuarioActual();
      if (!correoPasajero) {
        console.error('No se pudo obtener el correo del pasajero.');
        return;
      }

      // Llamar al método cancelarParticipacion que corrige el problema
      await this.firestoreService.cancelarParticipacion(
        this.viajeId,
        correoPasajero
      );

      console.log(`✅ El pasajero ${correoPasajero} ha cancelado su espera.`);

      // Detener el intervalo y redirigir al listado de viajes
      clearInterval(this.intervalo);
      this.navCtrl.navigateRoot('/listado-de-viajes');
    } catch (error) {
      console.error('❌ Error al cancelar la espera:', error);
    }
  }

  ngOnDestroy() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }
}
