import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home-conductor',
    loadChildren: () =>
      import('./pages/home-conductor/home-conductor.module').then(
        (m) => m.HomeConductorPageModule
      ),
    canActivate: [AuthGuard], // Proteger esta ruta con el guard
  },
  {
    path: 'home-pasajero',
    loadChildren: () =>
      import('./pages/home-pasajero/home-pasajero.module').then(
        (m) => m.HomePasajeroPageModule
      ),
    canActivate: [AuthGuard], // Proteger esta ruta con el guard
  },
  {
    path: 'registro',
    loadChildren: () =>
      import('./pages/registro/registro.module').then(
        (m) => m.RegistroPageModule
      ),
  },
  {
    path: 'perfil-usuario',
    loadChildren: () =>
      import('./pages/perfil-usuario/perfil-usuario.module').then(
        (m) => m.PerfilUsuarioPageModule
      ),
    canActivate: [AuthGuard], // Proteger esta ruta con el guard
  },
  {
    path: 'crear-viaje',
    loadChildren: () =>
      import('./pages/crear-viaje/crear-viaje.module').then(
        (m) => m.CrearViajePageModule
      ),
    canActivate: [AuthGuard], // Proteger esta ruta con el guard
  },
  {
    path: 'listado-de-viajes',
    loadChildren: () =>
      import('./pages/listado-de-viajes/listado-de-viajes.module').then(
        (m) => m.ListadoDeViajesPageModule
      ),
    canActivate: [AuthGuard], // Proteger esta ruta con el guard
  },
  {
    path: 'cambiar-password',
    loadChildren: () =>
      import('./pages/cambiar-password/cambiar-password.module').then(
        (m) => m.CambiarPasswordPageModule
      ),
    canActivate: [AuthGuard], // Proteger esta ruta con el guard
  },
  {
    path: 'viaje-actual/:id',
    loadChildren: () =>
      import('./pages/viaje-actual/viaje-actual.module').then(
        (m) => m.ViajeActualPageModule
      ),
    canActivate: [AuthGuard], // Proteger esta ruta con el guard
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
