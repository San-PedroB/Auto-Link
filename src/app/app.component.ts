import { Component, Renderer2, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Configura el MutationObserver global
    this.configurarObserver();
  }

  configurarObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'aria-hidden') {
          const target = mutation.target as HTMLElement;
          if (target.hasAttribute('aria-hidden')) {
            this.renderer.removeAttribute(target, 'aria-hidden');
            console.log(`Atributo aria-hidden eliminado de: ${target.tagName}`);
          }
        }
      });
    });

    // Observa todo el árbol DOM
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
    });

    console.log(
      'MutationObserver global configurado para eliminar aria-hidden'
    );
  }
}
