"""Deterministic converter tests: no database or external transport."""

import base64
import hashlib
import json
import struct
from fractions import Fraction

import pytest

from app.modules.practice.kompege import (
    ANSWER_CORRECTIONS,
    SECTIONS,
    answer,
    compatibility,
    convert_task,
    existing_identities,
    game_setup,
    prepare,
)
from app.modules.practice.kompege_assets import AssetResolver, image_dimensions, source_url
from app.modules.practice.kompege_html import NativeHTML

pytestmark = pytest.mark.pure


def row(**values):
    return {
        "taskId": 12345,
        "number": 1,
        "text": "<p>Условие</p>",
        "key": "000123",
        "difficulty": 0,
        "files": [],
        "hide": False,
        "subTask": [],
        **values,
    }


def no_fetch(url):
    raise AssertionError(f"unexpected transport: {url}")


def converter():
    return NativeHTML(AssetResolver(fetch=no_fetch))


def png():
    return b"\x89PNG\r\n\x1a\n" + struct.pack(">I", 13) + b"IHDR" + struct.pack(">II", 32, 16)


def test_answers_are_strings_not_numeric_or_alternatives():
    assert answer("000012345678901234567890\\n003\\n02") == "000012345678901234567890\n003\n02"
    with pytest.raises(ValueError, match="string"):
        answer(123)
    with pytest.raises(ValueError, match="empty"):
        answer("\\n  ")
    task, _ = convert_task(row(key="001 002"), 1, AssetResolver(fetch=no_fetch))
    assert task["task"]["checker"]["answer_variants"] == ["001 002"]


def test_stable_ids_parts_and_no_private_source_fields():
    source = row(user_id="secret", solve_text="solution", video="private")
    a, _ = convert_task(source, 19, AssetResolver(fetch=no_fetch))
    b, _ = convert_task(source, 19, AssetResolver(fetch=no_fetch))
    c, _ = convert_task(
        row(text="<p>Найдите S.</p>"), 20, AssetResolver(fetch=no_fetch), setup="<p>Правила.</p>"
    )
    assert a == b
    assert a["task"]["id"] != c["task"]["id"]
    assert c["task"]["sources"][0]["original_id"] == "12345/20"
    assert c["task"]["sources"][0]["url"] == "https://kompege.ru/task?id=12345"
    assert a["task"]["lessons"] == a["task"]["hint"] == a["task"]["explanation"] == []
    assert "secret" not in json.dumps(a) and "private" not in json.dumps(a)


@pytest.mark.parametrize(("value", "expected"), [(0, 1), (1, 2), (2, 3), (3, 3)])
def test_difficulty_mapping(value, expected):
    task, _ = convert_task(row(difficulty=value), 1, AssetResolver(fetch=no_fetch))
    assert task["task"]["difficulty"] == expected


def test_deduplication_both_banks_and_exam_part():
    def bank(sources, numbers):
        return {"tasks": [{"task": {"sources": sources, "exam_numbers": numbers}}]}

    first = bank([{"title": "КЕГЭ", "original_id": "12345/20"}], [20])
    second = bank([{"url": "https://kompege.ru/task?id=67890"}], [19])
    assert existing_identities(first, second) == {(12345, 20), (67890, 19)}


def test_native_blocks_keep_math_and_code_indentation():
    blocks = converter().convert(
        "<p>Формула \\(x^2 + 1\\), q<sub>12</sub> и x<sup>2</sup>.</p>"
        "<ul><li>a<sub>0</sub></li><li>Второй</li></ul>"
        "<pre>for i in a:<br>    print(i)<br>        x = 1</pre>"
    )
    assert {"kind": "formula", "text": "x^{2} + 1"} in blocks[0]["data"]["spans"]
    assert "_{12}" in str(blocks[0]) and "^{2}" in str(blocks[0])
    assert blocks[1]["data"]["items"] == ["a_{0}", "Второй"]
    assert blocks[2]["data"]["code"] == "for i in a:\n    print(i)\n        x = 1"


def test_tables_expand_spans():
    block = converter().convert(
        '<table><tr><td rowspan="2">q<sub>0</sub></td><td colspan="2">X</td></tr>'
        "<tr><td>a</td><td>b<sup>2</sup></td></tr></table>"
    )[0]
    assert block["data"] == {
        "headers": ["", "", ""],
        "rows": [["q_{0}", "X", "X"], ["q_{0}", "a", "b^{2}"]],
    }


