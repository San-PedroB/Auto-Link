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
    private guardarCorreoService: GuardarCorreoService // Inyecta el AuthService aquí
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

    // Acceder a los valores del formulario usando la notación de corchetes
    const email = this.formularioLogin.value['email'];
    const password = this.formularioLogin.value['password'];

    // Obtener los datos del usuario desde Firestore
    const documentosEmail = await this.firestoreService.getDocumentsByQuery(
      'users',
      'email',
      email
    );
    const dataEmail = documentosEmail.length > 0 ? documentosEmail[0] : null; // Toma el primer resultado si existe

    const documentosPassword = await this.firestoreService.getDocumentsByQuery(
      'users',
      'password',
      password
    );
    const dataPassword =
      documentosPassword.length > 0 ? documentosPassword[0] : null; // Toma el primer resultado si existe

    // Verificar si las propiedades existen y comparar valores
    if (
      dataEmail &&
      dataPassword &&
      dataEmail['email'] === email &&
      dataPassword['password'] === password
    ) {
      // Almacenar el correo en el servicio de autenticación
      this.guardarCorreoService.setCorreoUsuario(email);

      // Abre el modal de login exitoso
      this.abrirModalLogin();
    } else {
      // Mostrar mensaje de error si las credenciales no coinciden
      const toastError = await this.toastController.create({
        message: 'Correo o contraseña incorrectos',
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
      cssClass: 'custom-modal-class',
    });
    return await modal.present();
  }

  ionViewWillEnter() {
    const img = document.querySelector('.fade'); // Selecciona el elemento
    if (img) {
      const fadeAnimation = this.animationCtrl
        .create()
        .addElement(img)
        .duration(1000)
        .fromTo('opacity', 0, 1); // Animación de opacidad

      fadeAnimation.play();
    }
  }

  ngOnInit() {}
}
