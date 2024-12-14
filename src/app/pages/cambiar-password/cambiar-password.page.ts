import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.page.html',
  styleUrls: ['./cambiar-password.page.scss'],
})
export class CambiarPasswordPage {
  formularioCambio: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private firestoreService: FirestoreService,
    private navController: NavController
  ) {
    this.formularioCambio = this.fb.group({
      actualPassword: ['', [Validators.required]],
      nuevaPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
    });
  }

  async actualizarContrasena() {
    if (
      this.formularioCambio.value.nuevaPassword !==
      this.formularioCambio.value.confirmarPassword
    ) {
      const toast = await this.toastController.create({
        message: 'Las contraseñas nuevas no coinciden.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    try {
      // Validar la contraseña actual
      await this.firestoreService.validarContrasenaActual(
        this.firestoreService.getCorreoUsuarioActual()!,
        this.formularioCambio.value.actualPassword
      );

      // Actualizar la contraseña
      await this.firestoreService.actualizarContrasena(
        this.formularioCambio.value.nuevaPassword
      );

      const toast = await this.toastController.create({
        message: 'Contraseña actualizada con éxito.',
        duration: 3000,
        color: 'success',
      });
      await toast.present();
      this.navController.navigateBack('/perfil-usuario');
    } catch (error: any) {
      console.error('Detalles completos del error:', error);

      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password'
      ) {
        const toast = await this.toastController.create({
          message: 'La contraseña actual es incorrecta.',
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
      } else if (error.code === 'auth/weak-password') {
        const toast = await this.toastController.create({
          message: 'La nueva contraseña es demasiado débil.',
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
      } else {
        const toast = await this.toastController.create({
          message: 'Error al actualizar la contraseña.',
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
      }
    }
  }
}
