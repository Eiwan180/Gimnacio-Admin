import { computed, Injectable, signal } from '@angular/core';
import { CLASES_LOCALES } from './datos/clases-locales';
import type { Categoria, Clase } from './modelos/clase';

export type FiltroCategoria = Categoria | 'todas';

@Injectable({ providedIn: 'root' })
export class Catalogo {
  readonly clases = signal<Clase[]>([...CLASES_LOCALES]);
  readonly categoria = signal<FiltroCategoria>('todas');
  readonly seleccionada = signal<Clase | null>(null);

  readonly clasesVisibles = computed(() => {
    const categoria = this.categoria();
    const clases = this.clases();

    if (categoria === 'todas') {
      return clases;
    }

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

  vaciarCatalogo(): void {
    this.clases.set([]);
    this.seleccionada.set(null);
  }

  restaurarCatalogo(): void {
    this.clases.set([...CLASES_LOCALES]);
    this.categoria.set('todas');
    this.seleccionada.set(null);
  }
}
