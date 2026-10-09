# Integración prevista

## Capas y contenido dinámico

1. Fondo de hangar.
2. Marcos de HUD, arena, bandejas y controles.
3. Cuadrícula y bloques procedentes del estado del nivel.
4. Flechas animadas, robots cenitales, proyectiles e impactos.
5. Colas y botones de herramientas, con sus estados e inventario.
6. Textos localizados, números, monedas, progreso y munición.
7. Oscurecimiento del fondo y ventana emergente activa.

Las siete vistas de `previews/` son referencias visuales. No convertir una vista completa en una imagen de fondo con botones invisibles: las piezas interactivas se componen desde los recursos de `assets/`, y el texto es una capa real. Los recursos existentes de logo, menús, paquetes y podios siguen siendo reutilizables.

## Recorrido y personaje

El recorrido único es antihorario: abajo hacia la derecha, derecha hacia arriba, arriba hacia la izquierda e izquierda hacia abajo. Las flechas se generan y se desplazan por código sobre la cinta vacía. La posición de robots, flechas y disparos comparte la misma ruta; evitar cuatro animaciones independientes que se contradigan en las esquinas.

El sprite cenital apunta hacia arriba. Girar cuerpo y cañón juntos para apuntar hacia el interior: abajo 0°, derecha -90°, arriba 180°, izquierda 90°. El número de munición es una capa separada que permanece derecho. Emitir el proyectil desde la boca del cañón, no desde el centro del cuerpo. Usar el sprite cenital quieto y los efectos separados como animación principal; la pose con destello es una referencia opcional, con un pivote diferente que debe alinearse antes de usarla como fotograma.

La toma ampliada ilustra tamaño y orientación; sus efectos de luz no son instrucciones de trayectoria. La lógica siempre emite del cañón hacia el primer bloque expuesto del mismo color. Al llegar a cero de munición, retirar el robot; al terminar vuelta con munición, trasladarlo a una bandeja libre. Las reglas de pérdida se mantienen en el motor.

## Colas, bandejas y herramientas

- Tres columnas, con hasta tres filas visibles por columna. La primera fila es pulsable y las siguientes anuncian el orden. Al salir un robot, avanzar los restantes; si quedan menos de tres, no inventar personajes decorativos.
- Cinco bandejas iniciales. Diferenciar su ocupación de la capacidad simultánea de la cinta. Mostrar la misma vista aérea del robot en bandeja y en movimiento.
- Bandeja extra: propuesta conforme a la petición del propietario, añade espacio de espera. El aviso del juego de referencia menciona la cinta; no se observó la activación en el video. No trasladar esa ambigüedad al código.
- Seleccionar: permitir elegir un robot de la cola mediante el modo de herramienta, con selección y cancelación claras.
- Mezclar: reordenar únicamente los robots pendientes, preservando inventario, color y munición.
- Cuarta herramienta: icono bloqueado; su función no se vio en el video. No inventarla. Sus niveles de desbloqueo y el resto de la economía necesitan definirse para Robot Pulse.
- Estados reutilizables: normal, pulsado, seleccionado, desactivado, agotado, bloqueado y disponible. Usar los marcos, iconos, cantidades y efectos de brillo separados.

## Ventanas y navegación

`window-recipes.json` cubre ajustes, tres herramientas, futuro bloqueo, compra, energía, información de ranking, perfil, acabados, premio diario, nivel bloqueado, tutorial, pausa, confirmación de salida, victoria, derrota, avisos breves e historial Máster. Todas usan los mismos marcos y botones. Ajustar la altura preservando esquinas y márgenes de contenido; las coordenadas del atlas se validaron en archivo, pero el escalado de nueve regiones y la alineación visual deben verificarse en el motor.

Reutilizar las seis variantes seleccionada/inactiva del menú inferior de `game/assets/ui-v3/manifest.json`. Mantener la navegación fija. El historial Máster propuesto muestra dos meses por vista; para más meses usar paginación si se mantiene el requisito de no hacer scroll. El ranking real requerirá datos y lógica adicionales; la app publicada sigue usando rivales de ejemplo.

La pausa y los diálogos durante la partida deben detener la simulación según su propósito y devolver el control al cerrarse. Evitar registrar un disparo o activar un robot por un toque que haya cerrado una ventana superpuesta.

## Batería, tipografía y traducción

Usar una batería horizontal sencilla con número grande centrado. Su valor es energía de perfil, no munición del robot. Evitar corazones y baterías cilíndricas. Los rellenos pueden recortarse por código para representar 0–5; el número se dibuja siempre encima y con contraste.

ROBOT PULSE conserva su logo inglés. Botones, ayuda, nombres de pantallas, mensajes y formatos numéricos se localizan EN/ES. Reutilizar la tipografía Tektur ya incluida, con ancho/peso comprobados en el teléfono; el arte de muestra no garantiza que las letras generadas coincidan exactamente con esa fuente. Evitar escribir textos o cifras en los archivos de componentes.

## Integraciones y validación pendientes

Este paquete no activa compras, anuncios, nuevos niveles o servicios de clasificación. Los botones de compra/recompensa son diseños; su comportamiento real requiere integración posterior. La cantidad de estrellas, premios y contador de progreso será calculada por código, aunque un ejemplo ilustrado difiera.

Antes de distribuir una app con estos recursos: ajustar atlas y pivotes, comprobar el nivel y munición reales, conectar herramientas y desbloqueos, verificar estados y guardado, revisar inglés/español y áreas táctiles en varios tamaños sin recortes, comprobar sonido y pausa, y compilar e instalar la APK. El icono de launcher se gestiona aparte con el arte aprobado; no se ha aplicado una nueva versión de Android en este paquete gráfico.
