# Verificación de Robot Pulse 0.4.0

Fecha: 9 de octubre de 2026.

- Código de la compilación: `f27be3485ab1f4a9d8153a339848592195ba427d`.
- [Compilación y pruebas aprobadas](https://github.com/manureymar/Juego-nuevo/actions/runs/37980715877).
- [APK](../downloads/RobotPulse-0.4.0.apk) · [Capturas reales](screenshots-v0.4/README.md).

| Comprobación | Resultado |
| --- | --- |
| Motor, economía, guardado y clasificación | 20 pruebas aprobadas |
| Nivel 1 | 42 bloques eliminados mediante disparos reales del motor; munición exacta por color |
| Herramientas | Bandeja extra, selección trasera, mezcla, cancelación sin gasto y persistencia comprobadas |
| Recorrido web | 8 grupos aprobados: navegación, nivel ganado, premios, pérdida de batería, recarga, guardado, audio y traducciones |
| Diseño móvil | Nivel, Home y Leaderboard en EN/ES: 360 × 640, 390 × 844 y 412 × 915; controles pulsables, sin scroll |
| Shop | EN/ES, cuatro tamaños, seis paquetes y premio diario comprobados |
| Diálogos | Arte integrado en ajustes, pausa, resultados y herramientas; capturas revisadas |
| Instalación Android | APK instalado y abierto en Android 15, Pixel 7 emulado |
| Ajuste nativo | WebView 412 × 863, DPR 2,625; fuente del sistema al 140 % |
| Jugabilidad nativa | Nueve robots visibles; toque Android lanza un robot, quedan 35 bloques; herramienta añade sexta bandeja; pausa funciona |
| Uso sin conexión | Recorrido Android con Wi-Fi y datos desactivados |
| Música y efectos | Inicio, continuidad, bucle, pausa en segundo plano y controles separados comprobados |
| Errores JavaScript y recursos | Ninguno en los recorridos aprobados |
| Firma y archivo | apksigner aprobado, ZIP íntegro y checksum correcto |
| Recursos empaquetados | Los 67 archivos de game/ coinciden byte por byte con el APK |
| Ícono Android | Píxeles RGBA idénticos al PNG aprobado; transparencia preservada; referencia correcta en el manifiesto |
| Archivo publicado | Tamaño y blob Git coinciden con el APK verificado |
| Teléfono físico del propietario | Pendiente de su prueba |

Archivo: `RobotPulse-0.4.0.apk`, 69,724,631 bytes. Paquete `com.manureymar.robotpulse.preview`, versión `0.4.0-preview`, código 4. Android mínimo API 26; objetivo 35. APK de prueba con firma de depuración.

SHA-256:

```text
533b659cb3fac05b358933f19840ec77304805ef16a0d2642a76226d92556916
```

Certificado SHA-256: `436a9d7aa3e61e3ede368d7a222f9904b539a2bcbcf1a148f0cec18106b11988`.

Blob Git: `be0567c55caf11595d67443efa0fe5522bd72e71`.

La firma difiere de 0.3.0: para sustituir esa instalación hay que desinstalarla, lo que borra su progreso local. No se incluye una clave privada de firma en el repositorio.

Las compras son simuladas, los rivales y el archivo Máster son ejemplos locales y solo el primer nivel es jugable. Los anuncios con recompensa y el cuarto potenciador figuran como futuros; no se presentan como servicios conectados.

Una ejecución anterior se detuvo por el límite del proceso de captura PNG del comprobador, después de instalar y abrir correctamente la app. Se amplió ese límite y el recorrido final completo pasó. El comprobador no ignora fallos de Robot Pulse.
