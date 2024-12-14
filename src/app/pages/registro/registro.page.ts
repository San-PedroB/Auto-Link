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
import { FirebaseError } from 'firebase/app';

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
    if (this.formularioRegistro.valid) {
      try {
        const email = this.formularioRegistro.value.email;
        const password = this.formularioRegistro.value.password;
        const nombre = this.formularioRegistro.value.nombre;
        const apellido = this.formularioRegistro.value.apellido;

        // 1. Registrar en Firebase Authentication
        const uid = await this.firestoreService.registrarUsuarioFirebase(
          email,
          password
        );

        // 2. Guardar datos adicionales en Firestore
        const datosUsuario = {
          uid, // Vinculamos con el UID de Firebase Authentication
          nombre,
          apellido,
          email,
        };
        await this.firestoreService.createDocument('users', datosUsuario);

        // 3. Confirmar registro exitoso
        console.log('Usuario registrado exitosamente:', datosUsuario);
        const toastExito = await this.toastController.create({
          message: '¡Usuario registrado exitosamente!',
          duration: 3000,
          position: 'bottom',
          color: 'success',
        });
        await toastExito.present();

        // Redirigir al usuario a la página de login
        this.navController.navigateRoot('/login');
      } catch (error: unknown) {
        console.error('Error al registrar usuario:', error);

        // Verifica si el error es de tipo FirebaseError
        let mensajeError = 'Ocurrió un error al registrar al usuario.';
        if (error instanceof FirebaseError) {
          if (error.code === 'auth/email-already-in-use') {
            mensajeError = 'El correo ingresado ya está registrado.';
          }
        }

        const toastError = await this.toastController.create({
          message: mensajeError,
          duration: 3000,
          position: 'bottom',
          color: 'danger',
        });
        await toastError.present();
      }
    } else {
      const toastErrorCampos = await this.toastController.create({
        message: 'Por favor, completa todos los campos correctamente.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toastErrorCampos.present();
    }
  }

  ngOnInit() {}
}
