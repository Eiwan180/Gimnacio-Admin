import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { API_URL } from '../../config';
import type { Sobre } from '../../modelos/clase';
import { mensajeDeApi } from '../../servicios/errores';
import { RespuestaLogin, Sesion } from '../../servicios/sesion';

@Component({
  selector: 'app-entrar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './entrar.html',
})
export class Entrar {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly sesion = inject(Sesion);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  readonly guardando = signal(false);
  readonly error = signal('');
  readonly formulario = this.fb.nonNullable.group({
    correo: ['admin@itson.mx', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  entrar(): void {
    this.error.set('');
    if (this.formulario.invalid || this.guardando()) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.http.post<Sobre<RespuestaLogin>>(`${API_URL}/auth/login`, this.formulario.getRawValue())
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (respuesta) => {
          if (!this.sesion.iniciar(respuesta.data)) {
            this.error.set('Acceso rechazado: esta cuenta es de miembro o entrenador. Sólo administradores.');
            return;
          }
          const retorno = this.ruta.snapshot.queryParamMap.get('retorno');
          void this.router.navigateByUrl(retorno?.startsWith('/') && !retorno.startsWith('//')
            ? retorno : '/clases');
        },
        error: (error: unknown) => this.error.set(mensajeDeApi(error)),
      });
  }
}
