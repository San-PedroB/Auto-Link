import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component'; // Importa el modal


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage, ModalLoginComponent,],
  exports: [LoginPage, ModalLoginComponent] // Exporta si es necesario
})
export class LoginPageModule {}
