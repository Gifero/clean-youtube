# Clean YouTube

Extensión para **Firefox y Zen Browser** que limpia YouTube:

- Oculta los **Shorts** (barra lateral, inicio, búsqueda, canales y relacionados)
- Redirige los enlaces `/shorts/ID` al reproductor normal
- Oculta los vídeos **exclusivos para miembros**
- Interruptores en el popup para activar o desactivar cada opción

## Instalación

**Desde Firefox Add-ons:** _(enlace pendiente)_

**Manual (desarrollo):**
1. Clona el repo: `git clone https://github.com/TU_USUARIO/clean-youtube.git`
2. Abre `about:debugging#/runtime/this-firefox`
3. Pulsa **Cargar complemento temporal…** y elige `manifest.json`

## Privacidad

No recopila ni envía datos. Solo guarda tus dos ajustes en el almacenamiento local del navegador y solo se ejecuta en `youtube.com`.

## Problemas conocidos

YouTube cambia su HTML con frecuencia y algún selector puede dejar de funcionar. Si ves un Short o un vídeo de miembros que se cuela, [abre un issue](../../issues) indicando el idioma de YouTube y, si puedes, una captura.

## Contribuir

Las PRs son bienvenidas. Los selectores CSS están en `hide.css` y la detección por texto en `content.js`.

## Licencia

[MIT](LICENSE)
