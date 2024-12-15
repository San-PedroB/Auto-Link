import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalaDeEsperaPage } from './sala-de-espera.page';

const routes: Routes = [
  {
    path: '',
    component: SalaDeEsperaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalaDeEsperaPageRoutingModule {}
