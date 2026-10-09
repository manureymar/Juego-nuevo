# Robot Pulse — prueba web de la mina

Prototipo independiente en HTML, CSS y JavaScript, creado el 9 de octubre de 2026. No modifica la aplicación ni el nivel jugable.

## Abrir

El enlace público de la versión comprobada se registra en el informe de entrega de `docs/mining-preview/`. Los archivos se sirven directamente desde este repositorio mediante raw.githack.com; la primera visita puede mostrar una confirmación del destino.

Para ejecutarlo localmente desde la raíz del repositorio:

```sh
node previews/mining/serve.mjs
```

Abre `http://localhost:4174`. No se requieren paquetes para ejecutar la prueba. Las pruebas de navegador usan Playwright.

## Comportamiento

- Taladro fijo contra una pared que permanece intacta. Seis fases de la hélice en bucle, sin rotar la máquina completa.
- Cinta con textura móvil y piedras independientes, sin lluvia de partículas ni piedras sueltas en el aire.
- Brazo de dos eslabones conectado por cinemática inversa; palma y dedos de pinza separados. La piedra permanece unida a la pinza durante el traslado.
- Único vagón con seis posiciones de carga. Sale al llenarse, entrega el mineral y regresa vacío; se puede solicitar antes una entrega parcial.
- Cada pieza entregada añade cinco monedas de demostración, una sola vez. No hay monetización real, progreso compartido con la app ni acumulación offline en este prototipo.
- Pausa/reanudación, reinicio, tres velocidades, detalle/mapa y galería de los 14 recursos.
- La simulación se detiene al ocultar la pestaña. Sin servicios, permisos, dependencias de ejecución ni fuentes externas.

## Recursos

14 piezas reunidas en tres PNG: fondo fijo (1), seis fases del taladro (6) y atlas de siete piezas (7). El dedo se instancia dos veces. Las piedras se reutilizan tanto en la cinta como en el vagón. Los PNG tienen transparencia real donde corresponde. Se usan recortes del atlas en Canvas; no hay 14 fondos completos.

- `assets/background.png`: fondo limpio con las estructuras estáticas.
- `assets/drill.png`: seis fotogramas registrados de la hélice.
- `assets/parts.png`: brazo, antebrazo, palma, dedo, oro, textura de cinta y vagón vacío.
- `engine.js`: estados y economía de demostración, independiente del render.
- `renderer.js`: recortes, articulaciones, perspectiva, trayectoria y dibujo.
- `app.js`: controles web y carga de imágenes.
- `ASSET-PROMPTS.md`: instrucciones originales de generación.

La trayectoria de entrega del vagón es una demostración visual; no representa todavía una red logística de edificios. Antes de integrar se definirá el destino concreto dentro del mapa y las reglas de producción y capacidad.

## Comprobar

```sh
node --test previews/mining/tests/engine.test.mjs
node previews/mining/tests/browser.mjs
```

El flujo `.github/workflows/mining-preview.yml` prueba la lógica, recorre controles en 1440×1050, 390×844 y 360×640, registra capturas y un vídeo, y comprueba que el enlace de la revisión y sus recursos estén disponibles.
