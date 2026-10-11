"""Convert an author's HTML textbook into a Markdown source lesson.

Usage:
    python3 -I scripts/lesson_design/html_to_md.py SOURCE.html OUT.md

The pipeline addresses a source by line numbers (split_source.py), so an
author's material that arrives as a standalone HTML page is first converted
into the same Markdown the other sources use. Only the <article> is kept:
navigation, toolbar, styles and scripts are dropped. Headings become `#`/`##`/
`###` (a chapter keeps its number), code blocks become fenced blocks with
their language, tables become Markdown tables, «Разбор» disclosures become
<details markdown="1">. The text and code are copied verbatim.
"""

import html.parser
import re
import sys
from pathlib import Path

SKIP = {"script", "style", "button", "nav", "aside", "input", "label"}


def esc_cell(text):
    return text.replace("|", "\\|").replace("\n", " ").strip()


def code_span(text):
    fence = "``" if "`" in text else "`"
    pad = " " if fence == "``" else ""
    return f"{fence}{pad}{text}{pad}{fence}"


class Converter(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out: list[str] = []  # finished Markdown blocks
        self.inline: list[str] = []  # text of the current block
        self.in_article = False
        self.skip = 0
        self.pre: tuple[list[str], list[str]] | None = None  # language, text
        self.code: list[str] | None = None  # inline <code> text
        self.link = ""
        self.lists: list[list] = []  # stack of [kind, counter]
        self.table: list[list[str]] = []  # rows of cells
        self.row: list[str] = []
        self.cell: list[str] | None = None
        self.aligns: list[bool] = []
        self.heading = ""
        self.summary: list[str] | None = None
        self.chapter = False

    # helpers -----------------------------------------------------------
    def text_target(self):
        if self.cell is not None:
            return self.cell
        if self.summary is not None:
            return self.summary
        return self.inline

    def flush(self, prefix=""):
        text = "".join(self.inline).strip()
        self.inline = []
        if text:
            text = re.sub(r"[ \t]+\n", "\n", text)
            self.out.append(prefix + text)

    # parser callbacks --------------------------------------------------
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "article":
            self.in_article = True
            return
        if not self.in_article:
            return
        if tag in SKIP or "hidden" in a or a.get("class") == "code-header":
            self.skip += 1
            return
        if self.skip:
            return
        if tag == "pre":
            self.flush()
            self.pre = ([""], [])
        elif tag == "code":
            if self.pre is not None:
                lang = (a.get("class") or "").removeprefix("language-")
                self.pre[0][0] = lang
            else:
                self.code = []
        elif tag in ("h1", "h2", "h3"):
            self.flush()
            self.heading = "#" * int(tag[1])
        elif tag == "span" and a.get("class") == "chapter-number":
            self.chapter = True
        elif tag == "p":
            self.flush()
        elif tag == "br":
            self.text_target().append("\n")
        elif tag == "strong":
            self.text_target().append("**")
        elif tag == "em":
            self.text_target().append("*")
        elif tag == "a":
            self.link = a.get("href", "")
            self.text_target().append("[")
        elif tag in ("ol", "ul"):
            self.flush()
            self.lists.append([tag, 0])
        elif tag == "li":
            self.flush()
            self.lists[-1][1] += 1
        elif tag == "table":
            self.flush()
            self.table, self.aligns = [], []
        elif tag == "tr":
            self.row = []
        elif tag in ("td", "th"):
            self.cell = []
            if tag == "th":
                self.aligns.append(a.get("align") == "right")
        elif tag == "details":
            self.flush()
            self.out.append('<details markdown="1">')
        elif tag == "summary":
            self.summary = []

    def handle_endtag(self, tag):
        if tag == "article":
            self.flush()
            self.in_article = False
            return
        if not self.in_article:
            return
        if self.skip:
            if tag in SKIP or tag in ("p", "div"):
                self.skip -= 1
            return
        if tag == "pre":
            assert self.pre is not None
            (lang,), parts = self.pre
            body = "".join(parts).rstrip("\n")
            self.out.append(f"```{lang}\n{body}\n```")
            self.pre = None
        elif tag == "code" and self.pre is None and self.code is not None:
            self.text_target().append(code_span("".join(self.code)))
            self.code = None
        elif tag in ("h1", "h2", "h3"):
            self.flush(self.heading + " ")
        elif tag == "p":
            self.flush()
        elif tag == "strong":
            self.text_target().append("**")
        elif tag == "em":
            self.text_target().append("*")
        elif tag == "a":
            self.text_target().append(f"]({self.link})")
        elif tag == "li":
            kind, n = self.lists[-1]
            depth = "   " * (len(self.lists) - 1)
            mark = f"{n}. " if kind == "ol" else "- "
            self.flush(depth + mark)
        elif tag in ("ol", "ul"):
            self.flush()
            self.lists.pop()
            # consecutive items form one list block
            items = []
            while self.out and re.match(r"\s*(\d+\.|-) ", self.out[-1]):
                items.append(self.out.pop())
            self.out.append("\n".join(reversed(items)))
        elif tag in ("td", "th") and self.cell is not None:
            self.row.append(esc_cell("".join(self.cell)))
            self.cell = None
        elif tag == "tr":
            self.table.append(self.row)
        elif tag == "table":
            head, *rows = self.table
            aligns = self.aligns or [False] * len(head)
            lines = ["| " + " | ".join(head) + " |"]
            lines.append("| " + " | ".join("---:" if r else "---" for r in aligns) + " |")
            lines += ["| " + " | ".join(r) + " |" for r in rows]
            self.out.append("\n".join(lines))
        elif tag == "summary" and self.summary is not None:
            text = "".join(self.summary).strip()
            self.out.append(f"<summary>{text}</summary>")
            self.summary = None
        elif tag == "details":
            self.flush()
            self.out.append("</details>")

    def handle_data(self, data):
        if not self.in_article or self.skip:
            return
        if self.pre is not None:
            self.pre[1].append(data)
            return
        if self.code is not None:
            self.code.append(data)
            return
        if self.chapter:
            self.chapter = False
            self.text_target().append(data.strip())
            return
        if self.cell is None and self.summary is None:
            data = re.sub(r"\s+", " ", data)
        self.text_target().append(data)


def convert(source: str) -> str:
    conv = Converter()
    conv.feed(source)
    conv.close()
    return "\n\n".join(conv.out) + "\n"


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: html_to_md.py SOURCE.html OUT.md")
    text = Path(sys.argv[1]).read_text(encoding="utf-8")
    Path(sys.argv[2]).write_text(convert(text), encoding="utf-8")


if __name__ == "__main__":
    main()
