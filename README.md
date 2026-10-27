# Tata Isa · Pet Sitter

Landing page statica in tre lingue (IT `/`, EN `/en/`, DE `/de/`). HTML + CSS + JS vanilla, nessuna dipendenza esterna (font ospitati in `assets/fonts/`).

## Come si modifica

I file `index.html`, `en/index.html` e `de/index.html` sono **generati**: non modificarli a mano.

- Testi e traduzioni → `src/content.py`
- Struttura HTML → `src/template.html`
- Stili → `styles.css` (viene minificato e messo inline nelle pagine)
- Comportamenti → `main.js`

Poi rigenera: `python3 build.py`

Anteprima locale: `python3 -m http.server` e apri http://localhost:8000

## Pubblicazione (GitHub Pages)

Repo → **Settings → Pages → Build and deployment → Source: Deploy from a branch** → branch `claude/admiring-faraday-ozfg0z`, cartella `/ (root)` → Save.
L'indirizzo sarà https://andreagalanti91.github.io/isa/ (se usi un dominio tuo, aggiorna `BASE` in `src/content.py`, `robots.txt` e `sitemap.xml`).

## Contatti

WhatsApp: +39 339 849 9393 (`WA_NUMBER` in `src/content.py`). Il compositore nella sezione Contatti crea il messaggio già compilato nella lingua della pagina.

## TODO

- [ ] Recensioni vere: la sezione `#recensioni` in `src/template.html` è pronta ma `hidden`. Inserisci testi reali (con il consenso dei clienti) e togli `hidden`.
- [ ] Email e Instagram nel footer (quando disponibili).
- [ ] Dominio definitivo (opzionale).

## Asset

- Originali in `assets/src/` (esclusi da git). `reference-isa.webp` è solo moodboard: non viene pubblicato.
- Ri-generare un video: `ffmpeg -i src/video-X.mp4 -an -vf "scale=720:-2,fps=30" -c:v libx264 -crf 28 -preset slow -movflags +faststart video-X.mp4`

## Controllo mobile (Lighthouse, profilo mobile, tutte e 3 le lingue)

Performance 97 · Accessibilità 100 · Best practices 100 · SEO 100 — CLS 0, ~290 KB al primo caricamento.
