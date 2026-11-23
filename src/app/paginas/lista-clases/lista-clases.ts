import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Catalogo } from '../../catalogo';
import { FiltroCategoriaComponent } from '../../componentes/filtro-categoria/filtro-categoria';
import { TarjetaClase } from '../../componentes/tarjeta-clase/tarjeta-clase';

@Component({
  selector: 'app-lista-clases',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FiltroCategoriaComponent, TarjetaClase],
  styleUrl: './lista-clases.css',
  templateUrl: './lista-clases.html',
})
export class ListaClases {
  readonly catalogo = inject(Catalogo);
  readonly busqueda = new FormControl('', { nonNullable: true });

  constructor() {
    this.busqueda.setValue(this.catalogo.termino(), { emitEvent: false });
    this.busqueda.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe((texto) => this.catalogo.buscar(texto));
  }
}
