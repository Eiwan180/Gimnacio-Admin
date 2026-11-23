import { Component, effect, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Catalogo } from '../../catalogo';
import { CATEGORIAS, type Categoria, type ClaseNueva } from '../../modelos/clase';
import { ClasesApi } from '../../servicios/clases-api';
import { mensajeDeApi } from '../../servicios/errores';

const bloquesDeCinco: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (control.value === null || control.value === '') return null;
  const valor = Number(control.value);
  return Number.isFinite(valor) && valor % 5 === 0 ? null : { bloquesDeCinco: true };
};

@Component({
  selector: 'app-formulario-clase',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  styleUrl: './formulario-clase.css',
  templateUrl: './formulario-clase.html',
})
export class FormularioClase {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ClasesApi);
  private readonly catalogo = inject(Catalogo);
  private readonly router = inject(Router);

  // La ruta de edición inyecta :id gracias a withComponentInputBinding().
  readonly id = input<string>();
  readonly categorias = CATEGORIAS;
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly eliminando = signal(false);
  readonly error = signal('');
  readonly editando = signal(false);
  readonly claseId = signal<number | null>(null);

  readonly formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    categoria: this.fb.control<Categoria | null>(null, Validators.required),
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
    duracionMin: [45, [Validators.required, Validators.min(10), bloquesDeCinco]],
    imagen: ['', [Validators.required, Validators.maxLength(120)]],
  });

  constructor() {
    effect((onCleanup) => {
      const id = this.id();
      if (id === undefined) return; // /clases/nueva
      const numero = Number(id);
      this.editando.set(true);
      if (!Number.isSafeInteger(numero) || numero < 1) {
        this.error.set('El ID de la clase no es válido.');
        return;
      }
      this.claseId.set(numero);
      this.cargando.set(true);
      const subscripcion = this.api.obtener(numero)
        .pipe(finalize(() => this.cargando.set(false)))
        .subscribe({
          next: ({ data }) => {
            this.formulario.patchValue({
              nombre: data.nombre,
              categoria: data.categoria,
              descripcion: data.descripcion,
              duracionMin: data.duracionMin,
              imagen: data.imagen,
            });
            this.formulario.markAsPristine();
          },
          error: (error: unknown) => this.error.set(mensajeDeApi(error)),
        });
      onCleanup(() => subscripcion.unsubscribe());
    });
  }

  guardar(): void {
    this.error.set('');
    if (this.formulario.invalid || this.guardando() || this.cargando() || this.eliminando()) {
      this.formulario.markAllAsTouched();
      return;
    }
    const valor = this.formulario.getRawValue();
    const clase: ClaseNueva = {
      nombre: valor.nombre ?? '',
      categoria: valor.categoria as Categoria,
      descripcion: valor.descripcion ?? '',
      duracionMin: Number(valor.duracionMin),
      imagen: valor.imagen ?? '',
    };
    const id = this.claseId();
    this.guardando.set(true);
    const peticion = id === null ? this.api.crear(clase) : this.api.actualizar(id, clase);
    // HttpClient es un Observable frío: sin subscribe() no sale el POST/PATCH.
    peticion.pipe(finalize(() => this.guardando.set(false))).subscribe({
      next: () => {
        this.formulario.markAsPristine(); // Evita confirmar al salir tras guardar.
        this.catalogo.recargar();
        void this.router.navigateByUrl('/clases');
      },
      error: (error: unknown) => this.error.set(mensajeDeApi(error)),
    });
  }

  eliminar(): void {
    const id = this.claseId();
    if (id === null || this.guardando() || this.eliminando() ||
        !confirm('¿Eliminar esta clase? También se eliminarán sus horarios e inscripciones.')) return;
    this.error.set('');
    this.eliminando.set(true);
    this.api.eliminar(id).pipe(finalize(() => this.eliminando.set(false))).subscribe({
      next: () => {
        this.formulario.markAsPristine();
        this.catalogo.recargar();
        void this.router.navigateByUrl('/clases');
      },
      error: (error: unknown) => this.error.set(mensajeDeApi(error)),
    });
  }

  puedeSalir(): boolean {
    return !this.formulario.dirty ||
      confirm('Tienes cambios sin guardar. ¿Quieres salir y descartarlos?');
  }
}
