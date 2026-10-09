# Verificación de Robot Pulse 0.2.0

Fecha: 9 de octubre de 2026.

- Código comprobado: `2966b4a993561d617754b9034c67862a61cdebab`.
- [Ejecución de compilación y pruebas](https://github.com/manureymar/Juego-nuevo/actions/runs/37955704944).
- [APK](../downloads/RobotPulse-0.2.0.apk) · [Capturas reales](screenshots-v0.2/README.md).

| Comprobación | Resultado |
| --- | --- |
| Motor, economía y guardado | 14 pruebas aprobadas |
| Recorrido web | Partida ganada con el motor real; navegación, compras de prueba, recarga, guardado y español correctos |
| Shop sin scroll | Controles visibles y pulsables en 360 × 640, 360 × 740, 390 × 844 y 412 × 915; capturas revisadas |
| Instalación Android | APK instalado y abierto en Android 15, Pixel 7 emulado |
| Ajuste nativo | Fuente del sistema a 1,4; escala del WebView fijada, sin recortes en los controles |
| Pulsaciones | Apertura y Shop mediante entrada táctil nativa; seis paquetes y premio diario comprobados |
| Música | Arranca antes de tocar el juego, continúa entre menús, repite, se pausa en segundo plano y vuelve al regresar |
| Efectos | WAV de botón decodificado correctamente; controles de sonido y música separados |
| Idioma y Atrás | Inglés/español y botón Atrás nativo comprobados |
| Uso sin conexión | Recorrido Android con Wi-Fi y datos desactivados; recursos y audio locales |
| Errores de JavaScript / recursos | Ninguno en los recorridos aprobados |
| Firma e integridad | Firma comprobada con apksigner; ZIP íntegro; checksum coincidente |
| Recursos empaquetados | 47 archivos coinciden byte por byte con `game/` |
| Teléfono físico del propietario | Pendiente de su prueba |

Archivo: `RobotPulse-0.2.0.apk`, 44,230,357 bytes. Paquete `com.manureymar.robotpulse.preview`, versión `0.2.0-preview`, código 2. Android mínimo API 26; objetivo 35. APK de prueba con firma de depuración, sin permisos de red, cámara, micrófono, contactos o almacenamiento.

SHA-256:

```text
6c2ac86b60d30bf6cfae1540ec1a5df2542461f308014c5ebae52dac8f196f4a
```

El recorrido nativo cierra el aviso educativo de pantalla completa de Android. También reconoce un aviso observado del Pixel Launcher del emulador al arrancar en frío; un fallo de Robot Pulse nunca se descarta como si la prueba hubiese pasado. Las capturas finales se guardan después de cerrar los avisos del sistema.

Las compras siguen siendo simuladas, la clasificación es local y el contenido jugable sigue siendo el primer nivel. La revisión visual de esta entrega se concentra en apertura y Shop; el rediseño completo de Home, Leaderboard y la partida queda para la siguiente fase.

La firma de prueba de 0.2.0 difiere de la de 0.1.0. Para sustituir la aplicación anterior se necesita desinstalarla, lo que borra sus datos locales.

Huella SHA-256 del certificado de 0.2.0: `af8be1463484685ae32f4a6dcc4f5900d1d8eb6311cc16fb08a830caa9d23a06`.
