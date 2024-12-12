import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GuardarCorreoService {
  private correoUsuario: string | null = null;

  constructor() {}

  // Método para guardar el correo del usuario al loguearse
  setCorreoUsuario(correo: string) {
    this.correoUsuario = correo;
    console.log('Correo guardado:', this.correoUsuario); // VERIFICACION BORRAR DSP ASDSADASD
  }

  // Método para obtener el correo del usuario logueado
  getCorreoUsuario(): string | null {
    return this.correoUsuario;
  }

  // Método para borrar el correo del usuario (por ejemplo, al cerrar sesión)
  limpiarCorreoUsuario() {
    this.correoUsuario = null;
  }
}
