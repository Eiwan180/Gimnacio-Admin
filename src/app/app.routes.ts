import { Routes } from '@angular/router';
import { adminGuard, adminHijosGuard } from './guardias/admin.guard';
import { cambiosSinGuardarGuard } from './guardias/cambios-sin-guardar.guard';

export const routes: Routes = [
  { path: 'entrar', loadComponent: () => import('./paginas/entrar/entrar').then(m => m.Entrar) },
  {
    path: '',
    loadComponent: () => import('./paginas/panel/panel').then(m => m.Panel),
    canActivate: [adminGuard],
    canActivateChild: [adminHijosGuard],
    children: [
      { path: '', redirectTo: 'clases', pathMatch: 'full' },
      { path: 'clases', loadComponent: () => import('./paginas/lista-clases/lista-clases').then(m => m.ListaClases) },
      { path: 'clases/nueva', loadComponent: () => import('./paginas/formulario-clase/formulario-clase').then(m => m.FormularioClase), canDeactivate: [cambiosSinGuardarGuard] },
      { path: 'clases/:id/editar', loadComponent: () => import('./paginas/formulario-clase/formulario-clase').then(m => m.FormularioClase), canDeactivate: [cambiosSinGuardarGuard] },
      { path: 'horarios', loadComponent: () => import('./paginas/horarios/horarios').then(m => m.Horarios) },
      { path: 'miembros', loadComponent: () => import('./paginas/miembros/miembros').then(m => m.Miembros) },
    ],
  },
  { path: '**', redirectTo: 'clases' },
];
