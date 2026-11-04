# Gimnasio-Admin - Práctica 19: El Panel del Gimnasio (Tablero en Angular)

---

## Cuestionario y Respuestas por Ejercicio

### Ejercicio 1: El proyecto y el tablero

#### Pregunta: ¿Qué archivo de Angular hace el papel de `main.tsx`, de `App.tsx` y de `vite.config.ts`?
* **`main.tsx` (Punto de entrada de la aplicación):** 
  En Angular, este papel lo cumple **`src/main.ts`**, que es el archivo encargado de iniciar la aplicación y arrancar el componente raíz utilizando `bootstrapApplication`.
* **`App.tsx` (Componente raíz de la aplicación):** 
  Equivale a **`src/app/app.component.ts`** (junto con su plantilla `app.component.html`), el cual define el componente principal que se muestra al cargar la aplicación.
* **`vite.config.ts` (Configuración del empaquetador/proyecto):** 
  En Angular moderno (que utiliza esbuild/Vite bajo el capó), la configuración global del proyecto, dependencias de compilación, estilos globales y activos se gestiona principalmente en **`angular.json`** (complementado con `tsconfig.json` para TypeScript).

---

### Ejercicio 2: La tarjeta de una clase

#### Pregunta 1: ¿Por qué `clase()` lleva paréntesis y para qué sirve `track`?
* **¿Por qué `clase()` lleva paréntesis?**
  Lleva paréntesis porque en las versiones modernas de Angular con componentes *standalone*, los inputs definidos con `input.required()` o las señales (*signals*) se invocan como funciones para acceder y evaluar su valor actual de manera reactiva.
* **¿Para qué sirve `track`?**
  En el nuevo flujo de control `@for`, el parámetro `track` es obligatorio y se utiliza para identificar de manera única cada elemento de la colección. Esto permite a Angular optimizar el rendimiento del DOM al actualizar, reordenar o eliminar elementos sin necesidad de destruir y recrear todos los nodos de la interfaz.

