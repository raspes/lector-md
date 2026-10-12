# lector-md

Lector de Markdown **100 % local** en un solo archivo HTML. Pensado para leer `.md` con tablas anchas, diagramas Mermaid, bloques de código y HTML embebido, que en crudo son difíciles de entender.

- Se abre con doble clic en el navegador. No instala nada y funciona sin conexión.
- Abre un archivo, arrástralo a la ventana o pega el texto con ⌘V / Ctrl+V.
- Diseñado para que el contenido no salga de tu equipo (ver [Privacidad y seguridad](#privacidad-y-seguridad)).

## Uso

1. Descarga `lector-md.html` desde la última versión en **Releases**.
2. Ábrelo en el navegador.
3. Arrastra un `.md`, usa **Abrir archivo** o pega el texto.

El modo **Fuente** permite pegar o editar el Markdown y volver a la **Vista**. En `examples/prueba-lector.md` hay un documento de prueba con casos difíciles.

## Qué renderiza

| Elemento | Detalle |
|---|---|
| Tablas | Encabezado fijo, scroll horizontal en tablas anchas, celdas cortas sin partir, `<br>` dentro de celdas |
| Mermaid | Flowchart, secuencia, estados, ER, clases, Gantt, pastel, mindmap, timeline, journey, gitGraph. Clic para ampliar con zoom y arrastre |
| Errores de Mermaid | Muestran el mensaje del parser y el código del diagrama, sin romper el resto de la página |
| Avisos | `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` |
| Otros | Índice lateral con seguimiento de lectura, listas de tareas, bloques de código con botón de copiar, metadatos YAML plegables, tema claro/oscuro/auto, estilos de impresión |

## Privacidad y seguridad

Dos capas independientes:

1. **Política de seguridad de contenido (CSP)** en el propio HTML: `default-src 'none'`. El navegador rechaza `fetch`, XHR, WebSocket, `sendBeacon` e imágenes hacia cualquier servidor.
2. **Saneado del Markdown** con DOMPurify antes de insertarlo en la página: se eliminan scripts, iframes, manejadores de eventos, URLs `javascript:`, medios y las URLs de imágenes que no sean `data:`. Así, cargar un documento no genera ni un intento de solicitud externa (verificado en Chromium).

`npm test` verifica ambas capas en Chromium. Las pruebas fallan si se quita la CSP o se debilita el saneado (se comprobó con mutaciones).

**Lo que no cubre:**

- Si haces clic en un enlace externo, el navegador navega. Es una acción tuya.
- Solo se prueba en Chromium. La CSP por `<meta>` es estándar, pero no se verificó en Safari ni en Firefox.
- Las imágenes externas o relativas no se cargan (aparece un marcador). Solo se muestran las incrustadas en base64.
- Los enlaces relativos entre `.md` no se pueden abrir.
- Las extensiones del navegador con acceso a páginas locales pueden leer su contenido, como en cualquier otra pestaña.

## Limitaciones conocidas

- Sin resaltado de sintaxis en el código.
- Las notas al pie no se procesan (se ven como texto).
- Mermaid está fijado en 11.17.2; una sintaxis más reciente puede aparecer como error con su código visible.
- Los diagramas Gantt largos pueden mostrar etiquetas de fecha pegadas entre sí; el visor ampliado ayuda.

## Construir desde el código fuente

Probado con Node.js 22.

```bash
npm ci
npm run build      # genera dist/lector-md.html
npm test           # requiere: npx playwright install chromium
npm run licenses   # regenera THIRD_PARTY_LICENSES.md
```

El build inyecta `marked`, `DOMPurify` y `Mermaid` dentro de `src/template.html`. Es **reproducible**: con el mismo `package-lock.json` produce el mismo archivo byte a byte (el hash se imprime al compilar).

## Estructura

```
src/template.html        interfaz y lógica (con marcadores para las librerías)
build.js                 inyecta las librerías y escribe dist/lector-md.html
test/smoke.js            prueba de humo en Chromium (render, saneado, aislamiento de red)
test/hostile.md          documento con payloads para la prueba de saneado
examples/prueba-lector.md  documento de ejemplo con casos difíciles
scripts/gen-licenses.js  genera THIRD_PARTY_LICENSES.md
```

## Dependencias

Las versiones están fijadas de forma exacta y se eligieron con más de dos semanas de antigüedad al momento de publicarse, para no incorporar un release recién subido a npm.

| Paquete | Versión | Uso |
|---|---|---|
| marked | 18.0.14 | Markdown a HTML |
| mermaid | 11.17.2 | Diagramas |
| dompurify | 3.4.16 | Saneado del HTML |
| playwright | 1.56.0 | Solo para las pruebas |

`npm audit` reporta 2 advertencias de severidad baja en el KaTeX que incluye Mermaid (fórmulas matemáticas). No se han analizado a fondo.

## Licencia

MIT para el código propio, ver [LICENSE](LICENSE). El HTML generado redistribuye software de terceros; sus licencias están en [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) y también **dentro del propio HTML** (enlace «Licencias de terceros» al pie de la página), de modo que viajan con el archivo descargado.