@pytest.mark.parametrize(
    "html",
    [
        "<table><tr><td><table><tr><td>X</td></tr></table></td></tr></table>",
        "<table><tr><td><pre>code</pre></td></tr></table>",
        "<script>alert(1)</script><p>text</p>",
        "<iframe></iframe>",
        "<ul><li>one<ul><li>two</li></ul></li></ul>",
    ],
)
def test_ambiguous_or_active_semantics_fail_closed(html):
    with pytest.raises(ValueError):
        converter().convert(html)


def test_image_keeps_measured_dimensions_and_checksum():
    data = png()
    url = "data:image/png;base64," + base64.b64encode(data).decode()
    content = converter()
    blocks = content.convert(f'<p>До <img src="{url}" width="999" height="999"> после</p>')
    image = next(b for b in blocks if b["type"] == "image")
    assert (image["data"]["width"], image["data"]["height"]) == (32, 16)
    assert content.files[0]["checksum"] == hashlib.sha256(data).hexdigest()
    assert len(blocks) == 3
    assert image_dimensions(b"GIF89a" + struct.pack("<HH", 45, 22), "gif") == (45, 22)


@pytest.mark.parametrize(
    "url",
    [
        "http://kompege.ru/files/a.txt",
        "https://evil.test/files/a.txt",
        "https://kompege.ru/files/../private.txt",
        "https://kompege.ru/files/%2e%2e/a.txt",
        "https://kompege.ru:443/files/a.txt",
        "https://kompege.ru/files/a.txt?x=y",
        "https://kompege.ru@evil.test/files/a.txt",
        "https://127.0.0.1/files/a.txt",
        "https://ucarecdn.com/other/file.png",
    ],
)
def test_asset_urls_are_allowlisted(url):
    with pytest.raises(ValueError):
        source_url(url)


def test_asset_staging_reuses_bytes_and_original_xls_name(tmp_path):
    calls = []

    def fetch(url):
        calls.append(url)
        return b"original spreadsheet"

    first = AssetResolver(fetch=fetch, cache_dir=tmp_path)
    asset = first("/files/random.xls", "Исходная таблица.xls")
    second = AssetResolver(fetch=no_fetch, cache_dir=tmp_path)
    assert second("/files/random.xls", "Исходная таблица.xls") == asset
    assert asset.mime_type == "application/vnd.ms-excel"
    assert calls == ["https://kompege.ru/files/random.xls"]


def test_compatibility_checks_format_not_dates():
    assert compatibility(row(hide=True), 1) == "hidden source entry"
    assert compatibility(row(text="Редактор строк"), 12)
    assert compatibility(row(text="Исполнитель МТ и лента"), 12) is None
    assert compatibility(row(table={"rows": 2, "cols": 2}, key="1 2 3 4"), 27)
    current = row(
        table={"rows": 1, "cols": 2},
        key="001 002",
        text="Кластеры, кинетическая энергия, признак",
        files=[{"name": "27.txt"}],
    )
    assert compatibility(current, 27) is None
    assert compatibility({**current, "text": "Старый формат"}, 27)


def test_games_keep_setup_remove_root_question_and_reference():
    shared = (
        "Два игрока Петя и Ваня играют. Игроки ходят по очереди, первый ход делает Петя. "
        "За ход добавляют камень. Игра завершается при 50 камнях. "
        "В начальный момент в куче S камней. "
    )
    setup = game_setup(f"<p>{shared}Известно, что Ваня выиграл после ошибки Пети. Укажите S.</p>")
    assert "В начальный момент" in setup and "после ошибки" not in setup
    task, _ = convert_task(
        row(text="<p>Для игры, описанной в задании 19, найдите S для второго хода.</p>"),
        20,
        AssetResolver(fetch=no_fetch),
        setup=setup,
    )
    rendered = json.dumps(task, ensure_ascii=False)
    assert "второго хода" in rendered and "50 камнях" in rendered
    assert "описанной в задании 19" not in rendered and "после ошибки" not in rendered
    with pytest.raises(ValueError, match="question boundary"):
        game_setup("<p>Найдите S.</p>")


def test_scoped_missing_answer_reconstruction():
    original = Fraction(512 * 48000 * 24 * 2, 8)
    compressed = Fraction(512 * 32000 * 16, 8) * Fraction(66, 100)
    assert (original - compressed) / 2**20 == 120
    assert ANSWER_CORRECTIONS[(31372, 7)][0] == "120"
    task, _ = convert_task(row(taskId=31372, key=""), 7, AssetResolver(fetch=no_fetch))
    assert task["task"]["checker"]["answer_variants"] == ["120"]
    assert task["task"]["sources"][0]["adaptation"]
    with pytest.raises(ValueError, match="empty"):
        convert_task(row(taskId=31373, key=""), 7, AssetResolver(fetch=no_fetch))


