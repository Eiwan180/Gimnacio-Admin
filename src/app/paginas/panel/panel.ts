import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Sesion } from '../../servicios/sesion';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './panel.html',
})
export class Panel {
  readonly sesion = inject(Sesion);
  private readonly router = inject(Router);

  salir(): void {
    // Si un formulario tiene cambios sin guardar, canDeactivate puede cancelar
    // la navegación. Sólo cerramos la sesión si la salida fue permitida.
    void this.router.navigateByUrl('/entrar').then((navego) => {
      if (navego) this.sesion.salir();
    });
  }
}
