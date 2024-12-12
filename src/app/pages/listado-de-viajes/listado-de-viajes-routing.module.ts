import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoDeViajesPage } from './listado-de-viajes.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoDeViajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoDeViajesPageRoutingModule {}
