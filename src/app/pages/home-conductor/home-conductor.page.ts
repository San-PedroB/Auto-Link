import { Component, OnInit } from '@angular/core';
import {
  AnimationController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { Router } from '@angular/router';
import { ServicioViajesService } from 'src/app/services/servicio-viajes.service'; // Importar servicio de viajes

@Component({
  selector: 'app-home-conductor',
  templateUrl: './home-conductor.page.html',
  styleUrls: ['./home-conductor.page.scss'],
})
export class HomeConductorPage implements OnInit {
  datosFormulario: any = {};

  constructor(
    private modalController: ModalController,
    private router: Router,
    private toastController: ToastController,
    private servicioViajes: ServicioViajesService,
    private animationCtrl: AnimationController
  ) {}

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async abrirModal() {
    const modal = await this.modalController.create({
      component: ModalLoginComponent,
    });
    return await modal.present();
  }

  ngOnInit() {
    console.log('Datos del usuario:', this.datosFormulario);
  }

  ionViewWillEnter() {
    const nameElement = document.querySelector('.fade'); // Seleccionar el elemento
    if (nameElement) {
      const fadeAnimation = this.animationCtrl
        .create()
        .addElement(nameElement)
        .duration(1000)
        .fromTo('opacity', 0, 1); // Desde opacidad 0 a 1

      fadeAnimation.play();
    }
  }

  async verificarEstadoViaje() {
    this.abirVentanaCrearViaje();
  }

  async abirVentanaCrearViaje() {
    this.router.navigate(['/crear-viaje']);
  }
}
