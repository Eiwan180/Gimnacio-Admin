import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../config';
import { Sesion } from '../servicios/sesion';

export const tokenInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const token = inject(Sesion).token();
  // Nunca se adjunta el JWT a servidores ajenos al backend.
  if (!token || !peticion.url.startsWith(`${API_URL}/`)) return siguiente(peticion);
  return siguiente(peticion.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  }));
};
