# Verificación de Robot Pulse 0.5.0

Fecha: 9 de octubre de 2026.

- Código compilado: `ff0dec277a736bbcbe2428bfad9b51bcb4a51af2`.
- Commit que publica el APK: `95676b6be88db10137f78dbc267eff6303da01ce`.
- [Compilación y pruebas aprobadas](https://github.com/manureymar/Juego-nuevo/actions/runs/37990426447).
- [APK](../downloads/RobotPulse-0.5.0.apk) · [Capturas reales y vídeo](screenshots-v0.5/README.md).

| Comprobación | Resultado |
| --- | --- |
| Motor, economía, guardado y clasificación | 21 pruebas aprobadas, incluido el reloj MM:SS y la recuperación de energía al volver del segundo plano |
| Nivel 1 | Figura de 42 bloques sobre matriz 9 × 9; munición exacta por color; nivel ganado con disparos reales del motor |
| Herramientas y cola | Seis robots visibles, avance conservando identidad, selección trasera pulsable, bandeja extra, mezcla, cancelación sin gasto y persistencia |
| Recorrido web | 8 grupos aprobados: navegación, victoria, premios, pérdida de batería, recarga, guardado, audio y traducciones |
| Paneles y diseño | 88 casos adicionales aprobados en EN/ES, 360 × 640 y 390 × 844; X dentro de cabecera, títulos sin colisiones, textos dentro del marco, botones pulsables |
| Pantallas principales | Home, Leaderboard y nivel en tres tamaños de teléfono y dos idiomas; Shop en cuatro tamaños, sin scroll |
| Cambios de cabecera | Sin avatar, sin botón de regreso duplicado, Home sin logotipo; reloj observado cambiando de segundo |
| Instalación Android | APK instalado y abierto en Android 15, Pixel 7 emulado; seis grupos nativos aprobados |
| Ajuste nativo | WebView 412 × 863, DPR 2,625; fuente del sistema al 140 % |
| Jugabilidad nativa | Seis robots visibles; toque Android lanza un robot, renderiza disparos; herramienta añade sexta bandeja; pausa congela el tablero |
| Uso sin conexión | Recorrido Android con Wi-Fi y datos desactivados |
| Música y efectos | Inicio, continuidad entre menús, bucle, pausa en segundo plano y controles separados comprobados |
| Errores JavaScript y recursos | Ninguno en los recorridos aprobados |
| Firma y archivo | apksigner aprobado, ZIP íntegro y checksum correcto |
| Recursos empaquetados | Los 72 archivos de game/ coinciden byte por byte con el APK |
| Ícono Android | Píxeles RGBA idénticos al PNG aprobado de 1254 × 1254; transparencia preservada; referencia correcta en el manifiesto |
| Archivo publicado | Tamaño y blob Git coinciden con el APK verificado |
| Teléfono físico del propietario | Pendiente de su prueba |

Archivo: `RobotPulse-0.5.0.apk`, 75.427.124 bytes. Paquete `com.manureymar.robotpulse.preview`, versión `0.5.0-preview`, código 5. Android mínimo API 26; objetivo 35. APK de prueba con firma de vista previa.

SHA-256:

```text
162329113e1be3dbd25f6ea3fd86677ed0079f555fac9528c1e0af9d76af5366
```

Certificado SHA-256: `7cd69261b62da3dfd299116a44f25466866f183ff802fa88630ac2dc0b8c5856`.

Blob Git del APK: `d54add0d1473e18524f90301bfceb4d5de104a19`.

La 0.4.0 se firmó con una clave temporal diferente. Para sustituirla hay que desinstalarla, lo que borra su progreso local. Desde 0.5.0 se conserva una clave exclusivamente de vista previa para futuras actualizaciones. No debe usarse como clave de publicación en Google Play.

Las compras siguen siendo simuladas, los rivales y el archivo Máster son ejemplos locales y solo el primer nivel es jugable. Los anuncios con recompensa y el cuarto potenciador siguen pendientes.

Durante la primera ejecución de esta revisión se detectó que el robot delantero interceptaba el toque de selección sobre el trasero. Se corrigió la superposición y se repitió el recorrido completo, que pasó. La revisión visual también corrigió el margen interior de los paneles antes de esta compilación final.
