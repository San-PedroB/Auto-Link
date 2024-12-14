import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { GuardarCorreoService } from 'src/app/services/guardar-correo.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {
  datosFormulario: any = {}; // Datos del usuario que se mostrarán en la vista

  constructor(
    private animationCtrl: AnimationController,
    private firestoreService: FirestoreService,
    private guardarCorreoService: GuardarCorreoService
  ) {}

  async ngOnInit() {
    // Obtener el correo del usuario logueado desde GuardarCorreoService
    const correo = this.guardarCorreoService.getCorreoUsuario();
    if (correo) {
      // Buscar los datos del usuario en Firestore usando el correo
      const usuarios = await this.firestoreService.getDocumentsByQuery(
        'users', // Colección en Firestore
        'email', // Campo a buscar
        correo // Correo del usuario logueado
      );

      // Asignar los datos directamente (asumimos que siempre existe)
      this.datosFormulario = usuarios[0];
      console.log('Datos del usuario cargados:', this.datosFormulario);
    }
  }

  ionViewWillEnter() {
    const cardElement = document.querySelector('.perfil-card'); // Selecciona el elemento de perfil
    if (cardElement) {
      const fadeAnimation = this.animationCtrl
        .create()
        .addElement(cardElement)
        .duration(1000)
        .fromTo('opacity', 0, 1); // Animación de opacidad

      fadeAnimation.play();
    }
  }
}