def test_prepare_accounts_every_part_and_preserves_metadata(tmp_path):
    for n in SECTIONS:
        (tmp_path / f"section-{n}.json").write_text("[]")
    source = row(
        number=19,
        subTask=[
            {"number": 20, "text": "<p>Вопрос</p>", "key": "2"},
            {"number": 21, "text": "<p>Вопрос</p>", "key": "3"},
        ],
    )
    (tmp_path / "section-19.json").write_text(json.dumps([source]))
    (tmp_path / "section-1.json").write_text(
        json.dumps([row(taskId=99), row(taskId=100, hide=True)])
    )
    existing = {"tasks": [], "materials": [], "courses": []}
    database = {
        "tasks": [
            {
                "task": {
                    "id": "retained",
                    "exam_numbers": [1],
                    "sources": [{"url": "https://kompege.ru/task?id=99"}],
                }
            }
        ]
    }
    bank, report, _ = prepare(tmp_path, existing, database, AssetResolver(fetch=no_fetch))
    assert len(report["records"]) == 5
    assert report["counts"] == {"existing": 1, "excluded": 1, "included": 1, "error": 2}
    assert len(bank["tasks"]) == 1
    assert bank["materials"] == existing["materials"]


def test_cli_writes_private_delta_and_error_report(tmp_path):
    from app.modules.practice.kompege import TITLES, main

    raw, existing, database, output = [
        tmp_path / name for name in ("raw", "canonical", "before", "out")
    ]
    for directory in (raw, existing, database):
        directory.mkdir()
    for n in SECTIONS:
        (raw / f"section-{n}.json").write_text("[]")
    (raw / "section-1.json").write_text(json.dumps([row(), row(taskId=200, key="")]))
    for directory in (existing, database):
        (directory / "bank.json").write_text(
            json.dumps({"tasks": [], "materials": [], "courses": []})
        )
    assert main(["prepare", str(raw), str(existing), str(database), str(output)]) == 1
    assert output.stat().st_mode & 0o777 == 0o700
    assert (output / "bank.json").stat().st_mode & 0o777 == 0o600
    assert json.loads((output / "report.json").read_text())["counts"] == {"included": 1, "error": 1}
    assert TITLES[16] == "Рекурсия"


def test_source_comment_year_and_no_invented_author():
    task, _ = convert_task(row(comment="Демоверсия 2027"), 1, AssetResolver(fetch=no_fetch))
    source = task["task"]["sources"][0]
    assert source["year"] == 2027 and "Демоверсия 2027" in source["title"]
    assert source["author"] is None


def test_nonempty_code_variant_table_fails_but_empty_layout_table_is_safe():
    with pytest.raises(ValueError, match="code-variant"):
        converter().convert(
            "<table><tr><td>Python</td><td>C++</td></tr>"
            "<tr><td>x = 1</td><td>x = 1;</td></tr></table>"
        )
    result = converter().convert(
        "<table><tr><td>1</td><td><table><colgroup><col></colgroup></table>1; 2</td></tr></table>"
    )
    assert result[0]["data"]["rows"] == [["1", "1; 2"]]


def test_extensionless_explicit_cdn_image_is_measured_from_bytes():
    resolver = AssetResolver(fetch=lambda _: b"GIF89a" + struct.pack("<HH", 20, 10))
    asset = resolver("https://ucarecdn.com/e88f1207-0c22-4a72-90a2-c1ac539e5329/")
    assert asset.extension == "gif"
    assert image_dimensions(asset.data, asset.extension) == (20, 10)


@pytest.mark.parametrize(
    "dependency",
    [
        "Для игры, описанной в предыдущем задании, ",
        "Для игры, описанной в 19 задании, ",
        "Для условия игры из задания 19, ответьте на вопрос. ",
        "В игре, описанной в задании 19, ",
        "Для игры, <strong>описанной в задании 19,</strong> ",
    ],
)
def test_game_dependency_phrases_removed_across_markup(dependency):
    task, _ = convert_task(
        row(text=f"<p>{dependency}Найдите S.</p>"),
        20,
        AssetResolver(fetch=no_fetch),
        setup="<p>Полные правила.</p>",
    )
    text = json.dumps(task["task"]["statement"], ensure_ascii=False)
    assert "задании" not in text and "предыдущем" not in text
    assert "Найдите S" in text and "Полные правила" in text


