import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RolUsuarioService } from '../../services/rol-usuario.service';  // Importa el servicio de rol

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.scss'],
})
export class ModalLoginComponent {

  constructor(
    private modalController: ModalController,
    private router: Router,
    private rolUsuarioService: RolUsuarioService  // Inyecta el servicio de rol
  ) {}

  navegarPasajero() {
    this.rolUsuarioService.setRolUsuario('pasajero');  // Establece el rol como 'pasajero'
    this.router.navigate(['home-pasajero']);
    console.log('Iniciar sesión como Pasajero');
    this.dismissModal();
  }

  navegarConductor() {
    this.rolUsuarioService.setRolUsuario('conductor');  // Establece el rol como 'conductor'
    this.router.navigate(['home-conductor']);
    console.log('Iniciar sesión como Conductor');
    this.dismissModal();
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
