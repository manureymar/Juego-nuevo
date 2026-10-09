# Robot Pulse — prueba de animación minera

[ABRIR LA PRUEBA WEB](https://raw.githack.com/manureymar/Juego-nuevo/4c35459f871303d4b14065f4cc33e9c9f1f2edf0/previews/mining/index.html)

[Código y recursos](../../previews/mining/) · [Flujo de comprobación](https://github.com/manureymar/Juego-nuevo/actions/runs/38006566783)

Esta entrega es una prueba web independiente. La aplicación Android 0.5.0 y el primer nivel no se modificaron. La interfaz de revisión muestra el detalle de la mina y permite alternar al mapa completo. Los recursos y todo el código están en este mismo repositorio.

## Uso

La animación comienza al terminar de cargar las imágenes. Puedes pausarla, reiniciarla, cambiar entre ½×, 1× y 2×, alternar detalle/mapa, enviar un vagón parcialmente lleno o abrir la galería de las 14 piezas. El vagón sale automáticamente al llegar a seis piedras; cada entrega acredita cinco monedas de demostración por piedra. La prueba no comparte saldo ni partidas con la aplicación.

El taladro gira contra una pared fija. Las piedras aparecen sobre la cinta; la pinza las recoge, mantiene la piedra unida durante el traslado y la deposita en el vagón. El vagón entrega y regresa vacío. No se simula erosión ni caída de piedras.

El enlace utiliza los archivos del commit `4c35459f871303d4b14065f4cc33e9c9f1f2edf0`. El servicio de previsualización puede pedir confirmar el destino la primera vez que se abre una página HTML.

## Verificación

- Cuatro pruebas de lógica: identidad y conservación de piedras, capacidad, articulaciones conectadas, entrega única, recogida parcial y reinicio.
- Recorrido en Chromium a 1440 × 1050, 390 × 844 y 360 × 640: pausa/reanudación, velocidad, reinicio, recogida parcial y completa, mapa y galería.
- Enlace público y recursos HTML, CSS, JavaScript y PNG comprobados.
- Registros y capturas de la ejecución final se adjuntan en esta carpeta.

La ruta del vagón es provisional para demostrar su desplazamiento. La logística entre futuros edificios, acumulación offline, guardado y economía definitiva quedan para la integración posterior.

## Capturas reales

![Prueba de escritorio](desktop.png)

| Teléfono | Galería de recursos |
| --- | --- |
| ![Prueba móvil](mobile.png) | ![Recursos](assets.png) |

[Resultados del navegador](browser-results.json). Las capturas están pausadas para facilitar su comparación; la página comienza animada.
