import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { Sesion } from '../servicios/sesion';

export const adminGuard: CanActivateFn = (_ruta, estado) => {
  const sesion = inject(Sesion);
  const router = inject(Router);
  return sesion.esAdmin()
    ? true
    : router.createUrlTree(['/entrar'], { queryParams: { retorno: estado.url } });
};

export const adminHijosGuard: CanActivateChildFn = (_ruta, estado) => {
  const sesion = inject(Sesion);
  const router = inject(Router);
  return sesion.esAdmin()
    ? true
    : router.createUrlTree(['/entrar'], { queryParams: { retorno: estado.url } });
};
