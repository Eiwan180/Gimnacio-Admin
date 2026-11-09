import { Component, inject } from '@angular/core';
import { Catalogo } from './catalogo';
import { FiltroCategoriaComponent } from './componentes/filtro-categoria/filtro-categoria';
import { TarjetaClase } from './componentes/tarjeta-clase/tarjeta-clase';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FiltroCategoriaComponent, TarjetaClase],
  templateUrl: './app.html',
})
export class App {
  readonly catalogo = inject(Catalogo);
}
