# Versión 0.1.0 — alcance y reglas

## Motor

El primer nivel representa un robot original de 12 × 12 celdas, con 78 bloques: 56 cian, 14 ámbar y 8 violeta. Las ocho unidades disponen exactamente de esa munición total. Se lanzan únicamente las cabeceras de tres colas.

La cinta tiene capacidad para cinco robots. La espera tiene cinco puestos diferentes. Cada robot da una vuelta, escanea hacia el interior al pasar por cada fila o columna y dispara solo si el primer bloque visible es de su color. Un color distinto obstruye el disparo; no se gasta munición en fallos. Al agotarla, el robot abandona la cinta. Si conserva munición al terminar la vuelta, pasa a la espera y puede relanzarse. Si los cinco puestos están ocupados cuando vuelve otro robot con munición, se pierde la partida.

El nivel introductorio favorece la comprensión. La prueba de resolución usa el mismo motor que el juego y solo lanza robots y avanza el tiempo; no elimina bloques mediante atajos. La condición de espera llena se comprueba también con un escenario específico.

## Energía y premios

- Máximo: 5 cargas. Derrota, abandono o reinicio: −1. Victoria: sin gasto.
- Regeneración de prototipo: 1 carga cada 30 minutos, también durante el cierre.
- Primera victoria: 40 monedas. Repeticiones: 10. Mejor puntuación y estrellas solo mejoran.
- Los identificadores de partida evitan recompensas o descuentos duplicados al recibir más de una notificación de fin.
- Recarga completa: 120 monedas. Suministro diario: 100 monedas, una vez por fecha local.
- Acabados ámbar / violeta: 250 / 350 monedas; volver a equiparlos no cuesta.
- Los paquetes de moneda muestran precios ilustrativos y confirmación explícita de **compra de prueba sin cargos**.

Son reglas ajustables del prototipo; no constituyen una economía comercial validada. El ranking usa rivales de muestra y la marca de este dispositivo. No existe un servidor multijugador.

## Arquitectura y recursos

`engine.js` no conoce el DOM ni Android. `renderer.js` dibuja el tablero, la cinta, los robots cenitales y los disparos en Canvas. Los paneles, textos y controles son HTML/CSS reales; `icons.js` define los recursos SVG reutilizables. La portada y el personaje del menú son dos ilustraciones independientes, no pantallas aplanadas usadas como controles.

`profile.js` valida el perfil y guarda en localStorage. Se guarda la partida al lanzar, aparcar, pausar y periódicamente. Cerrar la app no cobra una derrota automáticamente. Una partida guardada reanuda su estado. El cambio de fecha / reloj puede alterar la economía local: no es un sistema antifraude ni un sustituto de un backend para cobros.

El contenedor Android sirve exclusivamente recursos empaquetados a un origen HTTPS interno, bloquea navegación externa y desactiva acceso a archivos y contenido. No añade un puente JavaScript nativo ni requiere permiso de red. El botón Atrás pausa la partida, regresa por los menús o cierra desde la apertura. El guardado es local: desinstalar elimina el progreso.

## Límites actuales

Un nivel jugable. No hay publicación en tiendas, anuncios, pagos, sincronización de cuentas, notificaciones ni clasificación en línea. La pantalla Shop funciona con moneda local y paquetes simulados. Las pestañas de ranking filtran datos de ejemplo. Los siguientes niveles permanecen bloqueados.

## Verificación

`npm test`: resolución del nivel, exposición de colores, munición, capacidades, retorno y relanzamiento, pausa, guardado, corrupción de datos, batería, premios idempotentes y compras por moneda local.

`npm run test:browser`: apertura, tres menús, tienda, filtros, disparos, pausa, reanudación tras recarga, victoria, premio, pérdida de una carga por abandono, recarga y español en tamaño de teléfono. Guarda capturas y resultados en `test-results/` como artefacto de la compilación.

El flujo Android también verifica la firma del APK. Las pruebas de navegador no equivalen a haber ejecutado la app en todos los modelos de teléfonos; la instalación en el teléfono del propietario es el siguiente control práctico.
