"""Fail-closed source HTML conversion to the existing native practice blocks."""

from __future__ import annotations

import re
from collections.abc import Callable
from dataclasses import dataclass, field
from html import escape
from html.parser import HTMLParser

from app.modules.practice.kompege_assets import Asset, image_dimensions


@dataclass
class Node:
    tag: str
    attrs: dict[str, str] = field(default_factory=dict)
    children: list[Node | str] = field(default_factory=list)

    def html(self) -> str:
        attrs = "".join(
            f' {key}="{escape(value, quote=True)}"' for key, value in self.attrs.items()
        )
        content = "".join(c.html() if isinstance(c, Node) else escape(c) for c in self.children)
        if self.tag == "root":
            return content
        if self.tag in {"br", "img", "col", "hr"}:
            return f"<{self.tag}{attrs}>"
        return f"<{self.tag}{attrs}>{content}</{self.tag}>"


class TreeParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("root")
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        # An img is a void element. A bare <img /> has neither a declared
        # resource nor payload; KEGE occasionally leaves these editing placeholders.
        if tag == "img" and not attrs:
            return
        if tag in {"script", "style", "iframe", "object", "embed", "svg"}:
            raise ValueError(f"unsupported active source element: {tag}")
        # Browsers implicitly close paragraph/list/table cells at these boundaries.
        if tag in {"p", "li", "td", "th", "tr"} and self.stack[-1].tag == tag:
            self.stack.pop()
        node = Node(tag, {key: value or "" for key, value in attrs})
        self.stack[-1].children.append(node)
        if tag not in {"br", "img", "col", "hr", "wbr"}:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if self.stack[-1].tag == tag:
            self.stack.pop()

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def parse_html(html: str) -> Node:
    parser = TreeParser()
    parser.feed(html)
    parser.close()
    return parser.root


def plain(node: Node | str, *, literal: bool = False) -> str:
    if isinstance(node, str):
        return node.replace("\xa0", " ")
    if node.tag == "br":
        return "\n"
    content = "".join(plain(c, literal=literal) for c in node.children)
    if node.tag in {"sub", "sup"}:
        return ("_" if node.tag == "sub" else "^") + "{" + content.strip() + "}"
    if node.tag in {"p", "div", "li"} and literal:
        return content + "\n"
    return content


def text_content(html: str) -> str:
    return re.sub(r"\s+", " ", plain(parse_html(html))).strip()


INLINE = {"span", "strong", "b", "em", "i", "u", "s", "font", "small", "a", "label"}
FORMULAS = re.compile(r"\\\((.+?)\\\)|\\\[(.+?)\\\]|\$\$(.+?)\$\$|(?<!\\)\$([^$\n]+)\$", re.S)


MATH_SYMBOLS = {
    "neg": "¬",
    "lnot": "¬",
    "lor": "∨",
    "vee": "∨",
    "land": "∧",
    "wedge": "∧",
    "to": "→",
    "rightarrow": "→",
    "equiv": "≡",
    "in": "∈",
    "notin": "∉",
    "neq": "≠",
    "leq": "≤",
    "leqslant": "≤",
    "le": "≤",
    "geq": "≥",
    "geqslant": "≥",
    "ge": "≥",
    "cdot": "·",
    "times": "×",
    "forall": "∀",
}


