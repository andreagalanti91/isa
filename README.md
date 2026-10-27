# Tata Isa · Pet Sitter

Landing page statica in quattro lingue (IT `/`, EN `/en/`, ES `/es/`, DE `/de/`). HTML + CSS + JS vanilla, nessuna dipendenza esterna (font ospitati in `assets/fonts/`).

## Come si modifica

I file `index.html`, `en/`, `es/` e `de/index.html` sono **generati**: non modificarli a mano.

- Testi e traduzioni → `src/content.py`
- Struttura HTML → `src/template.html`
- Stili → `styles.css` (viene minificato e messo inline nelle pagine)
- Comportamenti → `main.js`

Poi rigenera: `python3 build.py`

Anteprima locale: `python3 -m http.server` e apri http://localhost:8000

## Pubblicazione (GitHub Pages)

Repo → **Settings → Pages → Build and deployment → Source: Deploy from a branch** → branch `claude/admiring-faraday-ozfg0z`, cartella `/ (root)` → Save.
L'indirizzo sarà https://andreagalanti91.github.io/isa/ (se usi un dominio tuo, aggiorna `BASE` in `src/content.py`, `robots.txt` e `sitemap.xml`).

## Materiali stampabili (`stampa/`)

- `tata-isa-strutture.pdf`: presentazione A4 (2 pagine) per hotel, agriturismi, ristoranti, cantine e wedding planner. È scaricabile anche dalla sezione Strutture del sito.
- `tata-isa-volantino-A5.pdf`: volantino A5 per la reception (IT/EN/ES), con spazio per il nome della struttura.

Sorgenti in `src/print/`. Per rigenerarli: `node src/print/make-pdf.js` (richiede Playwright).
Il QR code (`assets/print/qr-sito.svg`) punta a https://andreagalanti91.github.io/isa/: **se cambi dominio va rigenerato**, insieme ai PDF.

## Contatti

WhatsApp: +39 339 849 9393 (`WA_NUMBER` in `src/content.py`). Il compositore nella sezione Contatti crea il messaggio già compilato nella lingua della pagina.

## TODO

- [ ] Recensioni e foto vere (con il consenso dei clienti): ora ci sono 6 segnaposto. Metti le foto in `assets/reviews/` e compila `REVIEW_CARDS` in `src/content.py` (`photo`, `quote`, `name`, `place`).
- [ ] Domande frequenti: risposte generiche da far verificare a Isa (`faq` in `src/content.py`).
- [ ] Email e Instagram nel footer (quando disponibili).
- [ ] Dominio definitivo: aggiorna `BASE`, `robots.txt`, `sitemap.xml`, il QR code e i PDF.
- [ ] Profilo Google Business.

## Asset

- Originali in `assets/src/` (esclusi da git). `reference-isa.webp` è solo moodboard: non viene pubblicato.
- Ri-generare un video: `ffmpeg -i src/video-X.mp4 -an -vf "scale=720:-2,fps=30" -c:v libx264 -crf 28 -preset slow -movflags +faststart video-X.mp4`

## Controllo mobile (Lighthouse, profilo mobile, tutte e 3 le lingue)

Performance 97 · Accessibilità 100 · Best practices 100 · SEO 100 — CLS 0, ~290 KB al primo caricamento.
