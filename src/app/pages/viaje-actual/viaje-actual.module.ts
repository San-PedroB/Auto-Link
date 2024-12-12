import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajeActualPageRoutingModule } from './viaje-actual-routing.module';

import { ViajeActualPage } from './viaje-actual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajeActualPageRoutingModule
  ],
  declarations: [ViajeActualPage]
})
export class ViajeActualPageModule {}
