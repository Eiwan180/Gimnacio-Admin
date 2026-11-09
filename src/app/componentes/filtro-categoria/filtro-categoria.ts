import { Component, inject } from '@angular/core';
import { Catalogo, type FiltroCategoria } from '../../catalogo';
import { CATEGORIAS } from '../../modelos/clase';

@Component({
  selector: 'app-filtro-categoria',
  standalone: true,
  templateUrl: './filtro-categoria.html',
})
export class FiltroCategoriaComponent {
  readonly catalogo = inject(Catalogo);
  readonly categorias = CATEGORIAS;

  cambiar(categoria: FiltroCategoria): void {
    this.catalogo.elegirCategoria(categoria);
  }
}
