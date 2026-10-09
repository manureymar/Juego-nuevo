# Verificación de Robot Pulse 0.1.0

Fecha: 9 de octubre de 2026.

- Código compilado: `d25763a53d9db3025063dadf16571a7155fa3e68`.
- [Ejecución de Android completada correctamente](https://github.com/manureymar/Juego-nuevo/actions/runs/37938911690).
- APK guardado en el repositorio por el commit `9ae1d6dd59f36ea8dd475ceb72583d11b2ac8fc9`.
- [Descargar APK](../downloads/RobotPulse-0.1.0.apk).

| Comprobación | Resultado |
| --- | --- |
| Sintaxis y recursos del juego | Aprobado |
| Pruebas de motor, guardado y economía | 14 aprobadas, 0 fallos |
| Recorrido del navegador en tamaño de teléfono | Aprobado, sin errores de JavaScript ni recursos ausentes |
| Pantallas Inicio, Home, Shop y Leaderboard | Navegación y acciones comprobadas |
| Primer nivel | Completado mediante lanzamientos y disparos del motor real |
| Pausa, guardado, reanudación, premios y batería | Aprobado |
| Interfaz en español, 360 × 740 | Aprobado, sin desbordamiento horizontal |
| Compilación Android | BUILD SUCCESSFUL |
| Firma del APK | Verificada, esquema v2, un firmante |
| Archivo descargado | ZIP íntegro, checksum del APK coincide con el publicado |
| Recursos dentro del APK | Coinciden byte por byte con los archivos locales del juego |
| Instalación en un teléfono físico | Pendiente de la prueba del propietario |

## Paquete

- Archivo: `downloads/RobotPulse-0.1.0.apk`.
- Tamaño: 3.857.247 bytes.
- Identificador: `com.manureymar.robotpulse.preview`.
- Versión: `0.1.0-preview`, código 1.
- Android mínimo: API 26 (Android 8.0). SDK objetivo: 35.
- Actividad de inicio: `com.manureymar.robotpulse.MainActivity`.
- Sin permisos solicitados. Recursos del juego incluidos para uso sin conexión.
- APK de depuración para pruebas; no es una compilación de publicación en tiendas.

SHA-256:

```text
e5194ea33cc7e09f1ba8d950466a80ca0eeb118f6ee72ad86d3c0265b3068437
```

La primera ejecución pasó las pruebas del juego y del navegador, pero no llegó a crear el APK porque faltaba `sdkmanager`. La segunda añadió la preparación explícita de las herramientas de Android, repitió las pruebas y compiló correctamente.

Las [capturas](screenshots/README.md) corresponden al juego ejecutándose en navegador móvil simulado. No se ha realizado una prueba en un emulador Android ni en un teléfono físico. La firma y la estructura del paquete están verificadas; la instalación y el comportamiento en el dispositivo del propietario deben comprobarse al abrir el APK.

El alcance de esta entrega es un nivel, tienda de prueba sin cobros y clasificación local con rivales de ejemplo. No incluye pagos, anuncios ni ranking conectado a un servidor.
