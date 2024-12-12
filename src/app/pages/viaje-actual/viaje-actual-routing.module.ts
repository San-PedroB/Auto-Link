import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajeActualPage } from './viaje-actual.page';

const routes: Routes = [
  {
    path: '',
    component: ViajeActualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajeActualPageRoutingModule {}
