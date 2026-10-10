# Robot Pulse — prueba de animación minera

[ABRIR LA PRUEBA WEB](https://raw.githack.com/manureymar/Juego-nuevo/b5b9d15af4ecfe40264a662ae65a3d4055255928/previews/mining/index.html)

[Código y recursos](../../previews/mining/) · [Flujo de comprobación](https://github.com/manureymar/Juego-nuevo/actions/runs/38008264166)

Revisión del 10 de octubre de 2026: chispas más numerosas y brillantes con estelas curvas, polvo más denso y partículas que caen bajo gravedad junto a la punta del taladro; vagón estacionado, pila visual limitada y oro acumulado independiente. Se conserva el resto de la escena y sus recursos. La prueba sigue separada de la aplicación Android.

## Uso

La animación empieza al cargar las imágenes. Puedes pausarla, reiniciarla, cambiar entre ½×, 1× y 2×, alternar detalle/mapa o abrir la galería de las 14 piezas.

El taladro gira contra la pared fija. Las chispas, motas y polvo se dibujan con código junto al punto de contacto, sin modificar la pared. Hasta 94 partículas activas tienen velocidad inicial y gravedad; las chispas dejan una estela de su trayectoria y el polvo se expande y se disipa. El efecto tiene mayor contraste y tamaño para verse en teléfono. Las piedras aparecen sobre la cinta y la pinza las deposita en el vagón.

El vagón permanece inmóvil y se llena hasta el borde en seis etapas visuales. Una vez lleno, la pila conserva exactamente su tamaño y posición, pero la pinza sigue cargando. Cada depósito aumenta el contador de oro una sola vez. El valor en monedas es una estimación de prueba (cinco por unidad), no una recogida ni un saldo ya convertido.

El enlace utiliza los archivos del commit `b5b9d15af4ecfe40264a662ae65a3d4055255928`. El servicio de previsualización puede pedir confirmar el destino la primera vez que se abre una página HTML.

## Verificación

- Cinco pruebas de lógica: identidad de piedras y articulaciones, producción continua con pila limitada y vagón fijo, crédito al depositar, partículas visibles, acotadas y sincronizadas con el reloj; trayectoria y aceleración por gravedad y reinicio.
- Recorrido en Chromium a 1440 × 1050, 390 × 844 y 360 × 640: controles, pausa de toda la escena, llenado, crecimiento posterior del oro, mapa y galería.
- Comparación de píxeles del vagón lleno antes y después de continuar produciendo: idénticos.
- Enlace público y recursos HTML, CSS, JavaScript y PNG comprobados.

La futura recogida mediante camiones, conversión definitiva, guardado y acumulación offline quedan para la integración posterior. La pestaña oculta pausa esta prueba.

## Capturas reales

![Vagón lleno en escritorio](desktop.png)

| Teléfono | Galería de recursos |
| --- | --- |
| ![Vagón lleno en móvil](mobile.png) | ![Recursos](assets.png) |

[Resultados del navegador](browser-results.json). Las capturas están pausadas; la página comienza animada.
