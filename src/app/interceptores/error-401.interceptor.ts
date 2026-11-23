import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../config';
import { Sesion } from '../servicios/sesion';

export const error401Interceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const sesion = inject(Sesion);
  const router = inject(Router);
  return siguiente(peticion).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 &&
          peticion.url.startsWith(`${API_URL}/`) &&
          !peticion.url.endsWith('/auth/login') && sesion.token()) {
        sesion.salir();
        void router.navigateByUrl('/entrar');
      }
      return throwError(() => error);
    }),
  );
};
