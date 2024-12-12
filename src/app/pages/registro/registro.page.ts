import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  ToastController,
  ModalController,
  NavController,
} from '@ionic/angular';

import { FirestoreService } from '../../services/firestore/firestore.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  formularioRegistro: FormGroup;

  constructor(
    public modalController: ModalController,
    public fb: FormBuilder,
    private toastController: ToastController,
    private navController: NavController,
    private firestoreService: FirestoreService
  ) {
    this.formularioRegistro = this.fb.group({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmarPassword: new FormControl('', Validators.required),
    });
  }

  async comprobarContraseña() {
    if (
      this.formularioRegistro.value.password !=
      this.formularioRegistro.value.confirmarPassword
    ) {
      const toastError = await this.toastController.create({
        message:
          'Las contraseñas no coinciden. Por favor, asegúrate de escribir la misma contraseña en ambos campos.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toastError.present();
      return false;
    }
    return true;
  }

  async registrarse() {
    if (this.formularioRegistro.invalid) {
      const toastError = await this.toastController.create({
        message:
          'Hay campos incompletos o incorrectos. Revisa el formulario y asegúrate de que toda la información sea válida.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toastError.present();
      return;
    }
    const passwordValida = await this.comprobarContraseña();
    if (!passwordValida) {
      return;
    }
    this.enviarFormulario();
  }

  async enviarFormulario() {
    // Verificar si el correo ya está registrado
    if (this.formularioRegistro.valid) {
      const documentos = await this.firestoreService.getDocumentsByQuery(
        'users', // Nombre de la colección
        'email', // Campo a buscar
        this.formularioRegistro.value.email // Valor a buscar
      );

      const data = documentos.length > 0 ? documentos[0] : null; // Verificar si hay resultados

      if (data) {
        const toastError = await this.toastController.create({
          message: 'El correo ya esta registrado',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
        });
        await toastError.present();
        return;
      }

      await this.firestoreService.createDocument(
        'users', //nombre de la coleccion
        this.formularioRegistro.value
      );

      console.log('Datos guardados:', this.formularioRegistro.value);
      const toastRegistro = await this.toastController.create({
        message: '¡Usuario creado exitosamente!',
        duration: 3000,
        position: 'bottom',
      });
      await toastRegistro.present();
      this.navController.navigateRoot('/login');
    }
  }

  ngOnInit() {}
}
