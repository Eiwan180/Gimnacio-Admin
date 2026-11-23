import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, map, of, startWith, switchMap, tap } from 'rxjs';
import { API_URL } from './config';
import type { Categoria, Clase } from './modelos/clase';
import { ClasesApi } from './servicios/clases-api';
import { mensajeDeApi } from './servicios/errores';

export type FiltroCategoria = Categoria | 'todas';

interface EstadoCatalogo {
  clases: Clase[];
  cargando: boolean;
  error: string;
}

const estadoInicial: EstadoCatalogo = {
  clases: [],
  cargando: true,
  error: '',
};

@Injectable({ providedIn: 'root' })
export class Catalogo {
  private readonly api = inject(ClasesApi);
  private readonly solicitudes$ = new BehaviorSubject({ q: '', revision: 0 });

  readonly categoria = signal<FiltroCategoria>('todas');
  readonly seleccionada = signal<Clase | null>(null);
  readonly termino = signal('');

  // Cada búsqueda cancela la petición anterior. El catchError va adentro
  // para que el buscador siga funcionando después de un fallo de la API.
  private readonly estado = toSignal(
    this.solicitudes$.pipe(
      switchMap(({ q }) =>
        this.api.buscar(q).pipe(
          tap(({ data }) => {
            const elegida = this.seleccionada();
            if (elegida && !data.some((clase) => clase.id === elegida.id)) {
              this.seleccionada.set(null);
            }
          }),
          map(({ data }): EstadoCatalogo => ({
            clases: data.map((clase) => ({
              ...clase,
              imagen: clase.imagen.startsWith('http')
                ? clase.imagen
                : `${API_URL}${clase.imagen}`,
            })),
            cargando: false,
            error: '',
          })),
          catchError((error: unknown) =>
            of<EstadoCatalogo>({ clases: [], cargando: false, error: mensajeDeApi(error) }),
          ),
          startWith(estadoInicial),
        ),
      ),
    ),
    { initialValue: estadoInicial },
  );

  readonly cargando = computed(() => this.estado().cargando);
  readonly clases = computed(() => this.estado().clases);
  readonly mensajeError = computed(() => this.estado().error);

  readonly clasesVisibles = computed(() => {
    const categoria = this.categoria();
    const clases = this.clases();
    return categoria === 'todas'
      ? clases
      : clases.filter((clase) => clase.categoria === categoria);
  });

  readonly minutosVisibles = computed(() =>
    this.clasesVisibles().reduce((total, clase) => total + clase.duracionMin, 0),
  );

  readonly clasesLargasVisibles = computed(() =>
    this.clasesVisibles().filter((clase) => clase.duracionMin >= 60).length,
  );

  buscar(texto: string): void {
    const q = texto.trim();
    this.termino.set(q);
    this.solicitudes$.next({ q, revision: this.solicitudes$.value.revision + 1 });
  }

  // Se conserva la recarga para reflejar los cambios al crear, editar o borrar.
  recargar(): void {
    const actual = this.solicitudes$.value;
    this.solicitudes$.next({ q: actual.q, revision: actual.revision + 1 });
  }

  elegirCategoria(categoria: FiltroCategoria): void {
    this.categoria.set(categoria);
    const elegida = this.seleccionada();
    if (elegida && !this.clasesVisibles().some((clase) => clase.id === elegida.id)) {
      this.seleccionada.set(null);
    }
  }

  seleccionarClase(clase: Clase): void {
    this.seleccionada.set(clase);
  }

  reintentar(): void {
    this.seleccionada.set(null);
    this.recargar();
  }
}
