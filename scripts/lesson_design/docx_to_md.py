"""Convert an author's Word textbook (and its practice workbook) into Markdown sources.

Usage:
    python3 -I scripts/lesson_design/docx_to_md.py SOURCE.docx OUT.md
    python3 -I scripts/lesson_design/docx_to_md.py SOURCE.xlsx OUT.md

The pipeline addresses a source by line numbers (split_source.py), so an author's
material that arrives as a Word document is first converted into the same Markdown
the other sources use (html_to_md.py does this for an HTML textbook). Only the
standard library is used: a .docx/.xlsx file is a zip of XML parts.

Document: Title → `#`, Heading1 → `##` (a chapter keeps its number), Heading2 →
`###`, the `Formula` style → a fenced ```excel block (neighbouring formula
paragraphs and line breaks inside them stay in one block), tables → Markdown
tables (the first row is the header), the table of contents → a list.

Workbook: every sheet becomes a `##` section with one line per filled cell —
`A2 = 4` for a value, `G2 = =COUNTIF($A2:$F2,A2) → 2` for a formula with its
cached value (formulas are stored in English with `,`); a date-formatted number
also shows the date. The text and formulas are copied verbatim.
"""

import datetime
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
S = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"


def esc_cell(text: str) -> str:
    return text.replace("|", "\\|").replace("\n", " ").strip()


def run_text(p: ET.Element) -> str:
    out = []
    for node in p.iter():
        if node.tag == W + "t":
            out.append(node.text or "")
        elif node.tag == W + "tab":
            out.append("\t")
        elif node.tag == W + "br":
            out.append("\n")
    return "".join(out)


def style(p: ET.Element) -> str:
    node = p.find(f"{W}pPr/{W}pStyle")
    return (node.get(W + "val") or "") if node is not None else ""


def table(tbl: ET.Element) -> list[str]:
    rows = []
    for tr in tbl.iter(W + "tr"):
        cells = [
            esc_cell(" ".join(run_text(p) for p in tc.iter(W + "p"))) for tc in tr.iter(W + "tc")
        ]
        rows.append("| " + " | ".join(cells) + " |")
    width = rows[0].count(" | ") + 1
    return [rows[0], "|" + "---|" * width, *rows[1:]]


class Formula(list):
    """Lines of neighbouring `Formula` paragraphs: one ```excel block."""


def convert_docx(path: Path) -> str:
    body = ET.fromstring(zipfile.ZipFile(path).read("word/document.xml")).find(W + "body")
    assert body is not None, "no document body"
    blocks: list[list[str]] = []
    formula: Formula | None = None
    toc = False
    for el in body:
        if el.tag == W + "tbl":
            formula = None
            blocks.append(table(el))
            continue
        if el.tag != W + "p":
            continue
        text, kind = run_text(el), style(el)
        if kind == "Formula":
            if formula is None:
                formula = Formula()
                blocks.append(formula)
            formula.extend(text.split("\n"))
            continue
        formula = None
        if not text.strip():
            continue
        if kind == "Title":
            blocks.append([f"# {text.strip()}"])
        elif kind == "Heading1":
            toc = text.strip() == "Содержание"
            blocks.append([f"## {text.strip()}"])
        elif kind == "Heading2":
            toc = False
            blocks.append([f"### {text.strip()}"])
        elif toc:
            blocks.append([f"- {text.strip()}"])
        else:
            blocks.append([text.strip()])
    out: list[str] = []
    prev_list = False
    for block in blocks:
        is_list = len(block) == 1 and block[0].startswith("- ")
        if out and not (is_list and prev_list):
            out.append("")
        if isinstance(block, Formula):
            out += ["```excel", *block, "```"]
        else:
            out.extend(block)
        prev_list = is_list
    return "\n".join(out) + "\n"


# workbook ---------------------------------------------------------------
DATE_FORMATS = set(range(14, 23)) | {45, 46, 47}


def col_key(ref: str) -> tuple[int, int]:
    m = re.fullmatch(r"([A-Z]+)(\d+)", ref)
    assert m, ref
    col = 0
    for ch in m.group(1):
        col = col * 26 + ord(ch) - 64
    return int(m.group(2)), col


def convert_xlsx(path: Path) -> str:
    z = zipfile.ZipFile(path)
    names = set(z.namelist())
    strings = []
    if "xl/sharedStrings.xml" in names:
        sst = ET.fromstring(z.read("xl/sharedStrings.xml"))
        strings = ["".join(t.text or "" for t in si.iter(S + "t")) for si in sst]
    styles = ET.fromstring(z.read("xl/styles.xml"))
    custom = {
        int(f.get("numFmtId") or 0): f.get("formatCode", "") for f in styles.iter(S + "numFmt")
    }
    xfs = styles.find(S + "cellXfs")
    date_styles = set()
    for i, xf in enumerate(xfs if xfs is not None else []):
        fid = int(xf.get("numFmtId", "0"))
        code = custom.get(fid, "")
        if fid in DATE_FORMATS or (code and re.search(r"[dy]", code.lower())):
            date_styles.add(i)
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    target = {r.get("Id"): r.get("Target") or "" for r in rels}
    out = [f"# Книга {path.name}", ""]
    for sheet in wb.iter(S + "sheet"):
        part = "xl/" + target[sheet.get(R + "id")].lstrip("/").removeprefix("xl/")
        out += [f"## Лист «{sheet.get('name')}»", ""]
        cells = []
        for c in ET.fromstring(z.read(part)).iter(S + "c"):
            f, v, inline = c.find(S + "f"), c.find(S + "v"), c.find(S + "is")
            if inline is not None:
                value = "".join(t.text or "" for t in inline.iter(S + "t"))
            elif v is not None:
                value = strings[int(v.text or 0)] if c.get("t") == "s" else v.text or ""
            else:
                value = ""
            if c.get("t") == "b":
                value = "TRUE" if value == "1" else "FALSE"
            if int(c.get("s", "0")) in date_styles and re.fullmatch(r"\d+(\.\d+)?", value):
                day = datetime.date(1899, 12, 30) + datetime.timedelta(days=float(value))
                value = f"{value} (дата {day.isoformat()})"
            ref = c.get("r") or ""
            if f is not None:
                cells.append((ref, f"`={f.text or ''}` → {value}"))
            elif value:
                cells.append((ref, value))
        for ref, text in sorted(cells, key=lambda rc: col_key(rc[0])):
            out.append(f"- {ref} = {text}")
        out.append("")
    return "\n".join(out)


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    if src.suffix == ".xlsx":
        text = convert_xlsx(src)
    else:
        text = convert_docx(src)
    dst.write_text(text, encoding="utf-8")
    print(f"{dst}: {text.count(chr(10))} lines")


if __name__ == "__main__":
    main()
