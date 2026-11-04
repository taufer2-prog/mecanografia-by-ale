# 🚀 TYPING MASTER – GALAXY EDITION by Ale

Juego educativo de mecanografía con temática del universo. Funciona directamente en el navegador (Chrome, Firefox, Edge, Safari…) con HTML, CSS y JavaScript puros: no necesita internet, servidor ni instalación.

## Estructura del proyecto

```
typing-master-galaxy/
├── index.html   → pantallas (inicio, niveles, juego, tutor, resultados, ranking)
├── styles.css   → diseño espacial, teclado, manos y animaciones
├── app.js       → lógica del juego, tutor, ranking y almacenamiento
└── README.md    → este archivo
```

## Cómo ejecutarlo

1. Guarda los 4 archivos en la **misma carpeta**.
2. Haz doble clic en `index.html`.
3. Presiona **Comenzar misión**.

## Modos de juego

### Niveles clásicos (con cronómetro)

| Nivel | Contenido | Tiempo | Multiplicador |
|---|---|---|---|
| 🌍 Fácil | Palabras cortas | 60 s | x1 |
| 🪐 Intermedio | Palabras largas y científicas | 60 s | x2 |
| 🌌 Avanzado | Frases completas | 90 s | x3 |

Escribe el texto que aparece, con sus mayúsculas, tildes y Ñ; se completa solo al escribirlo bien. **Enter** salta la palabra (rompe la racha) y **Esc** termina la partida.

### 🎓 Tutor galáctico (aprende dedo por dedo)

Convierte el teclado en un tutor de mecanografía. Se necesita un **teclado físico en español** (España o Latinoamérica) para poder escribir tildes y la Ñ.

- **Teclado en pantalla** con un color por dedo y marquitas en F y J.
- **Manos animadas**: se ilumina el dedo que debe presionar la siguiente tecla.
- **Indicación de errores**: la tecla equivocada se pone roja y un mensaje dice qué tecla presionaste y con qué dedo debías haberla escrito. El cursor no avanza hasta acertar.
- **8 lecciones**, cada una un destino del sistema solar:

| # | Destino | Teclas nuevas |
|---|---|---|
| 1 | 🌙 Luna | A S D F J K L Ñ (fila base) |
| 2 | 🟤 Mercurio | G H |
| 3 | 🟡 Venus | E R U I |
| 4 | 🔴 Marte | W T Y O |
| 5 | 🟠 Júpiter | Q P |
| 6 | 🪐 Saturno | Z X C V B |
| 7 | 🔵 Urano | N M , . |
| 8 | 🌀 Neptuno | Mayúsculas, tildes y punto (frases completas) |

- Cada lección tiene 5 líneas de práctica. Se aprueba con **85 % de precisión** y se desbloquea el siguiente planeta.
- Estrellas: ★ (85 %+), ★★ (92 %+), ★★★ (97 %+). El progreso queda guardado.
- Al terminar se muestran las teclas que más fallaste para reforzarlas.
- Atajos: **Enter** empieza la lección, **Esc** vuelve al mapa.

## 🏆 Ranking de usuarios

- Al final de **cada partida** (clásica o del tutor) puedes escribir tu nombre y presionar **Guardar**.
- El ranking acumula los puntos de cada jugador y muestra partidas jugadas, mejor puntaje y mejor PPM.
- Si escribes el mismo nombre (sin importar mayúsculas), los puntos se suman al mismo jugador.
- Se abre desde la pantalla de inicio o desde los resultados. Hay un botón para borrarlo.

## Ortografía y teclado

- Todo el contenido está en **español internacional**, con tildes, Ñ, mayúsculas en nombres propios (Marte, Júpiter, la Vía Láctea…) y puntuación correcta.
- Para escribir una vocal con tilde, presiona primero la tecla **´** (a la derecha de la Ñ) y luego la vocal. En el tutor, la lección 8 te guía paso a paso.
- Para una mayúscula, mantén presionada **Mayús (⇧)** con el meñique de la mano contraria. El tutor ilumina la tecla Mayús correspondiente.

## Cómo se calcula

- **PPM**: `(caracteres correctos ÷ 5) ÷ minutos transcurridos`.
- **Precisión (clásico)**: `caracteres correctos ÷ caracteres escritos × 100` (borrar no cuenta).
- **Precisión (tutor)**: `aciertos ÷ (aciertos + errores) × 100`.
- **Puntos clásicos**: `longitud × 10 × multiplicador + bonus de racha`.
- **Puntos del tutor**: `aciertos × 10 − errores × 5 + estrellas × 150`.

## Datos guardados

Todo se guarda en el navegador (`localStorage`): récords por nivel, progreso del tutor, último nombre usado y ranking. Los datos son locales a ese navegador y dispositivo; si borras los datos del sitio, se pierden.

## Personalizar

En `app.js`:

- `WORDS` y `EXTRA_WORDS`: palabras y frases de los niveles.
- `MODES`: tiempo y multiplicador de los niveles clásicos.
- `LESSONS`: lecciones del tutor (`newKeys`, textos y destinos).
- `TUTOR_LINES` y `TUTOR_PASS`: líneas por lección y precisión mínima para aprobar.

En `styles.css`, los colores del tema están en las variables de `:root`.

---
Hecho con ✨ por Ale.
