#!/usr/bin/env python3
"""Genera index.html (IT), en/, es/ e de/index.html da src/template.html + src/content.py."""
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT / "src"))
from content import BASE, CONTENT, REVIEW_CARDS, WA_NUMBER  # noqa: E402

OUT = {lang: ROOT / "index.html" if lang == "it" else ROOT / lang / "index.html" for lang in ("it", "en", "es", "de")}


def minify_css(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"\s+", " ", css)
    css = re.sub(r"\s*([{};,>])\s*", r"\1", css)
    return css.replace(";}", "}").strip()


def wa_link(text):
    return f"https://wa.me/{WA_NUMBER}?text={quote(text)}"


def reviews_html(c):
    cards = []
    for card, place in zip(REVIEW_CARDS, c["rev_places"]):
        if card.get("photo"):
            photo = f'<img src="{c["root"]}{card["photo"]}" alt="" loading="lazy" width="600" height="600">'
        else:
            photo = (f'<span class="rev-emoji" aria-hidden="true">{card["emoji"]}</span>'
                     f'<span class="rev-soon">{c["rev_ph_photo"]}</span>')
        cards.append(
            f'          <li class="review reveal">\n'
            f'            <div class="rev-photo bg-{card["bg"]}">{photo}</div>\n'
            f'            <blockquote class="rev-quote">“{card.get("quote", c["rev_ph_quote"])}”</blockquote>\n'
            f'            <p class="rev-who"><strong>{card.get("name", c["rev_ph_name"])}</strong>'
            f'<span>📍 {card.get("place", place)}</span></p>\n'
            f'          </li>'
        )
    return "\n".join(cards)


def faq_html(c):
    items = []
    for q, a in c["faq"]:
        items.append(
            f'          <details class="faq-item reveal">\n'
            f'            <summary>{q}<span class="faq-icon" aria-hidden="true"></span></summary>\n'
            f'            <p>{a}</p>\n'
            f'          </details>'
        )
    return "\n".join(items)


def faq_jsonld(c):
    data = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "inLanguage": c["lang"],
        "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in c["faq"]
        ],
    }
    return json.dumps(data, ensure_ascii=False).replace("</", "<\\/")


def render(lang, template, css):
    c = dict(CONTENT[lang])
    composer = c.pop("msg_composer", c["composer"])
    c.pop("composer")
    composer["number"] = WA_NUMBER
    # valori dei chip usati nel messaggio WhatsApp (diversi dalle etichette solo su DE)
    values = c.pop("msg_values", {})
    for key in ("n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "t_morning", "t_noon", "t_afternoon", "t_evening"):
        c[f"v_{key}"] = values.get(key, c[key])
    c.update(
        lang=lang,
        root="" if lang == "it" else "../",
        base=BASE,
        url=BASE if lang == "it" else f"{BASE}{lang}/",
        # gli url() del CSS inline sono relativi alla pagina: vanno corretti per /en/ e /de/
        css=css.replace("url(assets/", "url(" + ("" if lang == "it" else "../") + "assets/"),
        wa=wa_link(c["msg_default"]),
        wa_biz=wa_link(c["msg_biz"]),
        wa_review=wa_link(c["msg_review"]),
        composer_json=json.dumps(composer, ensure_ascii=False).replace("</", "<\\/"),
        **{f"cur_{l}": 'aria-current="page"' if l == lang else "" for l in OUT},
    )

    c["reviews_html"] = reviews_html(c)
    c["faq_html"] = faq_html(c)
    c["faq_jsonld"] = faq_jsonld(c)

    def sub(m):
        key = m.group(1)
        if key not in c:
            raise KeyError(f"[{lang}] chiave mancante: {key}")
        return str(c[key])

    return re.sub(r"\{\{(\w+)\}\}", sub, template)


def main():
    template = (ROOT / "src" / "template.html").read_text(encoding="utf-8")
    # Il CSS viene messo inline (minificato) per evitare una richiesta bloccante
    css = minify_css((ROOT / "styles.css").read_text(encoding="utf-8"))
    for lang, path in OUT.items():
        path.parent.mkdir(exist_ok=True)
        path.write_text(render(lang, template, css), encoding="utf-8")
        print(f"ok  {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
