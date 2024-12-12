import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoDeViajesPageRoutingModule } from './listado-de-viajes-routing.module';

import { ListadoDeViajesPage } from './listado-de-viajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoDeViajesPageRoutingModule
  ],
  declarations: [ListadoDeViajesPage]
})
export class ListadoDeViajesPageModule {}
