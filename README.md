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

---

# Práctica 21 - El panel del gimnasio: rutas, la API y eliminar


## Respuestas a los Ejercicios

### Ejercicio 1: El router y las páginas

* **¿Qué pieza de React Router corresponde a `router-outlet`, a `routerLink` y a `routerLinkActive`?**
  * **`router-outlet`**: Corresponde al componente `<Outlet />` de React Router, el cual define el espacio donde se renderizan los componentes hijos según la ruta activa.
  * **`routerLink`**: Corresponde al componente `<Link />` o `<NavLink />` (usando la propiedad `to="..."`), que permite la navegación del lado del cliente sin recargar la página completa.
  * **`routerLinkActive`**: Corresponde a la funcionalidad de estilo activo que ofrece `<NavLink />` (mediante clases dinámicas o el estado `isActive`), la cual aplica estilos automáticos cuando la ruta actual coincide con el enlace.

* **¿Por qué la ruta comodín (`**`) va al final y la ruta vacía necesita `pathMatch: 'full'`?**
  * **Ruta comodín (`**`) al final**: Angular evalúa las rutas en el orden estricto en el que son declaradas. La ruta comodín captura cualquier URL que no haya coincidido con ninguna ruta anterior; si se colocara al principio, interceptaría todas las peticiones antes de evaluar las rutas específicas.
  * **Ruta vacía (`path: ''`) con `pathMatch: 'full'`**: Por defecto, Angular utiliza una estrategia de coincidencia por prefijo (`prefix`). Si no se especifica `pathMatch: 'full'`, cualquier ruta comenzaría con una cadena vacía, provocando redirecciones imprecisas. Con `full`, se exige que la URL esté completamente vacía para aplicar la redirección (por ejemplo, redirigir de `/` a `/clases`).

---

### Ejercicio 2: El formulario de nueva clase

* **¿Dónde vive el valor de un campo en un formulario reactivo y en qué se diferencia del `useState` de React?**
  * **Ubicación**: Vive dentro del modelo del formulario (`FormControl` o dentro de un `FormGroup`), administrado centralizadamente por la API de Reactive Forms de Angular.
  * **Diferencia con `useState`**: A diferencia de `useState` en React —donde cada campo requiere un estado local independiente y una función actualizadora explícita (`setState`)—, en Angular los formularios reactivos manejan un árbol de controles estructurado que administra de forma automática el valor, los estados de interacción (`touched`, `dirty`) y la validez global, sin requerir declaración manual de múltiples estados sueltos.

* **¿Qué regresa un validador propio cuando el valor es válido y cuando no, y cómo se relaciona con `hasError`?**
  * **Valor válido**: Regresa `null` (indicando que no existe ningún error de validación).
  * **Valor inválido**: Regresa un objeto que identifica el error (por ejemplo, `{ duracionInvalida: true }`).
  * **Relación con `hasError`**: El método `hasError('nombreDelError')` del control busca exactamente la clave dentro de ese objeto de error devuelto por el validador para determinar si debe mostrar el mensaje de validación en la interfaz.

---

### Ejercicio 3: El catálogo desde la API

* **¿Qué cambió en el servicio del catálogo y por qué ningún componente se enteró?**
  * **Cambio**: Se sustituyó el arreglo de clases local estático por el uso de `httpResource` (o peticiones HTTP mediante `HttpClient`) apuntando directamente al endpoint remoto (`GET /clases`).
  * **Por qué los componentes no se enteraron**: El servicio mantuvo intacta su interfaz pública (los métodos y señales expuestos), por lo que los componentes continúan consumiendo los datos de la misma manera, logrando un desacoplamiento efectivo entre la capa de datos y la interfaz de usuario.

* **¿Por qué no hizo falta iniciar sesión para leer el catálogo?**
  * **Motivo**: La ruta del catálogo (`GET /clases`) está configurada en el backend como un endpoint público de acceso libre (sin requerir autenticación ni token JWT), reservando los mecanismos de seguridad y autorización únicamente para las rutas protegidas del panel de administración (como la creación, actualización o eliminación de elementos).