@pytest.mark.parametrize("data", [b"\xff\xd8\xff\xff\xff\xff", b"\xff\xd8\xff\xc0\x00\x08\x00"])
def test_truncated_jpeg_is_a_reportable_conversion_error(data):
    with pytest.raises(ValueError):
        image_dimensions(data, "jpg")


@pytest.mark.parametrize(
    ("source", "expected"),
    [
        (r"\neg A \lor B \land C \to D \equiv E", "¬ A ∨ B ∧ C → D ≡ E"),
        (r"x \notin A \wedge y \in B \vee x \neq y", "x ∉ A ∧ y ∈ B ∨ x ≠ y"),
        (r"x \leq 5 \cdot y \times 2 \geqslant z", "x ≤ 5 · y × 2 ≥ z"),
        (r"\frac{a+\frac{b}{c}}{d^2}", "(a+(b)/(c))/(d^{2})"),
        (r"\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}", "√((x_{2}-x_{1})^{2}+(y_{2}-y_{1})^{2})"),
        (r"\vec{V} = (V_x; V_y)", "вектор(V) = (V_{x}; V_{y})"),
        (r"\text{ДЕЛ}(n,m) \forall x \in \mathbb{N}", "ДЕЛ(n,m) ∀ x ∈ ℕ"),
        (r"\left\{x^{10}, y_{min}\right\}", "{x^{10}, y_{min}}"),
        (r"\textit{d}(A,B) + n\%10", "d(A,B) + n%10"),
    ],
)
def test_formula_commands_become_readable_native_notation(source, expected):
    from app.modules.practice.kompege_html import readable_math

    assert readable_math(source) == expected


@pytest.mark.parametrize(
    "source", [r"\unknown{x}", r"\frac{1}", r"x^{2", r"\sqrt[3]{x}", r"x^", r"a}"]
)
def test_unknown_or_unbalanced_math_is_reportable(source):
    from app.modules.practice.kompege_html import readable_math

    with pytest.raises(ValueError):
        readable_math(source)


def test_math_in_native_tables_normalizes_but_literal_code_stays_literal():
    source = r"\neg x \lor y^2"
    blocks = converter().convert(
        f"<table><tr><td>\\({source}\\)</td></tr></table><pre>{source}</pre><p><code>{source}</code></p>"
    )
    assert blocks[0]["data"]["rows"] == [["¬ x ∨ y^{2}"]]
    assert blocks[1]["data"]["code"] == source
    assert blocks[2]["data"]["spans"] == [{"kind": "code", "text": source}]


def test_reconstructed_answer_never_enters_public_fields():
    task, _ = convert_task(row(taskId=31372, key=""), 7, AssetResolver(fetch=no_fetch))
    public = {key: value for key, value in task["task"].items() if key != "checker"}
    assert "120" not in json.dumps(public, ensure_ascii=False)
    assert "МиБ" not in json.dumps(public, ensure_ascii=False)
    assert "независимым расчётом" in public["sources"][0]["adaptation"]


def test_empty_source_script_formatting_does_not_create_empty_formula():
    blocks = converter().convert("<p>c<sub>i</sub><sub> </sub> и x<sub><br></sub>после.</p>")
    assert "_{i}" in json.dumps(blocks)
    assert "_{}" not in json.dumps(blocks)


@pytest.mark.parametrize(
    ("source_id", "condition"),
    [
        (471, "Известно, что в начале игры в куче было 15 камней. Найдите N."),
        (502, "Известно, что игра началась из позиции (5, S). Найдите S."),
        (
            1028,
            "Игра начинается в одной из позиций (30, 30), (32, 29). "
            "При игре из каких позиций выигрывает Ваня?",
        ),
    ],
)
def test_subpart_own_initial_position_replaces_inspected_root_condition(source_id, condition):
    rules = (
        "Два игрока Петя и Ваня играют. Первый ход делает Петя. "
        "За ход добавляют камень. Игроки ходят по очереди. Игра завершается при 50 камнях. "
    )
    setup = game_setup(f"<p>{rules}</p><p>{condition}</p>", source_id=source_id)
    assert "Известно" not in setup and "(30, 30)" not in setup
    assert "Найдите" not in setup and "50 камнях" in setup
    task, _ = convert_task(
        row(text="<p>Игра начинается с 4 камней. Найдите S.</p>"),
        20,
        AssetResolver(fetch=no_fetch),
        setup=setup,
    )
    text = json.dumps(task["task"]["statement"], ensure_ascii=False)
    assert "4 камней" in text and "15 камней" not in text and "(5, S)" not in text


