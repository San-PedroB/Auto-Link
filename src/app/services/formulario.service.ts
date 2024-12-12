import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormularioService {
  private datosFormulario: any = {};

  constructor() {}

  // Método para establecer los datos del formulario
  setDatos(datos: any) {
    this.datosFormulario = datos;
  }

  // Método para obtener los datos del formulario
  getDatos() {
    return this.datosFormulario;
  }
}
