import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../config';
import type { Clase, ClaseConHorarios, ClaseNueva, Sobre } from '../modelos/clase';

@Injectable({ providedIn: 'root' })
export class ClasesApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/clases`;

  buscar(q: string) {
    return this.http.get<Sobre<Clase[]>>(this.url, {
      params: q ? { q } : {},
    });
  }

  crear(clase: ClaseNueva) {
    return this.http.post<Sobre<Clase>>(this.url, clase);
  }

  obtener(id: number) {
    return this.http.get<Sobre<ClaseConHorarios>>(`${this.url}/${id}`);
  }

  actualizar(id: number, clase: ClaseNueva) {
    return this.http.patch<Sobre<Clase>>(`${this.url}/${id}`, clase);
  }

  eliminar(id: number) {
    return this.http.delete<Sobre<Clase>>(`${this.url}/${id}`);
  }
}
