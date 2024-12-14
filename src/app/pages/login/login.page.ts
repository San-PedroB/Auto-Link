import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  AnimationController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { GuardarCorreoService } from 'src/app/services/guardar-correo.service';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formularioLogin: FormGroup;
  usuario: string = '';
  password: string = '';
  navController = inject(NavController);

  constructor(
    public fb: FormBuilder,
    private toastController: ToastController,
    private modalController: ModalController,
    private firestoreService: FirestoreService,
    private animationCtrl: AnimationController,
    private guardarCorreoService: GuardarCorreoService
  ) {
    this.formularioLogin = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  async autenticarUsuario() {
    if (this.formularioLogin.invalid) {
      const toastErrorCampos = await this.toastController.create({
        message: 'Por favor completa correctamente todos los campos',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toastErrorCampos.present();
      return;
    }

    const email = this.formularioLogin.value['email'];
    const password = this.formularioLogin.value['password'];

    try {
      // Llamar al método de FirestoreService para iniciar sesión
      const user = await this.firestoreService.iniciarSesion(email, password);

      // Obtener el UID del usuario autenticado
      const uid = user.uid;
      console.log('Usuario autenticado con UID:', uid);

      // Opcional: cargar datos adicionales desde Firestore usando el UID
      const datosUsuario = await this.firestoreService.getDocumentsByQuery(
        'users',
        'uid',
        uid
      );
      if (datosUsuario.length > 0) {
        console.log('Datos adicionales del usuario:', datosUsuario[0]);
      }

      // Guardar el correo del usuario (opcional, según tu lógica)
      this.guardarCorreoService.setCorreoUsuario(email);

      // Mostrar modal de login exitoso
      this.abrirModalLogin();
    } catch (error: any) {
      console.error('Error al autenticar usuario:', error);

      // Mensaje genérico para cualquier error
      const mensajeError =
        'Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.';

      const toastError = await this.toastController.create({
        message: mensajeError,
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toastError.present();
    }
  }

  async abrirModalLogin() {
    const modal = await this.modalController.create({
      component: ModalLoginComponent,
      backdropDismiss: false,
    });
    await modal.present();
  }

  ionViewWillEnter() {
    const img = document.querySelector('.fade');
    if (img) {
      const fadeAnimation = this.animationCtrl
        .create()
        .addElement(img)
        .duration(1000)
        .fromTo('opacity', 0, 1);

      fadeAnimation.play();
    }
  }

  async recuperarContrasena() {
    const email = this.formularioLogin.value['email'];

    if (!email) {
      const toast = await this.toastController.create({
        message:
          'Por favor ingresa tu correo electrónico para restablecer tu contraseña.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
      return;
    }

    try {
      // Llamar al servicio para enviar el correo de restablecimiento
      await this.firestoreService.restablecerContrasena(email);

      const toast = await this.toastController.create({
        message:
          'Correo de restablecimiento enviado. Revisa tu bandeja de entrada.',
        duration: 3000,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();
    } catch (error: any) {
      console.error('Error al enviar el correo de restablecimiento:', error);

      const toast = await this.toastController.create({
        message: 'Error al enviar el correo. Verifica tu dirección de correo.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
  }

  ngOnInit() {}
}
