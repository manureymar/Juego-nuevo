# Prompts del robot lanzador

Modo: herramienta integrada de imágenes.

## 01. Diseño nuevo del personaje

Sin imágenes de referencia.

```text
Use case: stylized-concept.
Create an ORIGINAL CHARACTER DESIGN SHEET for the player's friendly ROBOT SHOOTER in a futuristic mobile pixel-block puzzle. The user wants an actual recognizable character with personality, not an abstract spaceship or a generic gun, and it must be easy to implement as reusable 2D sprites. One coherent character design, not unrelated options.
Landscape 3:2 polished art-direction sheet, dark matte midnight-blue background, restrained thin cyan section separators, professional beautiful mobile game art.
CHARACTER DESIGN: a small squat approachable robot with a single broad rounded-square/soft hexagonal body, slightly narrower bottom, bold cyan colored shell taking up most of its visible area, dark inset visor occupying the upper face, TWO highly readable luminous off-white rounded-square eyes and a tiny understated pixel smile. Distinct signature: ONE short stepped two-block antenna on its upper-left corner, like a little offset digital sprout. A single tiny amber indicator at the antenna tip. Compact side panels suggest shoulders but there are no articulated arms. Two very short rectangular foot pads tucked below the body, no long legs. One SHORT, SIMPLE energy emitter integrated into the LOWER CHEST, below the visor, leaving the face completely visible. The emitter is a tiny dark rectangular opening with a clean glowing colored square core, not a giant cannon barrel or a mouth. Clear silhouette: charming blocky futuristic companion, compact and substantial. Friendly alert attitude, curious rather than babyish. No pig ears, snout, wheels, wings, spacecraft silhouette, weapons held in hands, accessories, cables or complex mechanical greebles.
ART STYLE: clean stylized 2D game character with very shallow layered shading, crisp edges, large simple shapes, one small highlight and one soft shadow, easy to rebuild with basic shapes or a small sprite. Not photorealistic, not a detailed 3D toy render. Readable at 48 to 64 pixels in-game. No realistic materials, rough textures or intricate joints.
SHEET COMPOSITION:
Left 45 percent: one large clear three-quarter/front hero view of the cyan robot, with a charming slightly inquisitive tilt. Only the character, no scenery.
Upper right: two smaller CONSISTENT practical views of the same robot: direct front and slight top-down gameplay view. The gameplay view has a compact separate rectangular ammo plaque above the visor reading exactly "24". The eyes and chest emitter still clearly visible. These are the same character and proportions, not redesigns.
Middle right: a row of three visor-only expression studies using identical visor shape and minimal eye pixels: curious wide eyes, focused slightly narrowed eyes, delighted upward-curved pixel eyes. Emotion comes only from eye shapes and subtle body tilt, no mouth gymnastics.
Bottom across width: FOUR equal-sized full-body palette variants of the SAME robot in cyan, coral, amber and violet. Color only the shell and emitter accent, keep dark visor and white eyes consistent. Include concise ammo plaques "40", "20", "30", "10" on these gameplay variants. The design remains identical in every view and color.
Text: only exact modest Spanish section labels "ROBOT LANZADOR", "VISTAS", "EXPRESIONES", "COLORES". No character name yet, no long annotations, no marketing copy, no logo, no watermark. Beautiful simple iconic original game character with a strong friendly personality and futuristic identity.
```

## 02. Integración en el juego

Referencia 1 (pantalla objetivo): art/figuras/2026-10-08-cinco-conceptos/03-mariposa.png.
Referencia 2 (personaje): 01-diseno-personaje.png.

```text
Use case: ui-mockup / character integration.
There are TWO reference images. Image 1 is the TARGET GAMEPLAY SCREEN to edit (the futuristic game with the large square-pixel butterfly). Image 2 is the CHARACTER DESIGN reference (the friendly cyan robot with stepped antenna, digital face and square chest emitter).
Change ONLY the shooter units in Image 1 so that every shooter is the robot character from Image 2. Preserve the entire futuristic interface, portrait 9:16 layout, butterfly pixel blocks, rail, coin/level text, five waiting bays, three launch queues and bottom controls. Keep the butterfly intact with no projectile trails obscuring it.
All units must be the SAME original friendly little robot from Image 2, scaled appropriately and recolored by gameplay color: cyan, coral, amber, violet. Recognizable traits: compact rounded-square colored shell, two luminous square eyes on a black visor, tiny pixel smile, ONE stepped antenna with amber tip, short feet and ONE small square energy emitter IN THE CHEST below the face. No spaceship drones, no triangular craft, no wheel robots, no giant gun barrel. Personality should still read in the small gameplay units. Aim for simple 2D sprites with a little layered shading.
Preserve the existing unit positions and counts:
THREE active robots on the perimeter: left cyan 18, top violet 24, right coral 12.
FIVE waiting bays: first amber 40 and second violet 30 occupied, last three empty.
THREE launch queues of three robots each, topmost robot closest to the board emphasized, others dimmed. Small readable ammo badges in a separate dark rectangular plaque just ABOVE each robot, not covering eyes. Numbers and faces must not overlap adjacent units.
Use a consistent slight top-down / three-quarter game view so the robot face and chest square remain visible. The active units are stopped in this concept frame and need not fire; preserve the whole central artwork.
The character should be a friendly companion who is doing the shooting, not just an abstract firing device. Keep the technology setting, attractive sharp square pixel art and overall modern sci-fi theme. No new captions, no watermark, no extra character names.
```
