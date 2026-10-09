# Robot Pulse

Primera versión jugable de Robot Pulse: un puzle original de robots lanzadores, figuras de píxeles cuadrados y ambientación futurista. Código de juego sin dependencias de ejecución, con un contenedor Android que incluye todos los recursos para jugar sin conexión.

## Probar en Android

- [Descargar RobotPulse-0.1.0.apk](https://github.com/manureymar/Juego-nuevo/raw/refs/heads/main/downloads/RobotPulse-0.1.0.apk)
- [Estado de la compilación y pruebas](https://github.com/manureymar/Juego-nuevo/actions/workflows/android.yml)
- [Instrucciones de instalación](docs/ANDROID.md)

El enlace del APK estará disponible cuando finalice correctamente la compilación del flujo Android. Es una versión de prueba firmada para instalación directa, no una publicación en Google Play.

## Qué incluye

- Apertura ilustrada con botón PLAY real.
- HOME: selección del primer nivel, robot y acceso a la partida guardada.
- SHOP: recarga por monedas, suministro diario, acabados y compras de prueba claramente identificadas, sin cobros reales.
- LEADERBOARD: mejor marca local y rivales de ejemplo, con filtros. No es un ranking conectado a un servidor.
- Nivel 1 completo: figura original de 78 píxeles, tres colores, robots cenitales, munición exacta por color, cinta para cinco robots y cinco espacios de espera independientes.
- Disparos automáticos solo al primer bloque expuesto de su color. Relanzamiento de robots que vuelven con munición.
- Victoria, premio, puntuación, estrellas, pausa, derrota, reinicio y continuidad al cerrar y abrir.
- Batería con cinco cargas: cada derrota o abandono consume una; ganar no consume. Regeneración de prueba cada 30 minutos y recarga por 120 monedas.
- Interfaz en inglés con traducción al español y sonido procedural opcional.

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

Las pruebas de navegador requieren Playwright (el flujo de GitHub instala una versión fijada). También compila el APK, verifica su firma y lo guarda en `downloads/` dentro de este repositorio.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `game/` | Juego completo y recursos incluidos en el APK |
| `game/src/engine.js` | Motor determinista de cinta, colas, disparos y resultados |
| `game/src/profile.js` | Energía, premios, tienda y guardado local |
| `game/src/level.js` | Matriz y munición del primer nivel |
| `game/src/icons.js` | Iconos SVG y robots escalables programables |
| `android/` | Aplicación Android offline, Java y Gradle |
| `tests/` | Pruebas del motor, economía y recorrido de usuario |
| `docs/` | Reglas, arquitectura e instalación |
| `art/` | Diseños conceptuales e historial visual |

## Destino de los archivos

Por instrucción del propietario, **este repositorio es el único destino permanente** del código, arte, recursos y documentación del juego. Los avances se guardan con su historial de cambios. No se utiliza otro repositorio ni servicio como destino alternativo del proyecto.

## Referencias visuales

- [Pantalla inicial aprobada](art/presentacion/2026-10-09-robot-pulse-v3-play/README.md).
- [Robot con cañón y vista cenital](art/personajes/2026-10-09-robot-canon-v2/README.md).
- [Tres menús con batería](art/ui/2026-10-09-three-menus/README.md).
- [Figuras pixeladas](art/figuras/2026-10-08-cinco-conceptos/README.md).

Los PNG de `art/` son conceptos de diseño. La versión funcional está en `game/`: textos, botones, bloques, iconos, contadores y robots en movimiento son componentes reales independientes.
