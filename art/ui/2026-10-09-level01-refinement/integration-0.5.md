# Integración de los recursos — 0.5.0

La propuesta visual y las muestras de movimiento de esta carpeta se integraron en los componentes del juego. La última solicitud retiró además el avatar superior, el regreso duplicado y el logo de Home; esas correcciones prevalecen sobre las imágenes de propuesta anteriores.

El primer nivel mantiene la figura y munición del motor, ampliadas en la pista, con seis robots visibles, plataformas, parpadeo, avance de cola y energía animada por código. No se colocó una captura de pantalla completa como interfaz.

Se usó image_gen integrado para estas ediciones de recursos, sin CLI:

1. Fondo `game/assets/ui-v3/home-clean.png`: retirar únicamente la cabecera dibujada y ROBOT PULSE del fondo original de Home; reconstruir el hangar vacío y conservar el resto de coordenadas, recorrido, botones y navegación.
2. Atlas `game/assets/gameplay/robots-live-atlas.png`: retirar ojos y resplandor de las tres caras de la fila superior del atlas original. Conservar cuerpos compactos, cañones, faros, posiciones y las seis vistas aéreas. Mantener transparencia real. Los ojos se dibujan por separado.

Los otros gráficos proceden de los atlas del proyecto y se reutilizan en componentes. El detalle de los cambios funcionales y de diseño está en `docs/UI-0.5.0.md`.