class _MathReader:
    """A bounded notation translator, deliberately not a TeX execution engine."""

    def __init__(self, text: str):
        if len(text) > 10000:
            raise ValueError("source formula exceeds native text limit")
        self.text = text
        self.offset = 0
        self.depth = 0

    def whitespace(self):
        while self.offset < len(self.text) and self.text[self.offset].isspace():
            self.offset += 1

    def group(self) -> str:
        self.whitespace()
        if self.offset == len(self.text):
            raise ValueError("missing source formula argument")
        if self.text[self.offset] != "{":
            return self.atom()
        self.offset += 1
        value = self.sequence(group=True)
        if not value.strip():
            raise ValueError("empty source formula argument")
        return value

    def atom(self) -> str:
        char = self.text[self.offset]
        self.offset += 1
        if char == "{":
            value = self.sequence(group=True)
            return value if len(value.strip()) == 1 or value.strip().isalnum() else f"({value})"
        if char == "}":
            raise ValueError("unbalanced closing source formula brace")
        if char in "^_":
            value = self.group()
            # The current renderer accepts one brace level. Preserve nested script
            # meaning with explicit parenthesized notation inside the outer script.
            value = re.sub(r"([_^])\{([^{}]*)\}", r"\1(\2)", value)
            if "{" in value or "}" in value:
                raise ValueError("source script needs unsupported nested notation")
            return char + "{" + value + "}"
        if char != "\\":
            return char
        if self.offset == len(self.text):
            raise ValueError("dangling source formula escape")
        match = re.match(r"[A-Za-z]+", self.text[self.offset :])
        if match is None:
            escaped = self.text[self.offset]
            self.offset += 1
            if escaped in "%{}_#$&":
                return escaped
            if escaped in ",;:! ":
                return " "
            raise ValueError(f"unsupported source formula escape: {escaped}")
        command = match[0]
        self.offset += len(command)
        if command in MATH_SYMBOLS:
            return MATH_SYMBOLS[command]
        if command in {"left", "right"}:
            if self.offset < len(self.text) and self.text[self.offset] == ".":
                self.offset += 1
            return ""
        if command in {"text", "textit", "textrm", "mathrm", "mathbf"}:
            return self.group()
        if command == "frac":
            numerator, denominator = self.group(), self.group()
            return f"({numerator})/({denominator})"
        if command == "sqrt":
            self.whitespace()
            if self.offset < len(self.text) and self.text[self.offset] == "[":
                raise ValueError("indexed source root requires explicit conversion")
            return f"√({self.group()})"
        if command == "vec":
            return f"вектор({self.group()})"
        if command == "mathbb":
            letter = self.group()
            values = {"N": "ℕ", "Z": "ℤ", "Q": "ℚ", "R": "ℝ", "C": "ℂ"}
            if letter not in values:
                raise ValueError(f"unsupported source blackboard symbol: {letter}")
            return values[letter]
        raise ValueError(f"unsupported source math command: {command}")

    def sequence(self, *, group: bool = False) -> str:
        self.depth += 1
        if self.depth > 100:
            raise ValueError("source formula nesting exceeds limit")
        values = []
        while self.offset < len(self.text):
            if self.text[self.offset] == "}" and group:
                self.offset += 1
                self.depth -= 1
                return "".join(values)
            values.append(self.atom())
        self.depth -= 1
        if group:
            raise ValueError("unclosed source formula brace")
        return "".join(values)


def readable_math(text: str) -> str:
    return _MathReader(text).sequence().strip()


def inline_spans(node: Node | str) -> list[dict]:
    if isinstance(node, str):
        if re.fullmatch(r"(?:\s|\\n)+", node):
            node = node.replace("\\n", "\n")
        node = re.sub(r"[\t\r\n ]+", " ", node.replace("\xa0", " "))
        spans = []
        start = 0
        for match in FORMULAS.finditer(node):
            if match.start() > start:
                spans.append({"kind": "text", "text": node[start : match.start()]})
            spans.append(
                {"kind": "formula", "text": readable_math(next(g for g in match.groups() if g))}
            )
            start = match.end()
        if start < len(node):
            spans.append({"kind": "text", "text": node[start:]})
        if any(
            span["kind"] == "text" and re.search(r"\\(?:[A-Za-z]|[()\[\]])", span["text"])
            for span in spans
        ):
            raise ValueError("source math command outside balanced formula delimiters")
        return spans
    if node.tag == "br":
        return [{"kind": "text", "text": "\n"}]
    if node.tag == "wbr":
        return []
    if node.tag in {"sub", "sup"}:
        if not "".join(plain(c) for c in node.children).strip():
            return [span for child in node.children for span in inline_spans(child)]
        return [{"kind": "formula", "text": readable_math(plain(node))}]
    if node.tag == "code":
        return [{"kind": "code", "text": plain(node)}]
    if node.tag == "math":
        annotations = [
            n for n in descendants(node, "annotation") if "tex" in n.attrs.get("encoding", "")
        ]
        if len(annotations) != 1:
            raise ValueError("MathML requires one explicit TeX annotation")
        return [{"kind": "formula", "text": readable_math(plain(annotations[0]))}]
    if node.tag in INLINE or node.tag in {"p", "div", "root", "blockquote", "li"}:
        return [span for child in node.children for span in inline_spans(child)]
    raise ValueError(f"unsupported inline source element: {node.tag}")


