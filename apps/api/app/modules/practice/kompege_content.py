"""Bounded source HTML to existing learning blocks; no HTML reaches the application."""

import re
from dataclasses import dataclass, field
from html.parser import HTMLParser


@dataclass
class Node:
    tag: str
    children: list["Node | str"] = field(default_factory=list)


class SourceHTML(HTMLParser):
    def __init__(self, source: str):
        super().__init__(convert_charrefs=True)
        self.root = Node("root")
        self.stack = [self.root]
        self.feed(source)
        self.close()

    def handle_starttag(self, tag, attrs):
        if tag not in {
            "p",
            "div",
            "br",
            "sub",
            "sup",
            "strong",
            "em",
            "a",
            "pre",
            "span",
            "code",
            "table",
            "colgroup",
            "col",
            "tbody",
            "tr",
            "td",
            "th",
            "b",
            "i",
            "ul",
            "ol",
            "li",
        }:
            raise ValueError(f"unsupported source element: {tag}")
        node = Node(tag)
        self.stack[-1].children.append(node)
        if tag not in {"br", "col"}:
            self.stack.append(node)

    def handle_endtag(self, tag):
        if tag in {"br", "col"}:
            return
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                return
        raise ValueError(f"unmatched source element: {tag}")

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def group(value: str, start: int) -> tuple[str, int]:
    while start < len(value) and value[start].isspace():
        start += 1
    if start >= len(value) or value[start] != "{":
        raise ValueError("expected formula group")
    depth = 1
    for end in range(start + 1, len(value)):
        depth += (value[end] == "{") - (value[end] == "}")
        if depth == 0:
            return value[start + 1 : end], end + 1
    raise ValueError("unclosed formula group")


def formula(value: str) -> str:
    # Fractions need explicit grouping; deleting LaTeX commands would change their meaning.
    pattern = re.compile(r"\\(?:dfrac|tfrac|frac|sqrt|text)\b")
    while match := pattern.search(value):
        first, end = group(value, match.end())
        macro = match.group()
        if macro.endswith("frac"):
            second, end = group(value, end)
            replacement = f"({formula(first)}) / ({formula(second)})"
        elif macro == r"\sqrt":
            replacement = f"√({formula(first)})"
        else:
            replacement = formula(first)
        value = value[: match.start()] + replacement + value[end:]
    value = re.sub(r"\\begin\{(?:cases|matrix)\}", "{ ", value)
    value = re.sub(r"\\end\{(?:cases|matrix)\}", " }", value)
    value = value.replace(r"\\", "; ")
    replacements = {
        "times": "×",
        "cdot": "·",
        "geqslant": "≥",
        "leqslant": "≤",
        "geq": "≥",
        "leq": "≤",
        "neq": "≠",
        "lt": "<",
        "sum": "Σ",
        "limits": "",
        "large": "",
        "left": "",
        "right": "",
        "G": "G",
        "F": "F",
    }

    def command(match: re.Match) -> str:
        name = match[1]
        if name not in replacements:
            raise ValueError(f"unsupported formula command: {name}")
        return replacements[name]

    value = re.sub(r"\\([A-Za-z]+)", command, value)
    value = re.sub(r"\\[,;! ]", " ", value).replace(r"\{", "{").replace(r"\}", "}")
    value = value.replace("&", " ")
    return re.sub(r"\s+", " ", value).strip()


def normalize(value: str) -> str:
    value = value.replace("\xa0", " ").replace("\u200b", "")
    # Both one- and two-backslash delimiters occur in the source corpus.
    value = re.sub(r"\\+\((.*?)\\+\)", lambda m: "`" + formula(m[1]) + "`", value, flags=re.S)
    return value


def text(node: Node | str, *, code: bool = False) -> str:
    if isinstance(node, str):
        return node.replace("\xa0", " ") if code else normalize(node)
    if node.tag == "br":
        return "\n"
    value = "".join(text(child, code=code or node.tag == "pre") for child in node.children)
    if node.tag == "sub":
        return value.translate(str.maketrans("0123456789+-=()", "₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎"))
    if node.tag == "sup":
        return "^(" + value + ")"
    if node.tag in {"p", "div", "li"}:
        return value + "\n"
    return value


def paragraph(value: str) -> dict:
    return {"type": "text", "data": {"markdown": value}}


def blocks(source: str) -> list[dict]:
    root = SourceHTML(source).root
    result: list[dict] = []

    def flush(value: str) -> None:
        for line in value.splitlines():
            line = re.sub(r"[ \t]+", " ", line).strip()
            if line:
                result.append(paragraph(line))

    def visit(node: Node, caption: str | None = None) -> None:
        if node.tag == "pre":
            value = text(node, code=True).strip("\n")
            if value.strip():
                python = bool(re.search(r"(^|\n)\s*(def |from |import |for .+ in |print\()", value))
                result.append(
                    {
                        "type": "code_example",
                        "data": {
                            "language": "python" if python else "text",
                            "code": value,
                            "caption": caption,
                        },
                    }
                )
            return
        # Source tables are parallel language listings, including colspan headings.
        # Linear code blocks preserve every listing and its indentation on narrow screens.
        if node.tag == "table":
            rows = descendants(node, "tr")
            labels: list[str] = []
            for row in rows:
                cells = [
                    child
                    for child in row.children
                    if isinstance(child, Node) and child.tag in {"td", "th"}
                ]
                if all(not descendants(cell, "pre") for cell in cells):
                    labels = [text(cell).strip() for cell in cells]
                else:
                    for index, cell in enumerate(cells):
                        for listing in descendants(cell, "pre"):
                            visit(listing, labels[index] if index < len(labels) else None)
            if not any(descendants(row, "pre") for row in rows):
                values = [
                    [
                        text(cell).strip()
                        for cell in row.children
                        if isinstance(cell, Node) and cell.tag in {"td", "th"}
                    ]
                    for row in rows
                ]
                if not values or any(len(row) != len(values[0]) for row in values):
                    raise ValueError("unsupported source table geometry")
                result.append({"type": "table", "data": {"headers": values[0], "rows": values[1:]}})
            return
        buffer = ""
        for child in node.children:
            if isinstance(child, Node) and child.tag in {
                "p",
                "div",
                "pre",
                "table",
                "ul",
                "ol",
                "li",
            }:
                flush(buffer)
                buffer = ""
                visit(child)
            else:
                buffer += text(child)
        flush(buffer)

    visit(root)
    return result


def descendants(node: Node, tag: str) -> list[Node]:
    result = []
    for child in node.children:
        if isinstance(child, Node):
            if child.tag == tag:
                result.append(child)
            result.extend(descendants(child, tag))
    return result
