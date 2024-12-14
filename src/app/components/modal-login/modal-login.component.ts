import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RolUsuarioService } from '../../services/rol-usuario.service';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.scss'],
})
export class ModalLoginComponent {
  constructor(
    private modalController: ModalController,
    private router: Router,
    private rolUsuarioService: RolUsuarioService
  ) {}

  navegarPasajero() {
    this.rolUsuarioService.setRolUsuario('pasajero');
    this.router.navigate(['home-pasajero']);
    this.dismissModal();
  }

  navegarConductor() {
    this.rolUsuarioService.setRolUsuario('conductor');
    this.router.navigate(['home-conductor']);
    this.dismissModal();
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
