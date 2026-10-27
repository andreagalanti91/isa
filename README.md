# Tata Isa · Pet Sitter

Landing page one-page statica (HTML + CSS + JS vanilla). Nessuna build: carica la cartella così com'è su Vercel, Netlify o cPanel.

```
index.html   styles.css   main.js
assets/      immagini (WebP + JPG), video H.264 compressi, poster, og-isa.jpg
```

Anteprima locale: `python3 -m http.server` e apri http://localhost:8000

## TODO prima della pubblicazione

Cerca e sostituisci in `index.html`:

| Segnaposto | Cosa inserire |
|---|---|
| `39XXXXXXXXXX` | Numero WhatsApp di Isa (link `wa.me`, 5 occorrenze) |
| `{{TELEFONO}}` | Telefono, formato `+39…` (link `tel:`, footer, JSON-LD) |
| `{{EMAIL}}` | Email |
| `{{INSTAGRAM}}` | URL del profilo Instagram (e handle visibile nel footer) |
| `{{ZONA}}` | Città / zona servita (title, description, OG, JSON-LD, hero, footer) |
| `https://www.example.com/` | Dominio definitivo (canonical, `og:image`, JSON-LD) |

## Asset

- Originali in `assets/src/` (esclusi da git). `reference-isa.webp` è solo moodboard: non viene pubblicato.
- Ri-generare i video: `ffmpeg -i src/video-X.mp4 -an -vf "scale=720:-2,fps=30" -c:v libx264 -crf 28 -preset slow -movflags +faststart video-X.mp4`