---

## Práctica 22: El panel del gimnasio: crear y editar clases

### Ejercicio 1: Guardar con POST

**1. Si el formulario ya valida, ¿por qué también valida el servidor?**
* **Seguridad:** Las validaciones en el frontend (Angular) son únicamente para mejorar la experiencia de usuario (UX) y darle retroalimentación rápida. Cualquier usuario malintencionado puede saltarse el navegador y enviar peticiones directamente a la API usando herramientas como Postman, cURL o scripts.
* **Integridad de los datos:** El servidor es la última línea de defensa antes de guardar en la base de datos. Debe garantizar que los datos cumplan con las reglas de negocio y esquemas estrictos sin importar de dónde provenga la petición.

**2. ¿Por qué `httpResource` para leer y `HttpClient` para crear, editar y eliminar?**
* **`httpResource` (Lectura / GET):** Está diseñado de forma declarativa y reactiva. Se integra nativamente con Signals para gestionar automáticamente estados de carga (`isLoading`), errores y recargas cuando cambian los parámetros de consulta.
* **`HttpClient` (Mutaciones / POST, PATCH, DELETE):** Las operaciones de escritura son acciones imperativas detonadas por eventos específicos del usuario (como hacer clic en "Guardar" o "Eliminar"). `HttpClient` devuelve un `Observable` que permite encadenar operadores de RxJS y controlar exactamente qué hacer tras una respuesta exitosa o un error (ej. mostrar alertas, navegar a otra ruta o deshabilitar botones).

**3. ¿Qué pasa si se olvida el `.subscribe()`?**
* La petición HTTP **nunca se ejecuta**. En RxJS, los `Observables` que devuelve `HttpClient` son "fríos" (*Cold Observables*), lo que significa que la lógica interna (la llamada a la red) no se dispara hasta que alguien se suscribe a ellos para escuchar el resultado.

---

### Ejercicio 2: El login, los interceptores y el guardia

**1. ¿A qué pieza de React corresponden las rutas hijas (`children`), el interceptor y el guardia?**
* **Rutas hijas (`children`) + `<router-outlet>`:** Corresponden a las rutas anidadas de React Router junto con el componente `<Outlet />` dentro de un componente de diseño (*Layout*).
* **Interceptor HTTP:** Corresponde a los interceptores de **Axios** (`axios.interceptors.request.use` / `response.use`) o a un *wrapper* personalizado alrededor de la API nativa `fetch()`.
* **Guardia (`CanActivate`):** Corresponde a un componente envoltorio de rutas protegidas (comúnmente llamado `<ProtectedRoute>` o `<PrivateRoute>`), el cual evalúa el estado de autenticación y usa `<Navigate />` para redirigir si no se cumple la condición.

**2. ¿Cuándo se ejecuta el guardia y por qué `salir()` tiene que navegar al login?**
* **Cuándo se ejecuta:** Se ejecuta justo antes de que el enrutador de Angular active o cargue una ruta protegida (en cada intento de navegación hacia esa ruta).
* **Por qué `salir()` navega al login:** El guardia solo evalúa el acceso *al momento de intentar entrar a una ruta*, no vigila continuamente la pantalla actual en tiempo real. Si el usuario ya está dentro del panel y hace clic en `salir()`, borrar el token de la sesión no lo expulsa automáticamente de la vista; es necesario forzar la navegación hacia `/login` para sacarlo de la ruta protegida.

---

### Ejercicio 3: Editar, eliminar y la guarda de salida

**1. ¿Cómo decide un mismo formulario, con dos rutas, si manda `POST` o `PATCH`?**
* Mediante el parámetro `id` recibido desde la URL (como un `@Input()` gracias a `withComponentInputBinding()`). 
* Si el `id` existe (proviene de la ruta `/clases/:id/editar`), el componente sabe que está en modo edición y envía un **`PATCH`**. Si el `id` es `undefined` (proviene de `/clases/nueva`), sabe que es un registro nuevo y envía un **`POST`**.

