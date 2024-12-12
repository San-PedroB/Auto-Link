import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { GuardarCorreoService } from '../services/guardar-correo.service';
import { RolUsuarioService } from '../services/rol-usuario.service';
import { FirestoreService } from '../services/firestore/firestore.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private guardarCorreoService: GuardarCorreoService,
    private router: Router,
    private rolUsuarioService: RolUsuarioService,
    private firestoreService: FirestoreService,
    private toastController: ToastController
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const usuarioLogueado = this.guardarCorreoService.getCorreoUsuario();

    if (!usuarioLogueado) {
      console.warn('Usuario no autenticado, redirigiendo al login.');
      return this.router.parseUrl('/login'); // Redirige al login si no está autenticado
    }

    // Redirigir al home correspondiente si el usuario está intentando acceder al login
    if (state.url === '/login') {
      const esConductor = this.rolUsuarioService.esConductor(); // Verificar rol
      return this.router.parseUrl(
        esConductor ? '/home-conductor' : '/home-pasajero'
      );
    }

    // Evitar que un conductor con viaje activo acceda a "crear-viaje"
    if (state.url === '/crear-viaje') {
      const esConductor = this.rolUsuarioService.esConductor();
      if (esConductor) {
        const tieneViajeActivo =
          await this.firestoreService.verificarViajeActivo(usuarioLogueado); // Verificar si tiene viaje activo

        if (tieneViajeActivo) {
          const toast = await this.toastController.create({
            message: 'El conductor ya tiene un viaje activo.',
            duration: 2000,
            position: 'bottom',
            color: 'warning',
          });
          await toast.present();
          return this.router.parseUrl('/home-conductor'); // Redirigir al home del conductor
        }
      }
    }

    return true; // Permite el acceso si está autenticado
  }
}
