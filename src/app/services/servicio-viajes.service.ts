import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServicioViajesService {
  private datosViaje: any = null; // Solo un objeto de viaje
  private viajeCreado: boolean = false; // Estado del viaje creado

  constructor() {}

  // funcion para establecer los datos del viaje
  setDatos(datos: any) {
    this.datosViaje = datos;
    this.viajeCreado = true; // Viaje creado true
  }

  // funcion para obtener los datos del viaje
  getDatos() {
    return this.datosViaje;
  }

  // funcion para terminar el viaje y resetear el formulario
  terminarViaje(formularioViaje: any) {
    // Borra los datos del formulario
    formularioViaje.reset();
    this.borrarViaje();
  }

  // funcion para borrar el viaje actual
  borrarViaje() {
    this.datosViaje = null;
    this.viajeCreado = false;
  }

  isViajeCreado() {
    return this.viajeCreado;
  }
}
