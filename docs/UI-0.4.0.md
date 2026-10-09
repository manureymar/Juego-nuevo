# Robot Pulse: integración gráfica 0.4.0

El nivel usa los recursos de `art/ui/2026-10-09-gameplay-kit/` como piezas independientes. No se coloca una captura de pantalla debajo de botones invisibles: el tablero, los robots, la munición, las herramientas y los textos reflejan el estado real de la partida.

## Comportamiento

- Nivel introductorio de 42 bloques y 9 robots, con munición exacta: cian 26, violeta 8 y ámbar 8.
- Tres columnas con hasta tres filas visibles. Solo el robot delantero se puede lanzar normalmente.
- Robot cenital sobre la cinta y en las bandejas. Cañón lateral, disparos, impactos y contadores independientes.
- Recorrido antihorario: abajo hacia la derecha, derecha hacia arriba, arriba hacia la izquierda e izquierda hacia abajo. Las flechas animadas comparten la geometría del motor.
- Cinco posiciones de cinta y cinco bandejas de espera. La herramienta de bandeja extra aumenta la espera a seis durante esa partida.
- Herramienta de selección: permite lanzar un robot de una fila posterior. Cancelar no gasta una unidad.
- Herramienta de mezcla: reorganiza los robots que siguen en cola conservando identidad, color y munición.
- Cada perfil recibe una unidad inicial de las tres herramientas para probarlas. Paquetes con monedas: bandeja ×1 por 300; selección ×3 por 1.900; mezcla ×3 por 1.500.
- El cuarto círculo es una herramienta futura, bloqueada y explicada como tal. Los niveles siguientes no están implementados.
- Pantallas de ajustes, ayuda, pausa, energía, herramientas, confirmación, victoria y derrota con marcos del mismo conjunto artístico. Los controles conservan etiquetas accesibles y navegación de foco.
- Mensual conserva la clasificación local. Máster muestra dos podios mensuales por página y permite navegar por el archivo de ejemplo.
- Batería horizontal, número dinámico y carga máxima 5. Título ROBOT PULSE en inglés; controles traducidos a español e inglés.
- Ícono de Android y favicon con el robot aprobado sobre transparencia.

## Integración

`game/src/game-art-data.js` describe 62 regiones de ocho atlas. `game-art.js` dibuja regiones en Canvas y HTML; usa nueve cortes en botones y placas para conservar los biseles al variar su tamaño. Los PNG originales no se modifican.

`renderer.js` dibuja el tablero, las flechas y los efectos a resolución de pantalla. El motor no depende del dibujo; los disparos destruyen únicamente el primer bloque visible que coincide con el color.

`gameplay-ui.css` distribuye el nivel en un lienzo de diseño de 887 × 1774 y lo encaja en la pantalla sin scroll. Los robots de la cola conservan su proporción. Los marcos tienen texto y botones reales, no texto incrustado en las imágenes.

La revisión del nivel pasa a 2: una partida antigua de 78 bloques no puede recuperarse dentro del tablero nuevo. Se conservan las monedas, los ajustes y los récords cuando la instalación permite conservar los datos. Las herramientas consumidas y la sexta bandeja se guardan con la partida.

## Alcance de la prueba

Compras de monedas simuladas, sin cobros. Clasificación local con oponentes y archivo de ejemplo, sin servidor. Anuncios con recompensa aún no conectados; la opción correspondiente lo explica sin conceder recompensas ficticias. Solo el nivel 1 es jugable.
