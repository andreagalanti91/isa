#!/usr/bin/env python3
"""Genera index.html (IT), en/index.html e de/index.html da src/template.html + src/content.py."""
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT / "src"))
from content import BASE, CONTENT, WA_NUMBER  # noqa: E402

OUT = {"it": ROOT / "index.html", "en": ROOT / "en" / "index.html", "de": ROOT / "de" / "index.html"}


def minify_css(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"\s+", " ", css)
    css = re.sub(r"\s*([{};,>])\s*", r"\1", css)
    return css.replace(";}", "}").strip()


def wa_link(text):
    return f"https://wa.me/{WA_NUMBER}?text={quote(text)}"


def render(lang, template, css):
    c = dict(CONTENT[lang])
    composer = c.pop("composer")
    composer["number"] = WA_NUMBER
    c.update(
        lang=lang,
        root="" if lang == "it" else "../",
        base=BASE,
        url=BASE if lang == "it" else f"{BASE}{lang}/",
        # gli url() del CSS inline sono relativi alla pagina: vanno corretti per /en/ e /de/
        css=css.replace("url(assets/", "url(" + ("" if lang == "it" else "../") + "assets/"),
        wa=wa_link(c["msg_default"]),
        wa_biz=wa_link(c["msg_biz"]),
        composer_json=json.dumps(composer, ensure_ascii=False).replace("</", "<\\/"),
        **{f"cur_{l}": 'aria-current="page"' if l == lang else "" for l in OUT},
    )

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