def descendants(node: Node, tag: str) -> list[Node]:
    found = []
    for child in node.children:
        if isinstance(child, Node):
            if child.tag == tag:
                found.append(child)
            found.extend(descendants(child, tag))
    return found


def multiline_code(node: Node) -> bool:
    return node.tag == "code" and any(char in plain(node, literal=True) for char in "\r\n")


def cell_text(node: Node) -> str:
    if (
        descendants(node, "img")
        or descendants(node, "table")
        or descendants(node, "pre")
        or any(multiline_code(code) for code in descendants(node, "code"))
    ):
        raise ValueError("semantic/code-variant or image table needs explicit manual conversion")
    # Native cells support literal notation, not HTML or TeX rendering. Keep the full
    # expression readable, including grouping for multi-character subscripts/powers.
    text = "".join(span["text"] for span in inline_spans(node))
    return text.strip()


def _without_empty_layout_tables(node: Node) -> Node:
    children: list[Node | str] = []
    for child in node.children:
        if isinstance(child, Node):
            if child.tag == "table" and not plain(child).strip() and not descendants(child, "img"):
                continue
            child = _without_empty_layout_tables(child)
        children.append(child)
    return Node(node.tag, node.attrs.copy(), children)


def table_block(node: Node) -> dict:
    node = _without_empty_layout_tables(node)
    if descendants(node, "table") or descendants(node, "pre"):
        raise ValueError("nested semantic/code-variant table needs explicit manual conversion")
    rows = descendants(node, "tr")
    labels = [
        plain(c).strip().casefold() for row in rows[:2] for c in row.children if isinstance(c, Node)
    ]
    languages = {
        "python",
        "паскаль",
        "pascal",
        "c++",
        "си++",
        "basic",
        "бейсик",
        "алгоритмический язык",
    }
    if len(set(labels) & languages) >= 2:
        raise ValueError("semantic code-variant table needs explicit manual conversion")
    if not rows:
        raise ValueError("source table has no rows")
    grid: dict[tuple[int, int], str] = {}
    for y, row in enumerate(rows):
        x = 0
        cells = [c for c in row.children if isinstance(c, Node) and c.tag in {"td", "th"}]
        for cell in cells:
            while (y, x) in grid:
                x += 1
            width, height = int(cell.attrs.get("colspan", "1")), int(cell.attrs.get("rowspan", "1"))
            if not (1 <= width <= 100 and 1 <= height <= 100 and y + height <= len(rows)):
                raise ValueError("invalid source table span")
            text = cell_text(Node("root", children=cell.children))
            for dy in range(height):
                for dx in range(width):
                    position = (y + dy, x + dx)
                    if position in grid:
                        raise ValueError("overlapping source table spans")
                    grid[position] = text
            x += width
    width = max((x for _, x in grid), default=-1) + 1
    if not width:
        raise ValueError("source table has no cells")
    values = [[grid.get((y, x), "") for x in range(width)] for y in range(len(rows))]
    has_headers = any(isinstance(c, Node) and c.tag == "th" for c in rows[0].children)
    headers = values.pop(0) if has_headers and len(values) > 1 else [""] * width
    return {"type": "table", "data": {"headers": headers, "rows": values}}


