# Minería integrada — Robot Pulse 0.6.0

## Recorrido

1. Ganar el nivel 1 entrega la carta de minería en el idioma elegido. Aparece en el centro, con entrada animada, aura y un reflejo diagonal de arriba a la izquierda hacia abajo a la derecha.
2. Tocar la carta abre la base vacía aportada por el propietario. La flecha indica arrastrar la mina desde la primera casilla del menú inferior a la cueva.
3. El edificio aparece semitransparente: rojo fuera de la cueva y verde al encajar. Soltar dentro construye; fuera cancela. La primera mina está incluida en la carta, sin coste adicional.
4. Arranca la animación aprobada: taladro, chispas y polvo irregulares con gravedad, estera, brazo de carga y vagón inmóvil. El botón + permite acercar la vista.
5. El vagón se llena hasta seis piezas visibles; después sigue recibiendo oro sin desplazarse. El valor acumulado sigue creciendo. Recoger convierte el oro guardado en monedas sin vaciar la pila visual.
6. Energía, camiones, combustible y almacén aparecen en gris con candados. Todavía no se pueden construir; quedan preparados para futuras cartas.

El botón de minería de HOME permite volver a la base. Android Atrás vuelve a HOME. La construcción, la carta consumida y el oro se guardan; una partida ganada en 0.5.0 recibe la nueva carta al entrar en HOME.

## Animación existente

Los archivos `game/src/mining/{engine,renderer,particles}.js` son copias exactas de la última vista web aprobada de `previews/mining/`, revisión `9de29ba715f24168f10d9bbc1e374f5acc2fdfa1`. El chequeo de recursos comprueba esta igualdad. No se ha generado otra mina ni sustituido el movimiento aprobado.

`mining-view.js` coloca esa animación sobre la base vacía, gestiona el arrastre y monta los controles. `mining-state.js` calcula producción y guardado fuera del render, evitando pagos duplicados y conservando los segundos parciales al cerrar.

Economía inicial de prueba: una unidad de oro cada 4 segundos, 5 monedas por unidad. Empieza al construir. La producción continúa durante el puzle y se calcula por tiempo transcurrido al volver. Capacidad de guardado: 9.999.999 unidades; saldo máximo: 9.999.999 monedas. El reloj es local, como el resto de esta app offline.

## Recursos

- `game/assets/mining/background-empty.png`: imagen de base vacía adjunta por el propietario.
- `background-built.png`, `parts.png`, `drill.png`: arte de la animación aprobada, sin cambios.
- `card-en.png`, `card-es.png`: cartas aprobadas, conservadas completas en ambos idiomas.
- `buildings.png`: atlas nuevo RGBA de 1536 × 1024, celdas de 512 × 512. Fila superior: mina, energía, camiones. Fila inferior: combustible, almacén, espacio vacío. El gris y los candados se aplican en código.
- Flecha de tutorial, contorno de encaje, haz de construcción y brillo de carta: SVG/CSS/canvas. Los textos siguen siendo traducibles y los controles independientes.

## Verificación

Pruebas deterministas: desbloqueo, migración de partidas, validación de ubicación, producción offline, recogida única, guardado y vagón fijo. Recorrido de navegador: victoria real del primer nivel, carta, arrastre táctil válido e inválido, cancelación, producción, recogida, recarga de página y pantallas EN/ES. El flujo Android instala el APK offline y prueba la construcción con un gesto táctil del emulador. Los resultados de cada ejecución están en los artefactos de GitHub Actions; el APK se publica solo después de superar esas comprobaciones.

Resultado final del 10 de octubre de 2026: 28 pruebas deterministas, 88 casos de ventanas y recorrido web aprobados; APK instalado y recorrido de minería completo aprobado en Android sin conexión. [Capturas y pruebas de la entrega](mining-v0.6/README.md).
