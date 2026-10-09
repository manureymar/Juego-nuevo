# Robot Pulse 0.5.0 — integración de la revisión visual

Cambios solicitados a partir de las diez capturas del 9 de octubre de 2026.

- Se elimina el avatar superior de todas las pantallas y el botón de regreso duplicado dentro del nivel. Solo queda el botón de pausa a la derecha.
- Home utiliza un fondo regenerado sin el logotipo ni la antigua cabecera pintada. La pantalla de apertura conserva ROBOT PULSE.
- La batería tiene una celda sencilla, número grande y cuenta MM:SS actualizada cada segundo. Una carga sigue tardando 30 minutos: 30:00 → 29:59 → … → 00:01. Se muestra MAX únicamente cuando está llena. El tiempo se recupera al volver del segundo plano.
- La pista pasa de 687 a 867 unidades de diseño. El mismo primer nivel conserva sus 42 bloques y munición exacta, sobre una matriz de 9×9 sin los márgenes vacíos anteriores. Esto aumenta el tamaño visible de los cuadrados.
- Los robots de la pista crecen de 60×48 a 88×70 unidades de tablero. El cañón apunta hacia el interior, las flechas siguen una sola dirección y los giros de esquina interpolan su orientación.
- Disparo con núcleo luminoso, estela, destello de cañón, anillo de impacto y fragmentos del color correcto. El último impacto se muestra antes del resultado.
- La cola muestra seis robots: tres columnas y dos filas visibles. Las siguientes unidades permanecen en los datos hasta avanzar. Colores mezclados en función de la munición del nivel. Se conserva la identidad del siguiente robot al animar su avance; un lanzamiento rechazado no cambia la cola.
- Plataformas con profundidad y sombras bajo los robots; cuatro herramientas grandes al pie. Se eliminan WAITING BAYS, LAUNCH QUEUE, porcentaje, barra de progreso, cantidad de píxeles restantes y el desbloqueo provisional de nivel 18. Se mantiene Conveyor n/5.
- Rostros vacíos en el atlas permiten dibujar ojos independientes: parpadeo y expresión alegre cuando un robot avanza. Se respeta la preferencia de movimiento reducido.
- Todos los paneles comparten marco dividido en nueve regiones, cabecera de altura fija, X centrada en su alojamiento y botones con biseles de tamaño fijo. Los textos se mantienen como HTML traducible y no forman parte del fondo.

## Recursos

- `game/assets/ui-v3/home-clean.png`: edición del fondo de Home con la herramienta integrada image_gen.
- `game/assets/gameplay/robots-live-atlas.png`: edición del atlas de robots para retirar los ojos estáticos de la fila frontal, conservando las vistas aéreas.
- `game/assets/gameplay/robots-platforms.png`: atlas de la revisión visual anterior, usado para la plataforma.
- `game/refinement-ui.css`: distribución de los elementos y paneles compartidos.
- `game/src/renderer.js`: animación de la pista, robots, proyectiles e impactos.

Las imágenes generadas se mostraron en el chat. Las capturas de verificación corresponden a la aplicación ejecutándose, no a nuevos conceptos.

## Instalación

La versión 0.5.0 usa una identidad de firma de vista previa persistente, guardada por la compilación junto al APK para que futuras vistas previas puedan actualizarse. La clave es exclusivamente de prueba y no sirve como clave de publicación. La 0.4.0 anterior usó una clave temporal diferente, por lo que al pasar de 0.4.0 a 0.5.0 habrá que desinstalarla; se perderá su progreso local.

El primer nivel cambió de revisión. Las partidas a mitad de nivel de revisiones anteriores se descartan de manera controlada; se mantienen las estadísticas y monedas si se conserva el almacenamiento y la firma permite actualizar.