class NativeHTML:
    def __init__(self, resolver: Callable[[str, str | None], Asset]):
        self.resolver = resolver
        self.files: list[dict] = []
        self.assets: dict[str, Asset] = {}
        self.usages: dict[tuple[str, str, str], str] = {}

    def media(self, url: str, purpose: str, filename: str | None = None, alt: str = "") -> dict:
        asset = self.resolver(url, filename)
        key = (asset.checksum, asset.filename, purpose)
        usage_id = self.usages.get(key)
        if usage_id is None:
            usage_id = f"kege-{purpose}-{len(self.files) + 1}"
            self.usages[key] = usage_id
            self.assets[asset.checksum] = asset
            self.files.append(
                {
                    "id": usage_id,
                    "checksum": asset.checksum,
                    "purpose": purpose,
                    "filename": asset.filename,
                    "description": alt
                    or ("Иллюстрация к условию КЕГЭ" if purpose == "image" else asset.filename),
                    "attribution": "КЕГЭ (kompege.ru)",
                }
            )
        if purpose == "attachment":
            return {"type": "attachment", "data": {"usage_id": usage_id}}
        width, height = image_dimensions(asset.data, asset.extension)
        return {
            "type": "image",
            "data": {
                "usage_id": usage_id,
                "alt": alt or "Иллюстрация к условию задания КЕГЭ",
                "width": width,
                "height": height,
            },
        }

    def convert(self, html: str) -> list[dict]:
        return self.blocks(parse_html(html).children)

    def blocks(self, children: list[Node | str]) -> list[dict]:
        result: list[dict] = []
        buffer: list[Node | str] = []

        def flush():
            spans = [s for child in buffer for s in inline_spans(child) if s["text"]]
            buffer.clear()
            merged: list[dict] = []
            for span in spans:
                if merged and merged[-1]["kind"] == span["kind"]:
                    merged[-1]["text"] += span["text"]
                else:
                    merged.append(span.copy())
            if merged:
                merged[0]["text"] = merged[0]["text"].lstrip()
                merged[-1]["text"] = merged[-1]["text"].rstrip()
                merged = [s for s in merged if s["text"]]
            if merged:
                result.append({"type": "rich_text", "data": {"spans": merged}})

        for child in children:
            if isinstance(child, str):
                buffer.append(child)
                continue
            tag = child.tag
            if tag in {"p", "div", "blockquote", "root"}:
                flush()
                result.extend(self.blocks(child.children))
            elif tag == "table":
                flush()
                result.append(table_block(child))
            elif tag in {"ol", "ul"}:
                flush()
                items = [c for c in child.children if isinstance(c, Node) and c.tag == "li"]
                if len(items) != len(
                    [c for c in child.children if not isinstance(c, str) or c.strip()]
                ):
                    raise ValueError("unsupported non-item source list content")
                result.append(
                    {
                        "type": "list",
                        "data": {
                            "style": "ordered" if tag == "ol" else "unordered",
                            "items": [
                                cell_text(Node("root", children=item.children)) for item in items
                            ],
                        },
                    }
                )
            elif tag == "pre" or multiline_code(child):
                flush()
                if descendants(child, "img") or descendants(child, "table"):
                    raise ValueError("unsupported media within source code")
                code = plain(child, literal=True).strip("\r\n")
                result.append({"type": "code_example", "data": {"language": "text", "code": code}})
            elif tag == "img":
                flush()
                result.append(
                    self.media(child.attrs.get("src", ""), "image", alt=child.attrs.get("alt", ""))
                )
            elif tag == "a" and "/files/" in child.attrs.get("href", ""):
                flush()
                result.append(self.media(child.attrs["href"], "attachment"))
                label = plain(child).strip()
                if label:
                    result.append(
                        {"type": "rich_text", "data": {"spans": [{"kind": "text", "text": label}]}}
                    )
            elif tag == "hr":
                flush()
            elif descendants(child, "img") or any(
                multiline_code(code) for code in descendants(child, "code")
            ):
                flush()
                result.extend(self.blocks(child.children))
            else:
                buffer.append(child)
        flush()
        return result
