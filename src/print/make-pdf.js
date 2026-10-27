// Genera i PDF stampabili in stampa/ partendo da src/print/*.html
// Uso: node src/print/make-pdf.js   (serve Playwright con Chromium)
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const JOBS = [
  { src: 'src/print/strutture.html', out: 'stampa/tata-isa-strutture.pdf' },
  { src: 'src/print/volantino.html', out: 'stampa/tata-isa-volantino-A5.pdf' },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const job of JOBS) {
    await page.goto('file://' + path.join(ROOT, job.src), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: path.join(ROOT, job.out), preferCSSPageSize: true, printBackground: true });
    console.log('ok ', job.out);
  }
  await browser.close();
})();
