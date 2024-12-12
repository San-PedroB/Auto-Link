import { Component, OnInit } from '@angular/core';
import {
  AnimationController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { Router } from '@angular/router';
import { GuardarCorreoService } from '../../services/guardar-correo.service';
import { FormularioService } from '../../services/formulario.service'; // Importar el servicio
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
  selector: 'app-home-pasajero',
  templateUrl: './home-pasajero.page.html',
  styleUrls: ['./home-pasajero.page.scss'],
})
export class HomePasajeroPage implements OnInit {
  datosFormulario: any = {};
  viajeActivo: any = [];

  constructor(
    private modalController: ModalController,
    private router: Router,
    private formularioService: FormularioService,
    private animationCtrl: AnimationController,
    private fireStoreService: FirestoreService,
    private guardarCorreoService: GuardarCorreoService
  ) {}

  async ngOnInit() {
    this.datosFormulario = this.formularioService.getDatos();
    // Verificar si los datos se cargan correctamente
    console.log('Datos del usuario:', this.datosFormulario);

    // Verificar si el pasajero tiene un viaje activo
    const correoPasajero = this.guardarCorreoService.getCorreoUsuario();

    if (correoPasajero) {
      const viajes = await this.fireStoreService.getDocumentsByQuery(
        'viajes',
        'estado',
        'aceptado'
      );

      if (viajes.length > 0) {
        this.viajeActivo = viajes[0]; // Toma el primer viaje activo
        console.log('Viaje activo encontrado:', this.viajeActivo);
      } else {
        console.log('No hay viajes activos para el pasajero.');
      }
    }
  }

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
}
