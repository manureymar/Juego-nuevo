# Recursos de producción — Robot Pulse

- `splash.png`: fondo de apertura sin texto ni botones, derivado del arte de batalla aprobado. El título y PLAY se dibujan por código y responden al idioma.
- `hero.png`: robot original aislado con transparencia para el menú.
- `app-icon.svg`: icono vectorial propio; su equivalente nativo está en `android/app/src/main/res/drawable/ic_robot_pulse.xml`.
- Los demás iconos y el robot de colas están definidos en `game/src/icons.js`; los robots cenitales en movimiento se dibujan en `game/src/renderer.js`.

Las dos ilustraciones se generaron con imagegen integrado, a partir de las referencias originales del repositorio. No se utilizan capturas de Pixel Flow como recursos de la app. Los archivos fuente de todos los iconos están en este repositorio.
