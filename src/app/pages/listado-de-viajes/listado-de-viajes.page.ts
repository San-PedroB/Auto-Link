import { Component, OnInit } from '@angular/core';
import { RolUsuarioService } from '../../services/rol-usuario.service'; // Servicio de rol de usuario
import { ServicioViajesService } from '../../services/servicio-viajes.service'; // Servicio de viajes
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

  constructor(
    private servicioViajes: ServicioViajesService,
    private rolUsuarioService: RolUsuarioService,
    private toastController: ToastController,
    private navController: NavController,
    private firestoreService: FirestoreService
  ) {}

  async ngOnInit() {
    console.log('Inicializando listado de viajes...');

    // Verificar el rol del usuario
    this.esConductor = this.rolUsuarioService.esConductor();
    this.esPasajero = this.rolUsuarioService.esPasajero();
    console.log(
      'Rol del usuario - esConductor:',
      this.esConductor,
      'esPasajero:',
      this.esPasajero
    );

    if (this.esPasajero) {
      console.log('Buscando viajes aceptados para el pasajero...');
      const viajesAceptados = await this.firestoreService.getDocumentsByQuery(
        'viajes',
        'estado',
        'aceptado'
      );

      console.log('Viajes aceptados encontrados:', viajesAceptados);

      if (viajesAceptados.length > 0) {
        console.log('Redirigiendo a la vista de viaje actual...');
        this.navController.navigateRoot(
          `/viaje-actual/${viajesAceptados[0].id}`
        );
        return; // Salir de ngOnInit
      }
    }

    // Obtener todos los viajes en estado "pendiente"
    this.viajesPendientes = await this.firestoreService.getViajesPendientes();
    console.log('Viajes pendientes encontrados:', this.viajesPendientes);

    if (this.esConductor) {
      await this.cargarTodosLosViajes();
    } else if (this.esPasajero) {
      await this.cargarViajesPendientes();
    }
  }

  async cargarTodosLosViajes() {
    this.viajesPendientes = await this.firestoreService.getDocumentsByQuery(
      'viajes',
      'estado',
      'pendiente'
    );

    this.viajesAceptados = await this.firestoreService.getDocumentsByQuery(
      'viajes',
      'estado',
      'aceptado'
    );

    this.viajesPendientes = await this.agregarDatosConductor(
      this.viajesPendientes
    );
    this.viajesAceptados = await this.agregarDatosConductor(
      this.viajesAceptados
    );

    console.log(
      'Viajes pendientes con datos del conductor:',
      this.viajesPendientes
    );
    console.log(
      'Viajes aceptados con datos del conductor:',
      this.viajesAceptados
    );
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

  private async cargarViajesPendientes() {
    this.viajesPendientes = await this.firestoreService.getDocumentsByQuery(
      'viajes',
      'estado',
      'pendiente'
    );
    console.log('Viajes pendientes:', this.viajesPendientes);
  }

  async obtenerDatosConductor(correo: string): Promise<any> {
    const conductores = await this.firestoreService.getDocumentsByQuery(
      'users',
      'email',
      correo
    );
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
      console.error(`Error al eliminar el viaje con ID ${viajeId}:`, error);

      const toast = await this.toastController.create({
        message: 'Hubo un error al intentar eliminar el viaje.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
  }
}
