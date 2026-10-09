# Verificación de Robot Pulse 0.3.0

Fecha: 9 de octubre de 2026.

- Código comprobado: `3422c3d4736134888b429864997b6fc3cb967449`.
- [Compilación y pruebas aprobadas](https://github.com/manureymar/Juego-nuevo/actions/runs/37964435656).
- [APK](../downloads/RobotPulse-0.3.0.apk) · [Capturas reales](screenshots-v0.3/README.md).

| Comprobación | Resultado |
| --- | --- |
| Motor, economía, guardado y clasificación mensual | 17 pruebas aprobadas |
| Recorrido web | Nivel ganado mediante el motor; guardado, navegación, compras de prueba, recarga y audio correctos |
| Home y Leaderboard sin scroll | EN/ES en 360 × 640, 390 × 844 y 412 × 915; controles visibles y pulsables; capturas revisadas |
| Shop | EN/ES, cuatro tamaños, seis paquetes y premio diario comprobados |
| Datos dinámicos | Filtros de período y región, fichas de pilotos, jugador en primer lugar, batería 0–5 y niveles futuros |
| Clasificación mensual | Cambio de mes UTC, año nuevo y febrero bisiesto; récord general conservado |
| Instalación Android | APK instalado y abierto en Android 15, Pixel 7 emulado |
| Ajuste nativo | WebView 412 × 863, DPR 2,625; fuente del sistema 1,4; capturas EN/ES revisadas |
| Pulsaciones | Entrada táctil nativa en Home, Shop y Leaderboard; filtros y filas responden |
| Música y efectos | Inicio automático, continuidad, bucle, pausa en segundo plano y controles separados; WAV decodificado |
| Uso sin conexión | Recorrido Android con Wi-Fi y datos desactivados |
| Errores JavaScript / recursos | Ninguno en los recorridos aprobados |
| Firma e integridad | apksigner aprobado; ZIP íntegro; checksum coincide con el artefacto |
| Recursos empaquetados | 55 archivos coinciden byte por byte con game/ |
| Archivo publicado | Tamaño y blob Git coinciden con el APK verificado |
| Teléfono físico del propietario | Pendiente de su prueba |

Archivo: `RobotPulse-0.3.0.apk`, 52,002,109 bytes. Paquete `com.manureymar.robotpulse.preview`, versión `0.3.0-preview`, código 3. Android mínimo API 26; objetivo 35. APK de prueba con firma de depuración.

SHA-256:

```text
0800680e1c356cd2cbff506e7bb487d6b6ed9eae41a7e77d0ee80cb199a12458
```

Certificado SHA-256: `9abe63ceeca1f820ca8e6d134677b4644ff1d48d76d74e26c70931b6493b0701`.

Blob Git del APK: `5c948a04c877300f28a8bbabc0485517e0a7b3d8`.

La firma difiere de la de 0.2.0. Para sustituir esa instalación hay que desinstalarla; esto borra su progreso local. No se incluye una clave de firma privada en el repositorio.

Las compras siguen simuladas, los rivales son ejemplos locales y el primer nivel es el contenido jugable. Home, Leaderboard y la batería ahora usan el arte de las referencias. La pantalla de la partida mantiene su implementación anterior. La validación nativa descarta únicamente los avisos conocidos del sistema/emulador; un fallo de Robot Pulse haría fallar la prueba.
