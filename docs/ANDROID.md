# Instalar y probar Robot Pulse en Android

1. Abre desde el teléfono el enlace [RobotPulse-0.7.2.apk](https://github.com/manureymar/Juego-nuevo/raw/refs/heads/main/downloads/RobotPulse-0.7.2.apk).
2. Guarda el archivo y ábrelo desde Descargas.
3. Si Android lo solicita, permite que el navegador o el gestor de archivos instale esa aplicación.
4. Pulsa Instalar y abre **Robot Pulse**.

**Actualización desde 0.5.0, 0.6.0, 0.7.0 o 0.7.1:** instala 0.7.2 encima de la aplicación actual para conservar el progreso. Se mantiene el mismo identificador y la misma clave de vista previa. Si ya ganaste el nivel 1 y no recogiste la carta de minería, la recibirás al entrar en HOME. La versión 0.4.0 usaba otra firma y no admite esa actualización directa.

Requisitos de esta versión: Android 8.0 o posterior y Android System WebView actualizado. El APK incluye el juego, las ilustraciones, la tipografía y tu música; después de descargarlo funciona sin internet. La app no solicita acceso a cámara, micrófono, archivos, contactos ni internet.

Es un APK de prueba, firmado con `android/preview-signing.keystore`, una clave pública de desarrollo sin uso de producción. No es una entrega para Google Play. La clave de publicación definitiva debe configurarse por separado y nunca guardarse en el repositorio.

## Recorrido de prueba

- PLAY en la apertura → HOME → PLAY para entrar al nivel 1.
- Lee el tutorial. Empieza por un robot cian; toca las cabeceras de las tres colas.
- Los robots giran por la cinta y disparan solos. Si regresan con munición, toca su espacio de espera para relanzarlos.
- Prueba los tres círculos de herramientas: bandeja extra, elegir un robot visible y mezclar las colas. Cada una tiene una unidad inicial.
- Vacía el tablero para ganar. Pausa permite continuar, reiniciar o salir; abandonar usa una carga de energía.
- Después de la primera victoria, toca la carta de minería y arrastra la mina del menú inferior hasta la cueva. El contorno verde indica que puedes soltarla. El resto de edificios permanece bloqueado.
- La mina conserva la animación web aprobada; el vagón queda inmóvil y se llena. Usa Recoger para convertir el oro en monedas y + para acercar la vista. Vuelve a entrar desde el portal MINA en HOME. Produce un oro por minuto, hasta 120 de oro, y cada oro vale cinco monedas.
- En SHOP, EXPLORAR abre el regalo diario. La batería abre la recarga y muestra los segundos que faltan para recuperar una carga. Los paquetes de monedas son **compras simuladas sin dinero real**.
- En LEADERBOARD consulta tu mejor puntuación mensual local y los podios de meses anteriores en Máster. Los demás pilotos y el archivo son datos de ejemplo.
- En Ajustes cambia a español y controla la música y los efectos por separado. La música continúa entre los menús y se pausa durante la partida o al dejar la app en segundo plano.
- Cierra y abre la aplicación para comprobar que se conserva el progreso.

## Compilar desde el código

La combinación fijada es JDK 17, Gradle 8.11.1, Android Gradle Plugin 8.9.2 y SDK 35, según [compatibilidad oficial de AGP 8.9](https://developer.android.com/build/releases/agp-8-9-0-release-notes).

En Android Studio abre la carpeta `android/`, instala SDK 35 / Build Tools 35.0.0 y usa Build APK. También puedes ejecutar, con Gradle instalado:

```sh
gradle -p android assembleDebug
```

El APK se genera en `android/app/build/outputs/apk/debug/app-debug.apk`. El flujo [Android](../.github/workflows/android.yml) ejecuta las pruebas, compila, verifica la firma y copia el archivo a `downloads/RobotPulse-0.7.2.apk`. Si el código cambia durante una compilación, solo la versión más reciente publica el APK.
