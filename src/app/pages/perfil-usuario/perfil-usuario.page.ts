import { Component, OnInit } from '@angular/core';
import { FormularioService } from '../../services/formulario.service'; // Importar el servicio
import { AnimationController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {
  datosFormulario: any = {};

  constructor(
    private formularioService: FormularioService,
    private animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    this.datosFormulario = this.formularioService.getDatos();
    // Verificar si los datos se cargan correctamente
    console.log('Datos del usuario:', this.datosFormulario);
  }
  ionViewWillEnter() {
    const cardElement = document.querySelector('.perfil-card'); // Selecciona el elemento
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
