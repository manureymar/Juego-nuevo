# Robot Pulse: correcciones visuales y de sonido 0.7.0

Actualización basada en las capturas y el vídeo del propietario sobre la versión 0.6.0. Conserva el puzle, el robot, la apertura y la animación de funcionamiento de la mina aprobados.

## Lista de correcciones

1. Marco ilustrado de batería compartido por los menús y la partida, con cuenta atrás real de recarga.
2. Moneda dorada con emblema de pulso coherente en saldos, premios y recogida.
3. Restauración de la casilla bloqueada original de la esquina superior izquierda de HOME.
4. Portal de mina independiente junto al robot, disponible al ganar su carta, con rótulo traducido.
5. Botones de ventanas de menor altura que conservan su forma ancha.
6. Márgenes interiores que separan las acciones de los laterales y del pie del marco.
7. Títulos centrados y ampliados de 24 a 30 píxeles de diseño, un 25%.
8. Eliminación del parche de fondo que desentonaba detrás de los indicadores de la partida.
9. Retirada del logotipo adicional de Robot Pulse en SHOP y en las dos vistas de LEADERBOARD.
10. Esquina superior derecha del marco de victoria recompuesta sin el hueco de una X inexistente.
11. Vista previa de mina aislada y transparente al arrastrar, sin el rectángulo de escenario recortado.
12. Flecha compacta de metal y luz cian que señala el icono de mina del catálogo.
13. Marcos de producto ilustrados en las cartas del catálogo de construcción.
14. Placas ilustradas coherentes para la cabecera, instrucciones y estado de la mina.
15. Montaje por componentes con anillos de energía ascendentes y partículas, sustituyendo el barrido plano.
16. Oro almacenado separado de las monedas a recibir, con botón de recogida del mismo estilo.
17. Ajuste inicial de economía: un oro por minuto, cinco monedas por oro y capacidad de 120 de oro (dos horas, 600 monedas). El oro guardado anteriormente por encima del nuevo límite sigue siendo cobrable. El tiempo sobrante con el almacén lleno no permite cobrar otra acumulación instantánea.
18. Archivo del propietario `game-ball-tap-2073.wav` incorporado sin modificación para los botones. La música pasa de 0,34 a 0,255, exactamente un 25% menos.
19. Digitalización de la primera carta de minería: revelado por pasos, borde de escaneo y partículas antes del brillo diagonal existente. Respeta la preferencia de movimiento reducido.

## Compatibilidad

Se conservan el identificador Android, el certificado de vista previa, la clave del perfil y la revisión del primer nivel. Los tres módulos de la animación aprobada de minería siguen siendo idénticos a los de su demostración. El llenado visual del vagón mantiene su ritmo, independientemente de la producción económica más lenta. Las compras continúan siendo simuladas; no se añaden cobros, anuncios, clasificación en línea ni niveles jugables nuevos.

## Verificación

Las pruebas de lógica incluyen saldos anteriores, capacidad limitada, cobros repetidos y reanudación de la producción. La revisión de navegador cubre ventanas en inglés y español, arrastre táctil, cancelación, carta, montaje, recogida, progreso sin conexión y victoria real del nivel. El flujo Android comprueba el APK instalado sin conexión, sonido, volumen, producción por tiempo real, gestos nativos y conservación del certificado. Las capturas y los identificadores de las comprobaciones finales se registran en `docs/polish-v0.7/`.
