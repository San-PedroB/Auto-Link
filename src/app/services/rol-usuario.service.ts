import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RolUsuarioService {
  private rolUsuario: string = ''; // Almacenar el rol del usuario ('conductor' o 'pasajero')

  constructor() {}

  // Método para establecer el rol del usuario
  setRolUsuario(rol: string) {
    this.rolUsuario = rol;
  }

  // Método para obtener el rol del usuario
  getRolUsuario() {
    return this.rolUsuario;
  }

  // Método para verificar si el usuario es conductor
  esConductor(): boolean {
    return this.rolUsuario === 'conductor';
  }

  // Método para verificar si el usuario es pasajero
  esPasajero(): boolean {
    return this.rolUsuario === 'pasajero';
  }
}
