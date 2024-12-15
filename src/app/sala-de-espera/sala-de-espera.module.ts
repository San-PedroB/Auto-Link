import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalaDeEsperaPageRoutingModule } from './sala-de-espera-routing.module';

import { SalaDeEsperaPage } from './sala-de-espera.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalaDeEsperaPageRoutingModule
  ],
  declarations: [SalaDeEsperaPage]
})
export class SalaDeEsperaPageModule {}
