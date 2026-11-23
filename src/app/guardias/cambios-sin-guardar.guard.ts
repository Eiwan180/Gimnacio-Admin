import { CanDeactivateFn } from '@angular/router';
import { FormularioClase } from '../paginas/formulario-clase/formulario-clase';

export const cambiosSinGuardarGuard: CanDeactivateFn<FormularioClase> = (componente) =>
  componente.puedeSalir();
