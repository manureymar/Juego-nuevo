# Robot Pulse

Primera versión jugable de Robot Pulse: un puzle original de robots lanzadores, figuras de píxeles cuadrados y ambientación futurista. Código de juego sin dependencias de ejecución, con un contenedor Android que incluye todos los recursos para jugar sin conexión.

## Probar en Android

- [Descargar RobotPulse-0.5.0.apk](https://github.com/manureymar/Juego-nuevo/raw/refs/heads/main/downloads/RobotPulse-0.5.0.apk)
- [Estado de la compilación y pruebas](https://github.com/manureymar/Juego-nuevo/actions/workflows/android.yml)
- [Instrucciones de instalación](docs/ANDROID.md)

APK 0.5.0 disponible (75,4 MB): compilación, firma e instalación en emulador Android verificadas el 9 de octubre de 2026. Es una versión de prueba firmada para instalación directa, no una publicación en Google Play. Compatible con Android 8.0 o posterior.

[Capturas reales de las pantallas y del nivel](docs/screenshots-v0.5/README.md) · [Informe de verificación](docs/VERIFICATION.md)

## Qué incluye

- Apertura con el fondo de batalla, el logo original y el botón PLAY/JUGAR, sin textos adicionales.
- HOME: arte de campaña integrado, robot ilustrado, nivel 1 y continuación de la partida guardada; sin scroll.
- SHOP: arte integrado, seis paquetes y panel de monedas gratis, sin scroll y con navegación inferior visible. Compras de prueba con confirmación, sin cobros reales. Recarga desde la batería.
- LEADERBOARD: podios y robots ilustrados, clasificación mensual, posición personal dinámica y archivo Máster de podios por mes, sin scroll. Rivales de ejemplo locales, sin servidor.
- Nivel 1 completo: figura sencilla de 42 píxeles, tres colores, robots cenitales, munición exacta por color, cinta para cinco robots y cinco espacios de espera independientes.
- Disparos automáticos solo al primer bloque expuesto de su color. Relanzamiento de robots que vuelven con munición.
- Seis robots visibles en tres columnas y dos filas, con plataformas, avance animado y ojos expresivos y herramientas funcionales: bandeja extra, selección de robot y mezcla de colas.
- Victoria, premio, puntuación, estrellas, pausa, derrota, reinicio y continuidad al cerrar y abrir.
- Batería con celda cian sencilla y número grande, compartida por las pantallas. Cinco cargas: cada derrota o abandono consume una; ganar no consume. Cuenta regresiva MM:SS actualizada cada segundo y regeneración de prueba cada 30 minutos y recarga por 120 monedas.
- Interfaz en inglés y español; título ROBOT PULSE siempre en inglés. Música aportada por el propietario, efecto de botón original y controles separados de música y efectos.

Los niveles 2 y 3 se muestran bloqueados. El alcance implementado es el primer nivel, no una campaña completa. La economía es ajustable y de prueba. No hay anuncios, cuentas, pagos reales ni servicios de terceros dentro de la app.

## Ejecutar en un ordenador

Requiere Node.js 20 o posterior, sin instalación de paquetes para jugar:

```sh
npm start
```

Abre http://localhost:4173. En una red local puedes abrir la dirección IP del ordenador y el puerto 4173 desde el teléfono.

```sh
npm test
npm run check
```

Las pruebas de navegador requieren Playwright (el flujo de GitHub instala una versión fijada). También compila e instala el APK en un emulador Android, recorre las pantallas con el teléfono sin conexión, verifica su firma y lo guarda en `downloads/` dentro de este repositorio.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `game/` | Juego completo y recursos incluidos en el APK |
| `game/src/engine.js` | Motor determinista de cinta, colas, disparos y resultados |
| `game/src/profile.js` | Energía, premios, tienda y guardado local |
| `game/src/level.js` | Matriz y munición del primer nivel |
| `game/src/icons.js` | Iconos vectoriales auxiliares; el arte principal está en game-art.js |
| `android/` | Aplicación Android offline, Java y Gradle |
| `tests/` | Pruebas del motor, economía y recorrido de usuario |
| `docs/` | Reglas, arquitectura e instalación |
| `art/` | Diseños conceptuales e historial visual |

## Destino de los archivos

Por instrucción del propietario, **este repositorio es el único destino permanente** del código, arte, recursos y documentación del juego. Los avances se guardan con su historial de cambios. No se utiliza otro repositorio ni servicio como destino alternativo del proyecto.

## Referencias visuales

- [Nivel, herramientas y ventanas: integración 0.5.0](docs/UI-0.5.0.md).

- [Pantalla inicial aprobada](art/presentacion/2026-10-09-robot-pulse-v3-play/README.md).
- [Robot con cañón y vista cenital](art/personajes/2026-10-09-robot-canon-v2/README.md).
- [Tres menús con batería](art/ui/2026-10-09-three-menus/README.md).
- [Figuras pixeladas](art/figuras/2026-10-08-cinco-conceptos/README.md).

Los PNG de `art/` son conceptos de diseño. La versión funcional está en `game/`: textos, botones, bloques, iconos, contadores y robots en movimiento son componentes reales independientes.
