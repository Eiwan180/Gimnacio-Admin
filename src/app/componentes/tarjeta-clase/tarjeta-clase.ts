import { Component, input } from '@angular/core';
import type { Clase } from '../../modelos/clase';
import { TitleCasePipe } from '@angular/common';

@Component({
  imports: [TitleCasePipe],
  selector: 'app-tarjeta-clase',
  styleUrl: './tarjeta-clase.css',
  templateUrl: './tarjeta-clase.html',
})
export class TarjetaClase {
  readonly clase = input.required<Clase>();
}
