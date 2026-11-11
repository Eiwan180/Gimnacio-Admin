import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { API_URL } from './config';
import type { Categoria, Clase, Sobre } from './modelos/clase';
import { mensajeDeApi } from './servicios/errores';

export type FiltroCategoria = Categoria | 'todas';

@Injectable({ providedIn: 'root' })
export class Catalogo {
  private readonly recurso = httpResource<Sobre<Clase[]>>(
    () => `${API_URL}/clases`,
  );

  readonly categoria = signal<FiltroCategoria>('todas');
  readonly seleccionada = signal<Clase | null>(null);
  readonly cargando = this.recurso.isLoading;

  readonly clases = computed<Clase[]>(() => {
    if (!this.recurso.hasValue()) return [];

    return this.recurso.value().data.map((clase) => ({
      ...clase,
      imagen: clase.imagen.startsWith('http')
        ? clase.imagen
        : `${API_URL}${clase.imagen}`,
    }));
  });

  readonly mensajeError = computed(() => {
    const error = this.recurso.error();
    return error ? mensajeDeApi(error) : '';
  });

  readonly clasesVisibles = computed(() => {
    const categoria = this.categoria();
    const clases = this.clases();

    if (categoria === 'todas') return clases;
    return clases.filter((clase) => clase.categoria === categoria);
  });

  readonly minutosVisibles = computed(() =>
    this.clasesVisibles().reduce(
      (total, clase) => total + clase.duracionMin,
      0,
    ),
  );

  readonly clasesLargasVisibles = computed(() =>
    this.clasesVisibles().filter((clase) => clase.duracionMin >= 60).length,
  );

  elegirCategoria(categoria: FiltroCategoria): void {
    this.categoria.set(categoria);

    const seleccionada = this.seleccionada();
    if (
      seleccionada &&
      !this.clasesVisibles().some((clase) => clase.id === seleccionada.id)
    ) {
      this.seleccionada.set(null);
    }
  }

  seleccionarClase(clase: Clase): void {
    this.seleccionada.set(clase);
  }

  reintentar(): void {
    this.recurso.reload();
  }
}
