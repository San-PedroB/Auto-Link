import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePasajeroPageRoutingModule } from './home-pasajero-routing.module';

import { HomePasajeroPage } from './home-pasajero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePasajeroPageRoutingModule
  ],
  declarations: [HomePasajeroPage]
})
export class HomePasajeroPageModule {}
