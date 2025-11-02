# Flashcards – 1st Grade Spelling (UMD, listo para GitHub Pages)

## Pasos rápidos
1. Sube `index.html`, `app.js` y la carpeta `audio/` a tu repositorio.
2. Activa GitHub Pages: Settings → Pages → Source = Deploy from a branch → Branch = main /(root) → Save.
3. Abre tu URL de Pages: `https://TU_USUARIO.github.io/TU_REPO/`
4. Voltea una tarjeta y pulsa 🔊 Escuchar. Coloca tus archivos como `audio/happy.mp3`, etc.

## Estructura
```
/
  index.html
  app.js
  audio/
    happy.mp3
    sad.mp3
    .gitkeep
```

## Notas
- `index.html` incluye React/ReactDOM UMD (no necesitas build tools).
- `app.js` no usa imports ni exports; monta con `ReactDOM.createRoot(...)`.
- Los audios deben llamarse igual que la palabra, en minúsculas (ej. `happy.mp3`).