**2. ¿Por qué el estado del formulario no se puede observar con un `computed()`?**
* Porque `computed()` únicamente rastrea dependencias de **Signals** de Angular que se lean dentro de su función. Los formularios reactivos tradicionales (`FormGroup` / `FormControl`) funcionan mediante eventos internos y `Observables` de RxJS (`valueChanges`, `statusChanges`), no con Signals, por lo que `computed()` no detectaría ningún cambio cuando el usuario escriba o modifique el formulario.

**3. ¿Qué diferencia hay entre `canActivate` y `canDeactivate`, y qué casos no cubre la guarda de salida?**
* **Diferencia:** `canActivate` decide si un usuario puede **entrar** a una ruta (ej. verificar si tiene sesión iniciada o rol de admin). `canDeactivate` decide si un usuario puede **salir** de la ruta actual (ej. evitar que pierda cambios sin guardar en un formulario).
* **Casos que no cubre:** Al ser una guarda del enrutador interno de Angular (SPA), solo intercepta navegaciones dentro de la propia aplicación (clics en enlaces `routerLink` o llamadas a `router.navigate()`). **No cubre** acciones a nivel del navegador como cerrar la pestaña, cerrar el navegador completo, recargar la página (F5) o escribir una URL externa directamente en la barra de direcciones (para eso se requiere el evento nativo `window:beforeunload`).

**4. *(Opcional)* ¿Por qué la ruta de crear (`clases/nueva`) va antes que la del id (`clases/:id`)?**
* Porque el enrutador de Angular evalúa las rutas de arriba hacia abajo y se queda con la **primera que coincida**. Si `clases/:id` estuviera primero, al navegar a `/clases/nueva`, Angular interpretaría la palabra `"nueva"` como el parámetro dinámico `:id` e intentaría cargar el detalle de una clase con ID `"nueva"`.

---

## Práctica 23: El panel del gimnasio: el buscador con RxJS

### Ejercicio 1: El tubo de búsqueda

**1. ¿Qué diferencia hay entre un `signal` y un `Observable`?**
* **Signal:** Es un contenedor de estado síncrono que **siempre tiene un valor actual** disponible de inmediato al leerlo (`miSignal()`). Está diseñado para la reactividad de la interfaz de usuario, rastrea sus dependencias automáticamente y no requiere suscripciones manuales ni desuscripciones para evitar fugas de memoria.
* **Observable:** Representa un flujo de eventos o datos asíncronos a lo largo del tiempo (puede emitir 0, 1 o múltiples valores, o fallar). Es ideal para manejar eventos complejos y peticiones de red mediante operadores de transformación y tiempo (como `debounceTime` o `switchMap`), pero requiere suscripción para activarse y gestión de su ciclo de vida.

---

### Ejercicio 2: La caja de búsqueda

**1. ¿Qué problema evita `switchMap` y qué pasaría con `mergeMap`?**
* **Problema que evita `switchMap`:** Evita condiciones de carrera (*race conditions*) y peticiones innecesarias. Cuando el usuario escribe una nueva letra y llega un nuevo término de búsqueda, `switchMap` **cancela** automáticamente la petición HTTP anterior que seguía en curso y se queda únicamente con la más reciente.
* **Qué pasaría con `mergeMap`:** Ejecutaría todas las peticiones en paralelo sin cancelar ninguna. Si una búsqueda anterior tarda más tiempo en responder que la última (por latencia de red), la respuesta vieja sobrescribiría a la nueva en la pantalla, mostrando resultados desactualizados que no corresponden con lo que está escrito en la caja de búsqueda.

**2. ¿Qué pasa si se quita `catchError` y la API se apaga?**
* En RxJS, cuando un flujo emite una notificación de `error` no capturada, **el Observable muere (se cierra permanentemente)**. Si la API falla una vez y no hay `catchError` *dentro* del `switchMap` para atrapar el error y devolver un flujo alternativo (como un arreglo vacío `of([])`), el buscador dejará de funcionar por completo; aunque el usuario siga escribiendo después de que la API vuelva a encenderse, ya no se realizará ninguna búsqueda.