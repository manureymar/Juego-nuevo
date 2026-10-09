# Robot Pulse — revisión visual del nivel 01

Propuesta visual del 9 de octubre de 2026 y muestras animadas. **No cambia la aplicación ni la APK instalada.** Las imágenes de pantalla son referencias para integrar componentes; no se debe usar una captura completa como interfaz interactiva.

## Entregables

- `level-01-design.png`: nivel 01; tablero y piezas grandes, robot activo más visible, energía luminosa, cinco bandejas, indicador Conveyor 1/5, seis robots en dos filas de tres, plataformas y cuatro herramientas grandes.
- `settings-design.png`: Ajustes con la X centrada dentro de su botón, batería legible y controles alineados.
- `robots-blank-faces.png`: atlas RGBA de tres variantes con cara vacía para dibujar los ojos por código. El archivo tiene transparencia real.
- `eyes-motion.gif`: muestra de ojos abiertos, parpadeo y alegría, 6 segundos, 20 fps.
- `queue-motion.gif`: muestra del lanzamiento y avance de la fila, 7,2 segundos, 20 fps.
- `motion-preview.html`: muestra interactiva aislada. Tocar un robot delantero lanza esa columna y avanza al siguiente. Abrir con un servidor estático para revisar; no es el nivel jugable.
- `render-motion.cjs`: genera ambos GIF usando el mismo código Canvas de la muestra.
- `prompts.json`: instrucciones de generación, herramienta integrada image_gen.
- `atlas.json`: regiones y anclajes de los ojos.

## Criterios visuales

Exactamente seis robots de cola visibles: tres columnas, dos posiciones por columna. El siguiente ocupa la primera posición al lanzar. La cola puede conservar más robots en sus datos, pero se dibujan solo dos por columna.

Colores mezclados: primera fila cian/dorado/violeta, segunda violeta/cian/dorado. La mezcla final debe depender de los píxeles y la munición del nivel; esta muestra usa una secuencia demostrativa, no un generador de niveles.

Se eliminan pixels left, porcentaje, barra de progreso, WAITING BAYS, LAUNCH QUEUE y niveles de desbloqueo inventados. Se conserva LEVEL 01 y el contador dinámico Conveyor n/5.

Flechas en un único sentido antihorario: arriba izquierda, izquierda abajo, abajo derecha, derecha arriba. En la integración se dibujarán y animarán por código.

La muestra de cola demuestra avance y expresiones. Todavía debe conectarse al motor: comprobar plaza libre antes de consumir la cabeza; avanzar solo tras aceptar el lanzamiento; conservar identificadores y munición; no consumir ningún robot si el lanzamiento se rechaza. El orden no se reorganiza por color.

Los ojos son trazos procedurales sobre pantallas negras: parpadeo breve de 220 ms aproximadamente cada 4,4 s con desfase individual. Alegría como dos arcos luminosos. El cuerpo y el cañón no cambian al animar los ojos.

Los textos, cantidades y zonas táctiles finales deberán ser elementos de interfaz independientes. ROBOT PULSE permanece en inglés; etiquetas de interfaz traducibles. Centrar el área táctil de la X con el botón visible, sin superponer la esquina exterior del marco.

## Reproducción

Con Node, `@napi-rs/canvas` y FFmpeg instalados, ejecutar `node render-motion.cjs`. El programa dibuja la misma muestra Canvas y codifica los GIF; no altera el atlas generado. `.motion-frames/` contiene solo fotogramas temporales.

Revisión realizada: composición de ambos diseños, seis puestos de cola, mezcla de colores, flechas coherentes, etiquetas retiradas, X dentro del botón; fotogramas de ojos abiertos/cerrados/alegres y avance de cola. Se verificaron las dimensiones, transparencia del atlas y duración de los GIF. No se compiló una nueva APK en esta revisión.

