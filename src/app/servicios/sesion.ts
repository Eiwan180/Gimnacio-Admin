import { computed, Injectable, signal } from '@angular/core';
import type { Usuario } from '../modelos/clase';

// Contrato que devuelve POST /auth/login (dentro de { data, meta }).
export interface RespuestaLogin {
  access_token: string;
  token_type: string;
  expires_in: number;
  usuario: Usuario;
}

interface SesionGuardada {
  token: string;
  usuario: Usuario;
  expiraEn: number;
}

const CLAVE = 'gimnasio-admin-sesion';

@Injectable({ providedIn: 'root' })
export class Sesion {
  private readonly estado = signal<SesionGuardada | null>(this.recuperar());

  readonly usuario = computed(() => this.estado()?.usuario ?? null);
  readonly token = computed(() => this.estado()?.token ?? null);
  readonly esAdmin = computed(() => this.usuario()?.rol === 'admin' && !!this.token());

  iniciar(respuesta: RespuestaLogin): boolean {
    // Rechazar miembros y entrenadores ANTES de guardar el token.
    if (respuesta.usuario.rol !== 'admin') return false;

    const sesion: SesionGuardada = {
      token: respuesta.access_token,
      usuario: respuesta.usuario,
      expiraEn: Date.now() + respuesta.expires_in * 1000,
    };
    this.estado.set(sesion);
    try { localStorage.setItem(CLAVE, JSON.stringify(sesion)); } catch { /* almacenamiento bloqueado */ }
    return true;
  }

  salir(): void {
    this.estado.set(null);
    try { localStorage.removeItem(CLAVE); } catch { /* almacenamiento bloqueado */ }
  }

  private recuperar(): SesionGuardada | null {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (!guardado) return null;
      const sesion = JSON.parse(guardado) as SesionGuardada;
      if (!sesion.token || sesion.usuario?.rol !== 'admin' || sesion.expiraEn <= Date.now()) {
        localStorage.removeItem(CLAVE);
        return null;
      }
      return sesion;
    } catch {
      return null;
    }
  }
}