def test_numeric_game_without_initial_marker_keeps_rules_only():
    rules = (
        "Два игрока Петя и Ваня играют. Первый ход делает Петя. "
        "За ход добавляют камень. Игроки ходят по очереди. Игра завершается при 50 камнях. "
        "Победителем считается игрок, сделавший последний ход. "
    )
    setup = game_setup(f"<p>{rules}Укажите минимальное S.</p>")
    assert "Укажите" not in setup and "50 камнях" in setup


def test_explicit_legacy_family_excludes_root_and_both_parts(tmp_path):
    for n in SECTIONS:
        (tmp_path / f"section-{n}.json").write_text("[]")
    source = row(
        taskId=833,
        number=19,
        text="<p>Две карточки с числами.</p>",
        subTask=[
            {"number": 20, "text": "<p>Вопрос</p>", "key": "2"},
            {"number": 21, "text": "<p>Вопрос</p>", "key": "3"},
        ],
    )
    (tmp_path / "section-19.json").write_text(json.dumps([source]))
    empty = {"tasks": [], "materials": [], "courses": []}
    bank, report, _ = prepare(tmp_path, empty, empty, AssetResolver(fetch=no_fetch))
    assert not bank["tasks"] and report["counts"] == {"excluded": 3}
    assert all("family" in record["reason"] for record in report["records"])
    reason = compatibility(row(key="Петя 4"), 20)
    assert reason is not None and reason.startswith("legacy nonnumeric")


@pytest.mark.parametrize(
    "dependency", ["Для игры в задании 19, ", "Для игры из предыдущего задания "]
)
def test_remaining_observed_game_reference_forms(dependency):
    task, _ = convert_task(
        row(text=f"<p>{dependency}Найдите S.</p>"),
        20,
        AssetResolver(fetch=no_fetch),
        setup="<p>Правила.</p>",
    )
    assert "задани" not in json.dumps(task["task"]["statement"], ensure_ascii=False)


@pytest.mark.parametrize("source", [r"<p>\unknown{x}</p>", r"<p>\(x+1</p>", r"<p>x\)</p>"])
def test_math_outside_balanced_delimiters_fails_closed(source):
    with pytest.raises(ValueError, match="balanced formula delimiters"):
        converter().convert(source)


def test_nested_scripts_keep_parenthesized_inner_meaning_for_single_level_renderer():
    from app.modules.practice.kompege_html import readable_math

    assert readable_math(r"x^{a_1+2}") == "x^{a_(1)+2}"


def test_source_9987_multiline_russian_algorithms_preserve_lines_and_indentation():
    html = (
        "<div><p>Запись</p><p><code><strong>Повтори k раз<br />"
        "&nbsp; Команды<br /></strong><strong>конец</strong></code></p>"
        "<p>Чертёжнику дан алгоритм:</p><p><code><strong>Повтори 3 раз<br /></strong>"
        "<strong>&nbsp; Сместиться на (15, 37)<br /></strong>"
        "<strong>&nbsp; Сместиться на (-40, -35)<br /></strong>"
        "<strong>&nbsp; Сместиться на (-22, 32)<br /></strong>"
        "<strong>&nbsp; Сместиться на (47, -34)<br /></strong>"
        "<strong>конец</strong></code></p><p>Определите результат.</p></div>"
    )
    blocks = converter().convert(html)
    algorithms = [b for b in blocks if b["type"] == "code_example"]
    assert len(algorithms) == 2
    assert algorithms[0]["data"] == {
        "language": "text",
        "code": "Повтори k раз\n  Команды\nконец",
    }
    assert algorithms[1]["data"]["code"] == (
        "Повтори 3 раз\n  Сместиться на (15, 37)\n  Сместиться на (-40, -35)"
        "\n  Сместиться на (-22, 32)\n  Сместиться на (47, -34)\nконец"
    )
    assert [b["type"] for b in blocks] == [
        "rich_text",
        "code_example",
        "rich_text",
        "code_example",
        "rich_text",
    ]


