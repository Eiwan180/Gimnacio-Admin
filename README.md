# Gimnasio-Admin - Práctica 19: El Panel del Gimnasio (Tablero en Angular)


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

---

# Práctica 20 - El panel del gimnasio: signals, un servicio y el filtro


## 📝 Respuestas a las Preguntas de la Práctica

### 1. ¿Qué diferencia hay entre un `signal` y un `computed`, y cuál se parece a `useState` y cuál a `useMemo`?

* **`signal`:** 
  * Es un contenedor de valor reactivo que almacena un estado primitivo u objeto y notifica de manera automática a sus consumidores cuando su valor cambia. Se actualiza explícitamente mediante métodos como `.set()` o `.update()`.
  * **Comparación en React:** Se parece directamente a **`useState`**, ya que ambos representan una pieza fundamental de estado local o compartido que puede cambiar a lo largo del tiempo.

* **`computed`:** 
  * Es un valor reactivo derivado que se calcula automáticamente a partir de uno o más signals. Es de solo lectura y está optimizado mediante memorización (caching), lo que significa que solo se vuelve a calcular cuando alguna de sus dependencias directas cambia.
  * **Comparación en React:** Se parece a **`useMemo`**, ya que ambos memorizan y calculan valores derivados basándose en un conjunto de dependencias para evitar recálculos innecesarios.

---

### 2. ¿Qué pasa si el filtro hace `new Catalogo()` en lugar de `inject(Catalogo)`?

Si un componente intenta instanciar el servicio haciendo `new Catalogo()` en lugar de utilizar la inyección de dependencias con `inject(Catalogo)` (o mediante el constructor), se generan los siguientes problemas principales:

1. **Ruptura del estado compartido:** Angular gestiona los servicios con un ciclo de vida controlado y un patrón Singleton (cuando se configuran con `providedIn: 'root'`). Al usar `new Catalogo()`, estás creando una **instancia totalmente aislada y nueva** del servicio solo para ese componente. Como resultado, cualquier cambio en las categorías o clases seleccionadas no se reflejará en el resto de los componentes del tablero (se pierde la reactividad centralizada).
2. **Problemas de contexto y dependencias:** Si el servicio `Catalogo` requiere a su vez otras dependencias inyectadas mediante `inject()`, la creación manual con `new` fallará debido a que se ejecuta fuera del contexto de inyección de Angular.

#### Sobre el aviso NG8109:
El aviso **NG8109** en Angular surge cuando se detectan patrones incorrectos relacionados con el uso de funciones de inyección (`inject()`) fuera de su contexto válido (como inicializadores permitidos o constructores) o al intentar saltarse la jerarquía de inyección del framework. Provocar y capturar este aviso demuestra la importancia de dejar que sea el inyector de Angular quien administre la creación de instancias de los servicios.