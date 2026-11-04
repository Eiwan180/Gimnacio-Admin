import { Component, signal } from '@angular/core';
import type { Clase } from './modelos/clase';
import { CLASES_LOCALES } from './datos/clases-locales';
import { TarjetaClase } from './componentes/tarjeta-clase/tarjeta-clase';


@Component({
  imports: [TarjetaClase],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected clases: Clase[] = CLASES_LOCALES;

  protected get minutosTotales(): number {
    return this.clases.reduce((suma, c) => suma + c.duracionMin, 0);
  }

  protected get clasesLargas(): number {
    return this.clases.filter((c) => c.duracionMin > 60).length;
  }

  protected vaciar(): void {
    this.clases = [];
  }

  protected restaurar(): void {
    this.clases = CLASES_LOCALES;
  }
}