def test_multiline_code_inside_formatting_wrappers_becomes_a_block_but_inline_stays_inline():
    blocks = converter().convert(
        "<p>До <strong><span><code>Повтори 2<br>  Вперёд 10<br>конец</code></span></strong>"
        " после <code>x // 2</code>.</p>"
    )
    assert [b["type"] for b in blocks] == ["rich_text", "code_example", "rich_text"]
    assert blocks[1]["data"]["code"] == "Повтори 2\n  Вперёд 10\nконец"
    assert {"kind": "code", "text": "x // 2"} in blocks[2]["data"]["spans"]


def test_multiline_code_literal_newlines_and_tabs_are_preserved():
    blocks = converter().convert("<p><em><code>начало\n\tкоманда\nконец</code></em></p>")
    assert blocks == [
        {"type": "code_example", "data": {"language": "text", "code": "начало\n\tкоманда\nконец"}}
    ]


@pytest.mark.parametrize(
    "advertised_bytes", [31_944_094, 50_084_031, 64 * 1024 * 1024, 64 * 1024 * 1024 + 1]
)
def test_source_download_64_mib_header_boundary_without_large_allocation(
    monkeypatch, advertised_bytes
):
    from types import SimpleNamespace

    from app.modules.practice import kompege_assets

    assert kompege_assets.MAX_BYTES == 64 * 1024 * 1024
    read_sizes = []

    class Response:
        headers = {"Content-Length": str(advertised_bytes)}

        def __enter__(self):
            return self

        def __exit__(self, *_):
            return False

        def geturl(self):
            return "https://kompege.ru/files/17.txt"

        def read(self, limit):
            read_sizes.append(limit)
            return b"small fake transport body"

    monkeypatch.setattr(
        kompege_assets, "build_opener", lambda *_: SimpleNamespace(open=lambda *a, **k: Response())
    )
    if advertised_bytes > kompege_assets.MAX_BYTES:
        with pytest.raises(ValueError, match="exceeds 64 MiB"):
            kompege_assets.fetch_asset("/files/17.txt")
        assert not read_sizes
    else:
        assert kompege_assets.fetch_asset("/files/17.txt") == b"small fake transport body"
        assert read_sizes == [kompege_assets.MAX_BYTES + 1]


@pytest.mark.parametrize(("size", "accepted"), [(8, True), (9, False)])
def test_source_resolver_actual_body_boundary_stays_bounded(monkeypatch, size, accepted):
    from app.modules.practice import kompege_assets

    # Scale only the test limit, so the actual byte-boundary check needs no 64 MiB fixture.
    monkeypatch.setattr(kompege_assets, "MAX_BYTES", 8)
    resolver = AssetResolver(fetch=lambda _: b"x" * size)
    if accepted:
        assert resolver("/files/17.txt").data == b"x" * 8
    else:
        with pytest.raises(ValueError, match="oversized source asset"):
            resolver("/files/17.txt")


def test_source_10704_bare_image_placeholders_preserve_truth_tables_and_questions():
    html = (
        "<p>Функция \\(F = (x \\lor \\neg y) \\land w\\).</p>"
        "<table><tr><td></td><td></td><td>F</td></tr>"
        "<tr><td>0</td><td>1</td><td>1</td></tr></table>"
        "<p><img />Определите порядок переменных \\(w, x, y, z\\).</p>"
        "<p>Пример. Функция \\(F = \\neg x \\lor y\\).</p>"
        "<table><tr><td></td><td></td><td>F</td></tr>"
        "<tr><td>0</td><td>1</td><td>0</td></tr></table>"
        "<p><img />В ответе следует написать: \\(yx\\).</p>"
    )
    native = converter()
    blocks = native.convert(html)
    assert [b["type"] for b in blocks] == [
        "rich_text",
        "table",
        "rich_text",
        "rich_text",
        "table",
        "rich_text",
    ]
    assert blocks[1]["data"]["rows"] == [["", "", "F"], ["0", "1", "1"]]
    assert blocks[4]["data"]["rows"] == [["", "", "F"], ["0", "1", "0"]]
    assert blocks[-1]["data"]["spans"][-2] == {"kind": "formula", "text": "yx"}
    assert not native.files
    assert blocks == converter().convert(html.replace("<img />", ""))


@pytest.mark.parametrize(
    "html",
    [
        '<p><img src="" />Вопрос</p>',
        "<p><img src />Вопрос</p>",
        '<p><img alt="" />Вопрос</p>',
        '<p><img src="javascript:alert(1)" />Вопрос</p>',
        '<p><img src="data:image/png;base64,INVALID" />Вопрос</p>',
    ],
)
def test_image_with_any_declared_attributes_is_not_silently_removed(html):
    with pytest.raises(ValueError):
        converter().convert(html)
