# Traspaso completo de Robot Pulse

**Actualización posterior al traspaso: 0.7.0, 10 de octubre de 2026.** La entrega vigente es [RobotPulse-0.7.0.apk](https://github.com/manureymar/Juego-nuevo/raw/refs/heads/main/downloads/RobotPulse-0.7.0.apk). Leer primero las [19 correcciones de diseño, minería y sonido](../UI-0.7.0.md) y las [capturas y pruebas finales de navegador y Android](../polish-v0.7/README.md). Incluye portal independiente en HOME, ventanas ajustadas, digitalización de carta, montaje con energía, WAV de botones del propietario y música un 25% más baja. La firma y el guardado se conservan. El contenido original siguiente documenta la base histórica 0.6.0; sus cifras económicas y referencias de versión quedan sustituidas por la actualización 0.7.0.

Documento de continuidad para el propietario y el siguiente chat de desarrollo. Estado verificado el 10 de octubre de 2026, UTC. Reúne el concepto, las decisiones del propietario, el funcionamiento implementado, los recursos, los archivos, las pruebas y el proceso de entrega.

**Punto de partida del traspaso original:** Robot Pulse ya es una aplicación Android jugable con un primer nivel, tres menús y minería integrada. La base descrita es **0.6.0**. Continuar sobre este proyecto y sus recursos aprobados. La revisión del propietario en su teléfono sigue siendo parte del proceso después de cada entrega.

## 1 Inicio rápido para el siguiente chat

1. Leer este documento, `README.md`, `docs/ANDROID.md`, `docs/MINING-0.6.0.md` y `docs/mining-v0.6/README.md`.
2. Acceder al repositorio del propietario y comprobar la rama `main`, su último commit y los cambios locales antes de editar.
3. Revisar el código de la función solicitada y sus recursos de producción en `game/`. Las imágenes de `art/` documentan la evolución; no todas corresponden al estado vigente.
4. Entender el alcance de la nueva petición. Si pide solo imagen, análisis o que todavía no se programe, respetarlo. Si pide implementar, completar código, pruebas y APK actualizado.
5. Conservar los avances, el estilo, la firma de actualización y el progreso. Entregar el enlace directo al APK cuando el cambio sea de aplicación.

**Repositorio único y canónico:** https://github.com/manureymar/Juego-nuevo

**URL de clonación:** https://github.com/manureymar/Juego-nuevo.git

**APK histórico 0.6.0:** https://github.com/manureymar/Juego-nuevo/raw/refs/heads/main/downloads/RobotPulse-0.6.0.apk

**Compilación y pruebas:** https://github.com/manureymar/Juego-nuevo/actions/workflows/android.yml

**Prueba web de minería aprobada:** https://raw.githack.com/manureymar/Juego-nuevo/9de29ba715f24168f10d9bbc1e374f5acc2fdfa1/previews/mining/index.html

Ese enlace web conserva la demostración independiente de la mina. La aplicación 0.6.0 reutiliza su animación y añade desbloqueo, construcción, guardado y recogida. No son el mismo recorrido de usuario.

### Cómo leer este traspaso

Las secciones 2 a 7 explican el producto, su apariencia y sus reglas. Las secciones 8 a 11 describen arquitectura, archivos, guardado e historial. Las secciones 12 a 15 contienen ejecución, pruebas, entrega y trabajo pendiente. La sección 16 ofrece un mensaje listo para iniciar el otro chat.

## 2 Concepto y dirección del juego

Robot Pulse es un puzle móvil vertical inspirado en la mecánica de Pixel Flow. El jugador elige robots de colores y los lanza a una cinta que rodea una figura formada por cuadrados. Los robots disparan energía automáticamente a los bloques expuestos de su color. La dificultad está en el orden de lanzamiento, los colores que bloquean otros colores, la munición y la capacidad limitada de la cinta y de las bandejas de espera.

El protagonista es un robot pequeño y moderno, con cañón, cuerpo metálico cian, cara oscura y ojos luminosos amarillos. Debe tener personalidad y conservar la identidad del personaje aprobado. El mundo es tecnológico y futurista, con robots y máquinas; la mina no tiene humanos.

El objetivo visual es un juego atractivo, con ilustraciones de calidad, marcos metálicos, iluminación cian, fondos azul oscuro y botones dorados. Los cuadrados del tablero forman figuras reconocibles y artísticas. Se exploraron colibrí, zorro, mariposa, planeta y flor; esas exploraciones no significan que existan cinco niveles programados. El nivel 1 vigente utiliza una figura sencilla de robot.

La segunda parte del juego es una base minera que produce monedas mientras se juega y durante la ausencia. Los puzles desbloquearán cartas de instalaciones. La idea futura es construir y mejorar minas, energía, combustible, transporte y almacenamiento. Actualmente solo la primera mina está implementada.

### Monedas y monetización

Cuando el propietario habla del dinero producido por la mina se refiere a las monedas internas del juego. No se trata de dinero real, minería de criptomonedas ni retiradas de efectivo.

La tienda del prototipo muestra paquetes y precios, pero las compras son simuladas y no cobran. No hay anuncios conectados, facturación real, cuentas, servidor de clasificación ni publicación comercial. La economía actual permite probar el recorrido; no debe presentarse como un sistema de monetización terminado.

## 3 Reglas de trabajo acordadas con el propietario

- **Todo el proyecto se conserva en este repositorio:** código, imágenes, sonidos, recursos, documentos y APK. No abrir otro repositorio ni usar otro lugar como destino permanente del juego. Se puede trabajar en una copia local y después sincronizarla.
- **Cada cambio de aplicación termina con una aplicación actualizada para probar.** No basta con decir que el código está escrito o que pasó el motor: hay que compilar, comprobar, guardar el APK y entregar su enlace.
- **Las imágenes solicitadas se muestran en el chat.** Generar un icono, botón o concepto significa que el propietario quiere verlo. No entregar únicamente una descripción o afirmar que existe sin mostrarlo.
- Si solo se pide una imagen, no integrar ni programar hasta recibir la orden. Las peticiones de análisis, “no hagas nada todavía” y “stop” delimitan el trabajo autorizado.
- Conservar el arte aprobado. No cambiar el robot, el botón, los marcos o la mina por una interpretación nueva sin que el propietario lo pida.
- Los avances deben ser claros: distinguir código terminado, pruebas ejecutadas, compilación, instalación comprobada y enlace entregado. No afirmar que algo está probado o guardado sin verificarlo.
- Revisar las capturas y videos del propietario y corregir lo solicitado sin deshacer el resto. Si un adjunto antiguo ya no está disponible, recuperar el recurso correspondiente del repositorio; pedirlo de nuevo si tampoco está allí.
- Trabajar en español con el propietario. La aplicación tiene interfaz en inglés y español. **ROBOT PULSE permanece siempre en inglés.**

Este traspaso es una entrega documental: no necesita generar otro APK, porque no modifica el juego. El flujo de APK se aplica cuando se cambia la aplicación.

## 4 Dirección visual y decisiones que deben mantenerse

### Estilo y recursos

Usar el acabado futurista del arte aprobado: metal azul oscuro, biseles definidos, luz cian, oro cálido y sombras que den volumen. Evitar la apariencia plana, plástica o de prototipo genérico que el propietario rechazó en versiones anteriores. Los elementos deben ser suficientemente grandes para verse y animarse en un teléfono.

Los textos variables, precios, números, estados y controles deben ser programables. Utilizar piezas gráficas independientes, atlas y regiones de imagen con coordenadas correctas. No sustituir una interfaz funcional por una captura con botones invisibles. El título es una imagen; los textos traducibles usan principalmente Tektur, incluida en el proyecto. No esperar que una fuente reproduzca por sí sola las letras ilustradas del logotipo.

Preservar la proporción de botones y marcos. Los componentes divididos en nueve regiones permiten ampliar el centro sin deformar esquinas y biseles. Respetar los márgenes transparentes que registran los manifiestos de los atlas.

### Pantalla de apertura

Debe mostrar únicamente el fondo de batalla, el título original ROBOT PULSE y el botón PLAY o JUGAR. El robot protagonista aparece frente a monstruos pixelados, en una escena de acción. No volver a añadir eslóganes, textos de ayuda, versión ni otros textos sobre esta presentación.

El botón utiliza el arte dorado vacío y texto colocado por código. La imagen del botón no debe llevar un texto que impida traducirlo. El título conserva su sombra, metal, brillo y línea luminosa de pulso.

### Cabecera, navegación y ventanas

La vida se representa con una batería horizontal cian sencilla, con un número grande y legible. Máximo de cinco cargas. Si falta energía debe verse una cuenta **MM:SS** que avance cada segundo; MAX solo cuando esté llena. No utilizar un corazón ni un texto estático “30M”. El saldo de monedas va arriba.

Se eliminó el avatar de la esquina superior izquierda. Se quitó el logotipo adicional de HOME, pero se conserva en la apertura. Se eliminó el botón de regreso duplicado del nivel que se comportaba como pausa; dentro del nivel queda la pausa a la derecha.

SHOP, HOME y LEADERBOARD mantienen la navegación inferior ilustrada. En esos menús debe caber la pantalla completa, sin scroll ni botones inferiores tapados. La minería tiene su propio menú inferior de construcciones y regreso a HOME.

Los ajustes, pausa, energía, compras, herramientas, ayuda y resultados deben compartir el estilo del juego. La X debe quedar centrada dentro de su alojamiento y responder ahí. No permitir textos fuera de marco, botones aplastados, traducciones cortadas ni letras excesivamente pequeñas.

### Nivel y robots

- Tablero y pista casi de lado a lado, con cuadrados grandes y figura sencilla. La pista pasó a 867 unidades de ancho en un diseño de 887.
- Robots de cinta y bandejas vistos desde arriba, con cañón hacia el interior. Su tamaño de render se amplió a 88 × 70 unidades de tablero.
- El personaje debe parecerse al icono aprobado, sin una cámara ajena al concepto añadida encima.
- Robots en cola sobre plataformas con sombra y profundidad. Seis visibles, distribuidos en **tres columnas y dos filas**; las siguientes unidades avanzan cuando se retira la cabecera.
- Colores mezclados según la lógica del nivel. No asignar siempre amarillo a una columna, violeta a otra y cian a otra.
- Ojos independientes con parpadeo y expresión alegre al avanzar. Respetar movimiento reducido.
- Disparo con núcleo brillante, estela, destello de boca, anillo de impacto y fragmentos del color correcto. El último impacto se muestra antes de abrir el resultado.
- Flechas animadas por código y coherentes con el motor. El sentido vigente es **antihorario en pantalla**: abajo hacia la derecha, derecha hacia arriba, arriba hacia la izquierda e izquierda hacia abajo.
- Se quitaron “pixels left”, porcentaje, barra de progreso, “WAITING BAYS”, “LAUNCH QUEUE” y “Tap a robot to launch”. Se conserva la ocupación **Conveyor n/5**.
- Las herramientas inferiores son botones grandes con aspecto de plataforma. Las futuras muestran bloqueo; no usar ese espacio como párrafo de instrucciones.

En una petición anterior se dijo “seis columnas”. La implementación vigente y documentada es de seis robots visibles en tres columnas y dos filas. No convertirla silenciosamente en seis colas independientes.

## 5 Jugabilidad exacta del primer nivel

Fuente principal: `game/src/level.js` y `game/src/engine.js`.

| Parámetro | Valor vigente |
| --- | --- |
| Identificador y nombre | Nivel 1, First Contact |
| Revisión del nivel | 3 |
| Matriz | 9 × 9 |
| Bloques destructibles | 42: 26 cian, 8 ámbar y 8 violeta |
| Robots totales | 9, repartidos en tres colas |
| Cinta | Máximo 5 robots activos |
| Espera | 5 bandejas, ampliable a 6 con herramienta |
| Munición | Exacta por color; 42 disparos útiles en total |
| Otros niveles | 2 y 3 visibles como bloqueados |

Las colas iniciales, de delante hacia atrás, son: primera, C7 → A3 → C6; segunda, A3 → C7 → P4; tercera, P4 → C6 → A2. C significa cian, A ámbar y P violeta; el número es munición.

### Lanzamiento y disparos

1. El jugador toca el robot delantero de una cola. Si hay espacio en la cinta, sale y el siguiente avanza.
2. El robot recorre la cinta y escanea hacia el interior al pasar por filas y columnas.
3. Solo puede destruir el primer bloque expuesto en su trayectoria si coincide con su color. Otro color delante bloquea el disparo. No gasta munición en ese caso.
4. Si agota la munición, abandona la cinta. Si completa la vuelta con munición, ocupa una bandeja de espera.
5. Tocar un robot de una bandeja lo relanza si hay espacio en la cinta.
6. Se gana al eliminar todos los bloques. Se pierde si regresa un robot con munición y no queda bandeja, o si se agotan todas las posibilidades de munición dejando bloques.

Tener cinco bandejas ocupadas no es por sí mismo una derrota: el problema aparece cuando vuelve otro robot y necesita un hueco. Cinta y espera son capacidades separadas. Un lanzamiento rechazado no puede retirar el robot ni alterar su cola.

### Herramientas

| Herramienta | Efecto y límite | Paquete de prueba |
| --- | --- | --- |
| Bandeja extra | Añade una bandeja a esa partida, máximo seis | 1 por 300 monedas |
| Selección | Permite elegir un robot de una fila posterior visible | 3 por 1.900 monedas |
| Mezcla | Reordena los robots pendientes conservando identidad, color y munición | 3 por 1.500 monedas |
| Cuarta herramienta | Futura, bloqueada | No implementada |

Cada perfil recibe inicialmente una unidad de las tres herramientas activas. Cancelar selección no consume inventario. Consumir únicamente cuando la acción se aplica correctamente. La sexta bandeja y el uso de herramientas se conservan con la partida guardada.

### Resultado y continuidad

La pausa detiene la simulación. Reiniciar o abandonar consume una carga; ganar no. Cerrar y volver a abrir conserva la partida y no equivale automáticamente a abandonar. Los identificadores de partida evitan recompensas o pérdidas de energía duplicadas.

El resultado calcula tres estrellas si el tiempo es menor de 100 segundos, dos si es menor de 180 y una en el resto. La puntuación actual es el máximo entre 100 y el redondeo de 1200 − tiempo × 3 − máximo(0, lanzamientos − 8) × 8. Es una fórmula de prototipo, definida en `engine.js`.

## 6 Economía y menús implementados

### Valores de prueba

| Concepto | Regla vigente |
| --- | --- |
| Perfil nuevo | 200 monedas y 5 cargas |
| Primera victoria | 40 monedas y desbloqueo de minería |
| Victorias posteriores | 10 monedas |
| Derrota, abandono o reinicio | Una carga, una sola vez por partida |
| Regeneración | Una carga cada 30 minutos, también al volver tras cerrar |
| Recarga completa | 120 monedas |
| Regalo diario | 100 monedas, una vez por fecha local |
| Acabados | Cian gratuito; ámbar 250; violeta 350 |

Los acabados comprados se guardan; volver a equiparlos no vuelve a cobrarlos. Los valores están en `profile.js`. La economía utiliza el reloj local y almacenamiento local.

### Paquetes de SHOP

| Monedas | Precio mostrado |
| --- | --- |
| 1.000 | $1.99 |
| 3.000 | $4.99 |
| 7.500 | $9.99 |
| 16.000 | $19.99 |
| 40.000 | $39.99 |
| 90.000 | $79.99 |

Se conservaron precios próximos al concepto aprobado. Las seis tarjetas, el panel de monedas gratis y la navegación deben verse juntos. Comprar abre una confirmación de prueba; no existe cobro real. EXPLORAR conduce al regalo diario. La batería abre la recarga.

### HOME y LEADERBOARD

HOME ofrece iniciar, continuar o repetir el nivel 1 y entrar a minería después del desbloqueo. Los números ilustrativos 10, 11 y 12 de referencias antiguas no son niveles implementados: la campaña vigente muestra 1, 2 y 3.

LEADERBOARD calcula la posición del jugador con su puntuación local frente a rivales de ejemplo. Incluye filtros de región, pestaña mensual y archivo Máster de podios. No representa otros usuarios conectados en tiempo real. El récord mensual se reinicia al cambiar el mes UTC; el mejor histórico se conserva. El regalo diario, en cambio, utiliza fecha local.

### Sonido e idiomas

La música aportada por el propietario está empaquetada en `game/assets/audio/menu-theme.mp3`. Suena en bucle en apertura y menús, se pausa durante el puzle o en segundo plano y sigue los ajustes guardados. El sonido de botones es `button-tap.wav`, con generador en `scripts/make-button-sound.py`. Música y efectos tienen controles separados.

Los textos traducibles están en `game/src/i18n.js`. Mantener EN y ES sincronizados y comprobar ambos tamaños de texto. Las cartas de minería sí tienen una imagen completa por idioma; el logotipo del juego no cambia.

## 7 Minería aprobada e integración actual

### Qué pidió el propietario

Una base industrial robótica que vaya creciendo con el progreso en los puzles. Las cartas desbloquean edificios; a futuro las monedas podrán financiar construcción y mejoras. Se mencionó una carta cada cinco o seis niveles como idea, sin fijar todavía esa cadencia.

La mina debe tener un taladro que trabaja continuamente contra una pared que no se agota. Las piedras aparecen en una estera. Un brazo mecánico toma mineral y lo deposita en un único vagón lateral. No usar excavadora, disco flotante, grandes piedras cayendo desde la pared ni un segundo vagón innecesario. Las piezas deben ser grandes y claras para poder animarlas.

El vagón **no se mueve**. Se llena hasta el borde y permanece así mientras el valor de oro sigue creciendo. El posible movimiento o recogida por camiones queda reservado a una fase futura.

### Recorrido ya integrado en 0.6.0

1. Al ganar por primera vez aparece una carta de minería en el centro. Tiene entrada animada, aura y un reflejo diagonal desde la esquina superior izquierda hacia la inferior derecha.
2. Tocar la carta marca la recompensa como vista y abre la base vacía. Los perfiles de 0.5.0 que ya ganaron reciben la carta al entrar en HOME.
3. Abajo aparecen mina, energía, camiones, combustible y almacén. Solo mina tiene color y está disponible; el resto está gris y con candado.
4. Una flecha del mismo estilo indica arrastrar el icono a la cueva. Durante el gesto se ve una vista semitransparente de la instalación.
5. La colocación inválida se muestra roja. Dentro de la zona válida encaja en verde. Soltar fuera o cancelar no construye. Soltar dentro construye una sola vez con efecto de montaje.
6. La primera mina viene incluida en la carta y no cobra monedas adicionales. Se activa la animación aprobada.
7. El vagón se llena visualmente hasta seis piezas; la pinza sigue depositando después. Recoger convierte el oro guardado en saldo de monedas sin vaciar la pila visual.
8. Hay vista cercana con +/−, regreso a HOME y persistencia al cerrar. Android Atrás también regresa a HOME desde minería.

### Animación que debe reutilizarse

Los módulos `game/src/mining/engine.js`, `renderer.js` y `particles.js` son copias exactas de los tres módulos homónimos en `previews/mining/`. El código aprobado corresponde al commit `9de29ba715f24168f10d9bbc1e374f5acc2fdfa1`. `scripts/check.mjs` exige que sigan siendo iguales. Una nueva modificación de esa animación debe coordinar ambos lugares y su verificación.

Se usan 14 piezas visuales reunidas en tres PNG: un fondo, seis fases de la hélice del taladro y siete partes reutilizables de brazo, pinza, mineral, estera y vagón. No hay que crear un fondo completo por fotograma. La hélice cambia de fase; la máquina entera no gira. El brazo usa dos segmentos y cinemática inversa para que la piedra permanezca unida a la pinza durante el traslado.

Las chispas y el polvo se generan con código en el contacto taladro-pared. La emisión alterna tramos suaves, medios e intensos y ráfagas irregulares. Hay tamaños, velocidades, direcciones, duración y resistencia al aire diferentes; gravedad, rebote limitado, polvo pesado que se asienta y polvo fino que deriva y se dispersa. Las nubes son asimétricas. El sistema limita la población a 180 partículas y acota su caché.

La prueba independiente pausa cuando se oculta la pestaña y tiene controles de velocidad, reinicio y galería. Su economía es demostrativa. La aplicación integrada añade una economía persistente separada del render; no debe depender de que el usuario esté mirando la animación.

### Producción y guardado

`mining-state.js` produce **una unidad de oro cada cuatro segundos** y la convierte en **cinco monedas por unidad** al recoger. La producción empieza al construir y se recupera por tiempo transcurrido al volver de otro menú, del puzle o de la app cerrada. Conserva fracciones de tiempo entre guardados.

El estado separa `totalGold` de `storedGold`. El primero permite mantener el llenado visual; el segundo es lo que queda por cobrar. La recogida no debe duplicar monedas. La capacidad de oro y el límite de saldo manejado por esta operación son 9.999.999. El cálculo no añade producción si el tiempo recibido retrocede. Sigue siendo un reloj local de prototipo, sin autoridad de servidor.

La construcción usa `PointerEvents`, captura y cancelación del puntero. También existe interacción de teclado. El controlador se desmonta al salir, detiene su animación, retira escuchas y observadores, y pausa el dibujo cuando un modal lo bloquea. Evitar actualizar textos idénticos en cada fotograma.

## 8 Arquitectura y mapa del código

Aplicación web local en HTML, CSS y JavaScript con módulos ES. El tablero y la mina se dibujan en Canvas; interfaz y controles son DOM real. Android es un contenedor Java con WebView. No es un proyecto Unity, Godot, React ni un servicio web con backend.

### Carpetas principales

| Ruta desde la raíz | Responsabilidad |
| --- | --- |
| `game/` | Código y recursos funcionales empaquetados en el APK |
| `android/` | Contenedor nativo, icono de instalación y configuración Gradle |
| `art/` | Fuentes gráficas, conceptos, prompts y evolución visual |
| `previews/mining/` | Demostración web aprobada y origen de la animación reutilizada |
| `tests/` | Pruebas deterministas, de navegador y Android instalado |
| `scripts/` | Servidor local, chequeos y generación del sonido de botón |
| `docs/` | Implementación, cambios por versión, instalación y evidencias |
| `downloads/` | APK 0.1.0 a 0.6.0 y SHA256SUMS.txt |
| `.github/workflows/` | Automatización de app Android y demostración minera |

### Módulos dentro de game/src

| Archivo | Qué modificar o consultar aquí |
| --- | --- |
| `app.js` | Pantallas, navegación, HUD, acciones, modales, resultados, carta minera, guardado y ciclo de vida |
| `engine.js` | Reglas deterministas del puzle, colas, exposición de bloques, cinta, espera y resultados |
| `level.js` | Matriz, colores, munición, capacidades y revisión del nivel 1 |
| `renderer.js` | Dibujo del tablero, pista, robots, energía, impactos y animaciones del puzle |
| `profile.js` | Perfil, batería, economía, inventario, premios y validación del almacenamiento |
| `ranking.js` | Mes UTC, récords y clasificación de ejemplo |
| `i18n.js` | Diccionarios EN y ES |
| `audio.js` | Bucle musical, efectos y pausa o reanudación del audio |
| `game-art-data.js` | Coordenadas de regiones de los atlas de partida |
| `game-art.js` | Dibujo de sprites en Canvas y DOM; marcos y botones por regiones |
| `menu-art.js` | Regiones y componentes de HOME, LEADERBOARD y navegación |
| `art.js` | Integración de piezas de la interfaz y sus límites transparentes |
| `icons.js` | Iconos vectoriales auxiliares y recursos de apoyo |
| `mining-state.js` | Desbloqueo, carta, construcción válida, producción y recogida persistentes |
| `mining-view.js` | Composición minera, catálogo, arrastre, encaje, tutorial, zoom y controlador |
| `mining/engine.js` | Simulación de la animación minera aprobada |
| `mining/renderer.js` | Dibujo y articulaciones de esa animación |
| `mining/particles.js` | Física y emisión irregular de chispas y polvo |

`game/index.html` carga los estilos en este orden: `styles.css`, `art-ui.css`, `menu-ui.css`, `gameplay-ui.css`, `refinement-ui.css`, `mining-ui.css`; después inicia `src/app.js`. Al corregir una regla hay que revisar la cascada completa. La revisión visual 0.5.0 está principalmente en `refinement-ui.css`, no solo en la primera hoja.

Los menús ilustrados utilizan diseños de referencia de 768 × 1536 o 887 × 1774 según su conjunto, escalados proporcionalmente mediante `fitScenes()`. El tamaño del teléfono, los recortes y el tamaño real de la WebView importan. No asumir que una captura de escritorio garantiza que el APK cabe en el móvil.

### Android y empaquetado

| Archivo | Función |
| --- | --- |
| `android/app/build.gradle` | Versión, paquete, SDK, firma y empaquetado de `../../game` |
| `android/build.gradle` | Android Gradle Plugin 8.9.2 |
| `android/settings.gradle` | Proyecto y repositorios de dependencias |
| `android/gradle.properties` | Parámetros de construcción |
| `android/app/src/main/AndroidManifest.xml` | Modo vertical, permisos, nombre e icono |
| `android/app/src/main/java/com/manureymar/robotpulse/MainActivity.java` | WebView offline, MIME, pantalla inmersiva, botón Atrás y ciclo de vida |
| `android/app/src/main/res/drawable-nodpi/robot_pulse_launcher.png` | Icono raster de instalación vigente |
| `android/app/src/main/res/values/styles.xml` | Tema nativo |
| `android/preview-signing.keystore` | Firma estable de las vistas previas desde 0.5.0 |

El origen interno de los recursos es `https://appassets.androidplatform.net/`. La app sirve el contenido incluido en el APK, bloquea navegación externa, desactiva acceso a archivos y no incorpora puente JavaScript nativo. No solicita permiso de internet, cámara, micrófono, contactos ni almacenamiento. El icono nativo se referencia en el manifiesto: cambiar solo el favicon web no cambia el icono instalado.

## 9 Mapa de recursos gráficos y documentación

### Recursos activos dentro de game/assets

| Ruta relativa | Contenido |
| --- | --- |
| `splash.png` | Fondo de batalla sin título ni botones |
| `hero.png` | Robot aislado de menú |
| `app-icon.png` | Icono raster web aprobado |
| `ui/` | Logo, botón vacío, tienda, batería, moneda, marcos, tarjetas y seis paquetes |
| `ui/manifest.json` | Geometría y límites de las piezas anteriores |
| `ui-v3/` | HOME y LEADERBOARD por capas, navegación, robots y manifiesto |
| `ui-v3/home-clean.png` | HOME sin el logotipo y cabecera antiguos |
| `gameplay/` | Atlas de arena, controles, HUD, iconos, marcos, robots, cuadrados y efectos |
| `gameplay/robots-live-atlas.png` | Robots con caras preparadas para ojos animados |
| `gameplay/robots-platforms.png` | Plataformas con profundidad |
| `fonts/Tektur.ttf` y `fonts/OFL.txt` | Fuente local y licencia |
| `audio/menu-theme.mp3` | Música entregada por el propietario |
| `audio/button-tap.wav` | Sonido de botones |
| `mining/` | Base vacía, mina armada, atlas, taladro, edificios y cartas |

En `ui/`, las piezas importantes incluyen `logo.png`, `play-blank.png`, `battery.png`, `hud-meter.png`, `buy-button.png`, `product-card.png`, `reward-panel.png`, `reward-chest.png`, `shop-header.png`, `section-bar.png`, `settings.png`, `add.png`, `coin.png`, `nav-active.png`, `nav-idle.png`, `shop-icon.png`, `home-icon.png` y `trophy.png`. Los paquetes se llaman `pack-1000.png`, `pack-3000.png`, `pack-7500.png`, `pack-16000.png`, `pack-40000.png` y `pack-90000.png`.

En `gameplay/` están `arena-plate.png`, `controls-atlas.png`, `hangar-background.png`, `hud-states-atlas.png`, `icons-atlas.png`, `modal-frames-atlas.png`, `robots-atlas.png`, las dos revisiones de robots citadas y `tiles-fx-atlas.png`.

### Los siete PNG de minería

| Archivo en game/assets/mining | Uso |
| --- | --- |
| `background-empty.png` | Base vacía original, 887 × 1774 |
| `background-built.png` | Fondo de la animación aprobada, 887 × 1774 |
| `parts.png` | Atlas de brazo, pinza, mineral, estera y vagón, 1774 × 887 |
| `drill.png` | Fases del taladro, 1536 × 1024 |
| `buildings.png` | Atlas RGBA de seis celdas de 512 × 512, 1536 × 1024 |
| `card-en.png` | Carta en inglés, 1024 × 1536 |
| `card-es.png` | Carta en español, 1024 × 1536 |

El atlas de edificios coloca mina, energía y camiones arriba; combustible, almacén y celda vacía abajo. El gris de bloqueo, los candados, la flecha, los contornos rojo y verde, el efecto de construcción y el brillo de carta se aplican por código.

### Originales e historial artístico dentro de art

| Carpeta | Referencia que conserva |
| --- | --- |
| `concepts/2026-10-08-v2-disparadores/` | Exploración de partida, disparadores y piezas |
| `concepts/2026-10-08-v3-futurista/` | Evolución futurista y design-tokens.json |
| `figuras/2026-10-08-cinco-conceptos/` | Colibrí, zorro, mariposa, planeta y flor |
| `personajes/2026-10-08-robot-lanzador-v1/` | Primera exploración del robot |
| `personajes/2026-10-09-robot-canon-v2/` | Robot con cañón aprobado |
| `presentacion/2026-10-09-robot-pulse-v1/` | Primera apertura |
| `presentacion/2026-10-09-robot-pulse-v2-accion/` | Apertura de combate |
| `presentacion/2026-10-09-robot-pulse-v3-play/` | Apertura con composición y PLAY aprobados |
| `ui/2026-10-09-three-menus/` | Conceptos HOME, SHOP y LEADERBOARD |
| `ui/2026-10-09-title-and-play-assets/` | Título y botones ilustrados EN y ES |
| `ui/buttons/` | Iteraciones históricas del botón |
| `ui/2026-10-09-gameplay-kit/` | Ocho atlas, 62 regiones, recetas de ventanas y previews |
| `ui/2026-10-09-level01-refinement/` | Revisión visual, caras, plataformas y GIF de ojos y avance |
| `ui/2026-10-09-mining-base-concept/` | Concepto de base minera |
| `ui/2026-10-09-mining-unlock-card/` | Cartas originales ES y EN |

Los README, prompts, `atlas.json`, `files.json`, `window-recipes.json` y documentos de integración de esas carpetas explican sus recursos. `previews/mining/ASSET-PROMPTS.md` conserva los prompts de la animación minera. Los conceptos históricos no deben sustituir automáticamente las piezas de producción vigentes.

### Documentos y pruebas visuales

| Ruta dentro de docs | Uso |
| --- | --- |
| `ANDROID.md` | Instalación, actualización y compilación vigentes |
| `IMPLEMENTATION.md` | Reglas iniciales de 0.1.0; matriz de 78 bloques ya histórica |
| `UI-0.2.0.md` a `UI-0.5.0.md` | Evolución de apertura, tienda, menús, partida y modales |
| `MINING-0.6.0.md` | Recorrido y arquitectura de minería integrada |
| `mining-v0.6/README.md` | Informe final, CI, APK, firma y capturas reales de 0.6.0 |
| `mining-v0.6/*results.json` | Resultados de navegador, ventanas, minería y Android |
| `mining-v0.6/apk-info.txt` | Paquete, versión y características del APK |
| `mining-preview/` | Enlace de demo, ráfagas, capturas y resultados de minería independiente |
| `reference-v0.3/` | Referencias aprobadas de HOME y LEADERBOARD |
| `screenshots/` y `screenshots-v0.2/` a `screenshots-v0.5/` | Evidencias históricas, no siempre aspecto vigente |
| `VERIFICATION.md` | Informe anterior de 0.5.0 |
| `traspaso/` | Este documento, versión Word e inventario del repositorio |

Para comparar la versión actual usar `docs/screenshots-v0.5/level-01.png`, `energy-shot.png`, `settings-es.png`, `pause.png`, `home.png`, `android-level-01.png` y el video `level-01-motion.mp4`; para minería usar `docs/mining-v0.6/android-card.png`, `android-empty.png`, `android-built.png`, `android-closeup.png`, `android-restored.png`, `placement-red.png`, `placement-green.png` y `full-wagon.png`.

`docs/traspaso/INVENTARIO-REPOSITORIO.txt` enumera todos los archivos del commit de corte con su tamaño y SHA de blob. Es la referencia exhaustiva para encontrar archivos que no se detallan individualmente aquí. Para una revisión posterior volver a generar el listado con `git ls-tree -r -l HEAD`.

## 10 Guardado y compatibilidad que no deben romperse

El perfil está en `localStorage`, clave **robot-pulse-v1**, con esquema de perfil **version 1**. Incluye monedas, batería y fecha de recarga, herramientas, acabados, idioma, sonido, música, puntuaciones, estrellas, victorias, regalo diario, tutorial, identificadores de partidas procesadas, sesión y minería.

`profile.js` valida y normaliza valores, recupera campos nuevos con sus valores por defecto y conserva el progreso compatible. La instantánea del motor usa **version 2** y comprueba `levelId` y `levelRevision`. El primer nivel está en revisión 3. Una partida intermedia incompatible se descarta de forma controlada; no hay que borrar por ello toda la economía y preferencias.

El objeto `profile.mining` guarda `unlocked`, `rewardSeen`, `built`, `builtAt`, `producedAt`, `totalGold` y `storedGold`. Desbloquear depende de tener al menos una victoria. Construir requiere carta reclamada, posición válida y que la mina no esté construida. El guardado debe evitar duplicar construcción, recompensas o recogida.

La actualización 0.6.0 se instala sobre 0.5.0 y mantiene el progreso porque conserva paquete y certificado. La 0.4.0 tenía otra firma y no admite esa actualización directa. **No regenerar la clave de vista previa.** Desinstalar o borrar datos elimina el progreso local; no hay cuenta ni copia en nube.

La clave `android/preview-signing.keystore` es pública y exclusivamente de desarrollo. La publicación comercial requerirá una identidad de firma de producción separada y protegida. No guardar una futura clave privada de producción en GitHub.

## 11 Historial de cambios y estado de entrega

| Versión o fase | Cambios principales |
| --- | --- |
| Conceptos iniciales | Se descartaron propuestas que no reflejaban Pixel Flow; se definieron figuras cuadradas, robot con cañón y mundo futurista |
| 0.1.0 | Primer prototipo offline, nivel de 78 bloques, menús, batería, moneda, guardado y APK |
| 0.2.0 | Apertura y SHOP con arte real, textos traducibles, precios de prueba, música y efecto de botón |
| 0.3.0 | HOME y LEADERBOARD ilustrados, navegación, batería legible, récord mensual y personal |
| 0.4.0 | Kit de partida y ventanas, nivel sencillo de 42 bloques, robots cenitales, herramientas y launcher raster aprobado |
| 0.5.0 | Tablero y robots mayores, plataformas, cola de seis visibles, ojos, energía e impactos; limpieza de textos, cabecera, batería MM:SS y modales; firma persistente |
| Demo minera | Taladro, estera y pinza; vagón fijo y lleno; revisión de polvo y chispas con física e irregularidad; prueba web aprobada |
| Cartas mineras | Carta ES y réplica EN; se conservan como recursos originales |
| 0.6.0 | Carta tras victoria, base vacía, catálogo bloqueado, arrastre rojo y verde, construcción, misma animación, recogida, producción offline y persistencia |

La cantidad histórica de 14 pruebas ya no describe la entrega actual: 0.6.0 registra 28 pruebas deterministas y 88 casos de ventanas, además de recorridos de navegador y Android.

### Identificación reproducible de la entrega vigente

| Dato | Valor |
| --- | --- |
| Rama | main |
| Commit de corte del traspaso | 095b7cd8de45a619e09e3f83e19945ddd20aeb18 |
| Código probado de 0.6.0 | b68d3c26b9c62b1679058540b7ed2f8987fd0c9c |
| Commit que publicó el APK | 65b4ebbfd73aea289f58377ab3ebdd7a4d93bf3d |
| Ejecución CI aprobada | 38019129498 |
| Versión instalada | 0.6.0-preview, versionCode 6 |
| Paquete instalado | com.manureymar.robotpulse.preview |
| Tamaño del APK | 93.709.571 bytes, unos 93,7 MB |
| Android | Mínimo API 26, Android 8.0; objetivo API 35 |

El commit que guarde este traspaso será posterior al corte anterior, sin cambiar por sí mismo el código de la app.

SHA-256 del APK:

```text
e9a58eb4c41c91e703277aab5d25cb11369dd424bab027e90cf2dab64eea608f
```

SHA-256 del certificado de vista previa:

```text
7cd69261b62da3dfd299116a44f25466866f183ff802fa88630ac2dc0b8c5856
```

Ejecución completa: https://github.com/manureymar/Juego-nuevo/actions/runs/38019129498

En el cierre de este traspaso no se ha recibido una nueva revisión del propietario sobre el APK 0.6.0. Las pruebas automatizadas están aprobadas; la aceptación visual en su teléfono es un control distinto.

## 12 Ejecutar y comprobar el proyecto

### Aplicación web local

Requiere Node.js 20 o posterior. No necesita instalar paquetes para ejecutar el juego.

```sh
git clone https://github.com/manureymar/Juego-nuevo.git
cd Juego-nuevo
npm start
```

Abrir `http://localhost:4173`. En el teléfono de la misma red, usar la IP del ordenador y el puerto 4173 si la red permite esa conexión. El APK no necesita ese servidor.

```sh
npm run check
npm test
```

El chequeo necesita los recursos binarios del repositorio. Una copia parcial sin PNG, fuentes o música no sirve para dar por validado el empaquetado.

### Navegador y demo minera

La CI fija Playwright 1.56.1 y Chromium. Una vez disponibles en el entorno:

```sh
node tests/mining-browser.mjs
node tests/dialogs.mjs
npm run test:browser
```

Para revisar la animación independiente:

```sh
node previews/mining/serve.mjs
node --test previews/mining/tests/engine.test.mjs
node previews/mining/tests/browser.mjs
```

La demo se abre en `http://localhost:4174`. Las pruebas de `previews/mining/` tienen un flujo propio y no sustituyen las pruebas de integración de la app.

### Compilación Android

Combinación fijada en el proyecto: JDK 17, Gradle 8.11.1, Android Gradle Plugin 8.9.2, SDK 35 y Build Tools 35.0.0. Abrir `android/` en Android Studio o usar Gradle instalado:

```sh
gradle -p android assembleDebug
```

Salida local: `android/app/build/outputs/apk/debug/app-debug.apk`. El identificador base es `com.manureymar.robotpulse`; debug añade `.preview`. La versión debug añade `-preview`. La CI usa Node 22 para comprobaciones y Java 17 para Android.

### Qué prueban los archivos de tests

| Archivo | Cobertura |
| --- | --- |
| `tests/engine.test.mjs` | Resolución real, disparos, munición, capacidades, herramientas y recuperación del motor |
| `tests/profile.test.mjs` | Batería, economía, premios, herramientas y validación del perfil |
| `tests/ranking.test.mjs` | Meses, récord y clasificación |
| `tests/mining.test.mjs` | Carta, migración, posición, producción, recogida y invariantes mineros |
| `tests/browser.mjs` | Recorrido completo con controles reales, audio, menús, puzle y guardado |
| `tests/dialogs.mjs` | Tamaños, botones y ventanas EN y ES |
| `tests/mining-browser.mjs` | Carta, drag táctil, cancelación, encaje, llenado, recogida y persistencia |
| `tests/layout.mjs` | Utilidades de comprobación de geometría |
| `tests/android.mjs` | APK instalado, toques y arrastre nativos, offline, idiomas y ciclo de vida |

El acceso de pruebas `window.__rpTest` se limita al servidor local de pruebas; no convertirlo en una función pública del APK. Las pruebas de victoria deben usar el motor y entradas de juego, sin simular el éxito borrando el tablero.

## 13 Verificación registrada de 0.6.0

- 28 pruebas deterministas aprobadas.
- 88 casos de ventanas y controles EN y ES aprobados.
- Recorrido web con victoria, navegación, compra de prueba, regalo, audio, herramientas, pausa, guardado y traducciones.
- Minería comprobada a 360 × 640, 390 × 844 y 412 × 915: carta, arrastre inválido y válido, cancelación, construcción, producción, recogida, zoom y restauración.
- APK instalado y probado en emulador Android API 35, perfil Pixel 7, sin wifi ni datos, con tamaño de fuente del sistema al 140 %.
- Toques y arrastre reales mediante ADB. WebView de 412 × 863, DPR 2,625. Carta para perfil anterior, construcción, cobro, zoom, recarga y botón Atrás comprobados.
- Firma y datos de paquete comprobados con apksigner y aapt. Sin errores JavaScript ni ANR de Robot Pulse en la ejecución final.

Las evidencias están guardadas permanentemente en `docs/mining-v0.6/`; los artefactos temporales de Actions pueden expirar. No confundir una captura conceptual con una captura de la aplicación ejecutándose.

Durante la integración se corrigió una escritura innecesaria al recargar y se redujeron actualizaciones de texto redundantes. Una ejecución intermedia perdió conexión con el emulador durante consultas repetidas de UIAutomator; la ejecución final reutilizó la geometría nativa ya obtenida y completó el recorrido. No tratar esos intentos anteriores como el estado final ni reintroducir consultas intensivas innecesarias en pantallas animadas.

Estas pruebas no equivalen a haber comprobado todos los teléfonos. El propietario revisa el APK en su dispositivo y sus observaciones guían la siguiente iteración.

## 14 Flujo obligatorio de cada nueva entrega de aplicación

1. **Revisar el estado real.** Leer la petición, las capturas y los documentos pertinentes; actualizar la copia del repositorio y conservar cambios ajenos. Comprobar si la tarea es de arte, análisis o implementación.
2. **Preparar los recursos.** Reutilizar los aprobados. Si se solicita arte nuevo, generarlo y mostrarlo en el chat. Guardar originales y versiones usadas en el repositorio.
3. **Implementar lo solicitado.** Conectar los controles al estado real. Mantener EN y ES, legibilidad, proporciones, persistencia y comportamiento offline. No introducir cambios de diseño ajenos a la petición.
4. **Actualizar la versión cuando cambie la app.** Mantener coherentes `package.json`, `android/app/build.gradle`, nombres de APK y artefactos en el workflow, documentación y textos de versión aplicables. Incrementar versionCode. Conservar paquete y firma de actualización.
5. **Comprobar la lógica y el recorrido.** Ejecutar chequeos y pruebas relevantes. Revisar las pantallas y los modales en tamaños de teléfono. Un motor aprobado no demuestra que la interfaz ni la instalación estén bien.
6. **Guardar código y recursos en GitHub.** Usar commits descriptivos y revisar que no se sobrescriban cambios nuevos de `main`. No forzar la rama para resolver una discrepancia sin inspeccionarla.
7. **Compilar y probar el APK.** Esperar a que termine la CI, comprobar la instalación Android, la firma, el paquete y el archivo generado. Si falla, corregir y repetir la parte necesaria.
8. **Verificar publicación.** Comprobar que `downloads/RobotPulse-X.Y.Z.apk` corresponde al código probado, que existe el enlace y que `SHA256SUMS.txt` coincide. Guardar un informe con capturas y resultados de esa versión.
9. **Entregar al propietario.** Dar el enlace directo del APK actualizado, explicar brevemente qué cambió y qué se comprobó, y señalar cualquier limitación real. Indicar si se puede instalar encima conservando el progreso.
10. **Incorporar su revisión.** Continuar con los detalles que señale en el teléfono; conservar lo que ya aprobó.

### Cómo funciona la automatización

`.github/workflows/android.yml` se activa por cambios de `main` en `game/`, `android/`, `scripts/`, `tests/`, `package.json` o el propio workflow, y admite ejecución manual. Ejecuta chequeos, pruebas deterministas, navegador, compilación, emulador, firma y publicación. Los cambios documentales por sí solos no requieren reconstruir el juego.

**Precaución de publicación:** el último paso guarda el APK únicamente si `origin/main` aún coincide con el commit que inició la compilación. Si se sube otro commit, incluso documental, mientras corre, puede saltarse esa publicación. Esperar a que publique antes de añadir el informe final, o lanzar una compilación del nuevo estado y verificar el APK. La concurrencia también cancela ejecuciones anteriores cuando comienza otra del mismo grupo.

El APK se guarda mediante un commit de la compilación con `[skip ci]`. La clave de vista previa existente debe conservarse. Los artefactos de navegador y Android duran 30 días; el artefacto del APK dura 90. Guardar la evidencia importante en `docs/` y el APK en `downloads/`.

El workflow separado `.github/workflows/mining-preview.yml` verifica la animación web, sus controles, capturas y recursos. No entrega por sí mismo una nueva aplicación Android.

### Si el entorno anterior ya no existe

Clonar el repositorio y recuperar desde allí código, recursos, documentos y APK. Las rutas temporales de adjuntos y las carpetas del chat anterior pueden desaparecer. No reconstruir la mina ni el juego desde cero por falta de una carpeta local. Si una referencia no fue guardada en el repositorio y se necesita para una modificación fiel, pedir al propietario que la adjunte de nuevo.

## 15 Pendientes reales y siguiente punto de continuidad

La última petición de implementación antes de este documento fue integrar la carta minera, la construcción por arrastre y la animación ya aprobada dentro de la aplicación. **Eso está implementado y verificado en 0.6.0.** No comenzar repitiendo esa integración como si estuviera pendiente.

Lo inmediato es revisar, cuando el propietario lo indique, su experiencia en el APK 0.6.0 y aplicar sus siguientes correcciones. No se ha fijado una nueva ampliación de alcance por el hecho de redactar este traspaso.

### Funciones todavía futuras

- Niveles jugables posteriores al primero y campaña completa.
- Frecuencia definitiva de cartas y condiciones de desbloqueo de cada instalación; la propuesta de cada cinco o seis niveles sigue por decidir.
- Múltiples minas, costes y niveles de mejora, generadores, combustible, camiones, rutas, recogida automática y almacenamiento funcional.
- Balance comercial de premios, herramientas, energía, producción pasiva y precios. Las cifras actuales son de prueba.
- Pagos reales, anuncios con recompensa, validación de compras, cuentas, copia en nube y clasificación conectada.
- Publicación de producción, firma definitiva y distribución en tiendas.

No escoger ni anunciar integraciones comerciales como ya aprobadas. El siguiente trabajo sobre monetización deberá partir de una decisión del propietario, de una economía definida y de la integración comprobada de los servicios elegidos.

### Errores de continuidad que deben evitarse

No volver al nivel de 78 bloques, al avatar superior, al corazón, al temporizador “30M”, al nivel 18, a robots diminutos, a las etiquetas eliminadas ni al vagón que se mueve. No reemplazar las chispas irregulares por una emisión uniforme. No presentar la clasificación local como online ni los paquetes simulados como compras reales. No confundir los documentos de 0.1.0 o 0.5.0 con la entrega 0.6.0.

Algunos README de recursos iniciales conservan descripciones históricas de iconos SVG o títulos dibujados con código. Para el estado efectivo mandan los imports actuales, `index.html`, el manifiesto Android y la documentación más reciente. Conservar el historial, pero no usarlo para deshacer las revisiones aprobadas.

## 16 Mensaje listo para iniciar el otro chat

Puedes acompañar este archivo con el siguiente texto:

> Continuamos el desarrollo de Robot Pulse. Lee completo el documento de traspaso adjunto y revisa el repositorio https://github.com/manureymar/Juego-nuevo antes de modificar nada. Todo el código, arte, recursos, documentación y APK debe guardarse en ese repositorio. La versión vigente del traspaso es 0.6.0: primer nivel jugable, Shop, Home, Leaderboard y minería integrada con carta, base vacía, construcción por arrastre y la misma animación web aprobada. Conserva el estilo, el robot, la batería y el progreso. Cuando te pida una imagen, muéstramela aquí; no la integres si no te he dado esa orden. Cuando te pida un cambio de aplicación, complétalo, pruébalo, compila y entrégame el APK actualizado para probarlo en mi teléfono. Verifica siempre el estado real del repositorio y no afirmes que algo está guardado o probado sin comprobarlo. A continuación te indicaré el siguiente cambio.

### Fuentes para mantener este documento actualizado

Este traspaso consolida las decisiones del propietario y el estado del repositorio en el commit de corte indicado. La implementación verificable está en `game/` y `android/`; las reglas en `level.js`, `engine.js`, `profile.js` y `mining-state.js`; la evolución en los documentos de versiones y los README de arte; la evidencia final en `docs/mining-v0.6/` y la ejecución CI enlazada.

Al entregar una nueva versión, actualizar el estado, el enlace de APK, sus datos de firma y pruebas, los pendientes y el mapa si cambian rutas. El repositorio puede avanzar después de este documento; comprobar siempre `main` antes de continuar.
