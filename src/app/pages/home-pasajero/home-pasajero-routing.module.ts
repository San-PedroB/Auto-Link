import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePasajeroPage } from './home-pasajero.page';

const routes: Routes = [
  {
    path: '',
    component: HomePasajeroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePasajeroPageRoutingModule { }
