"""Reference spreadsheet evaluator of the Excel course (scripts/lesson_design/sheet_eval.py).

Run: python3 -m unittest scripts.tests.sheet_eval_test

Cases are the statements of the course source (docs/artifacts/lessons/excel_course.md):
each claim about a function's behaviour is pinned here.
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lesson_design"))

from sheet_eval import (  # noqa: E402
    Book,
    FormulaError,
    display,
    evaluate,
    parse,
    references,
    shift,
    to_english,
)


def show(formula: str, cells: dict[str, str] | None = None) -> str:
    return display(evaluate(formula, cells))


class Arithmetic(unittest.TestCase):
    def test_precedence_and_brackets(self):
        self.assertEqual(show("=2+3*4"), "14")
        self.assertEqual(show("=(2+3)*4"), "20")
        cells = {"A2": "12", "B2": "5"}
        self.assertEqual(show("=A2+B2*2", cells), "22")
        self.assertEqual(show("=(A2+B2)*2", cells), "34")

    def test_unary_minus_binds_before_power(self):
        self.assertEqual(show("=-2^2"), "4")
        self.assertEqual(show("=-(2^2)"), "-4")

    def test_percent_and_decimal_comma(self):
        self.assertEqual(show("=10%"), "0,1")
        self.assertEqual(show("=7/2"), "3,5")
        self.assertEqual(show("=200*(1-0,1)"), "180")

    def test_division_by_zero(self):
        self.assertEqual(show("=A1/B1", {"A1": "5"}), "#ДЕЛ/0!")

    def test_text_in_arithmetic(self):
        self.assertEqual(show("=A1+1", {"A1": "120 руб."}), "#ЗНАЧ!")
        self.assertEqual(show("=A1+1", {"A1": "'5"}), "6")

    def test_juxtaposition_is_not_multiplication(self):
        with self.assertRaises(FormulaError):
            parse("=2A2")


class Counting(unittest.TestCase):
    MIXED = {"A2": "10", "A3": "20", "A4": "нет"}

    def test_sum_count_counta(self):
        self.assertEqual(show("=СУММ(A2:A5)", self.MIXED), "30")
        self.assertEqual(show("=СЧЁТ(A2:A5)", self.MIXED), "2")
        self.assertEqual(show("=СЧЁТЗ(A2:A5)", self.MIXED), "3")
        zero = {**self.MIXED, "A5": "0"}
        self.assertEqual(show("=СУММ(A2:A5)", zero), "30")
        self.assertEqual(show("=СЧЁТ(A2:A5)", zero), "3")

    def test_average_ignores_blank_counts_zero(self):
        self.assertEqual(show("=СРЗНАЧ(A1:A3)", {"A1": "10", "A2": "20", "A3": "0"}), "10")
        self.assertEqual(show("=СРЗНАЧ(A1:A3)", {"A1": "10", "A2": "20"}), "15")
        self.assertEqual(show("=СРЗНАЧ(A1:A3)", {"A1": "текст"}), "#ДЕЛ/0!")

    def test_exercise_5(self):
        cells = {"A1": "7", "A2": "0", "A4": "нет"}
        got = [show(f"={f}(A1:A4)", cells) for f in ("СУММ", "СЧЁТ", "СЧЁТЗ", "СРЗНАЧ")]
        self.assertEqual(got, ["7", "2", "3", "3,5"])

    def test_empty_text_result(self):
        book = Book()
        sheet = book.sheet("Л")
        sheet.set("A1", '=""')
        sheet.set("A2", "5")
        sheet.set("B1", "=СЧИТАТЬПУСТОТЫ(A1:A3)")
        sheet.set("B2", "=СЧЁТЗ(A1:A3)")
        self.assertEqual(display(book.value("Л", "B1")), "2")
        self.assertEqual(display(book.value("Л", "B2")), "2")

    def test_large_counts_repeats(self):
        cells = {"A2": "3", "B2": "8", "C2": "8", "D2": "2"}
        self.assertEqual(show("=НАИБОЛЬШИЙ(A2:D2;2)", cells), "8")
        self.assertEqual(show("=НАИМЕНЬШИЙ(A2:D2;1)", cells), "2")
        self.assertEqual(show("=НАИБОЛЬШИЙ(A2:D2;5)", cells), "#ЧИСЛО!")

    def test_sum_of_logicals_in_range(self):
        cells = {"G2": "ИСТИНА", "G3": "ИСТИНА", "G4": "ЛОЖЬ"}
        self.assertEqual(show("=СУММ(G2:G4)", cells), "0")
        self.assertEqual(show("=СЧЁТЕСЛИ(G2:G4;ИСТИНА)", cells), "2")


class Logic(unittest.TestCase):
    def test_comparison_returns_logical(self):
        self.assertEqual(show("=A2=5", {"A2": "5"}), "ИСТИНА")
        self.assertEqual(show("=A2<>5", {"A2": "5"}), "ЛОЖЬ")

    def test_and_or_xor(self):
        self.assertEqual(show("=И(A2>=10;A2<=20)", {"A2": "10"}), "ИСТИНА")
        self.assertEqual(show("=ИЛИ(A2<10;A2>20)", {"A2": "15"}), "ЛОЖЬ")
        for g, h, want in (("ИСТИНА", "ИСТИНА", "ЛОЖЬ"), ("ИСТИНА", "ЛОЖЬ", "ИСТИНА")):
            cells = {"G2": g, "H2": h}
            self.assertEqual(show("=G2<>H2", cells), want)
            self.assertEqual(show("=И(ИЛИ(G2;H2);НЕ(И(G2;H2)))", cells), want)

    def test_chained_comparison_is_not_interval(self):
        # 10<=A2<=20 compares a logical with 20: logical > number
        self.assertEqual(show("=10<=A2<=20", {"A2": "30"}), "ЛОЖЬ")

    def test_if_text_and_flag(self):
        self.assertEqual(show('=ЕСЛИ(A2>=60;"зачёт";"незачёт")', {"A2": "59"}), "незачёт")
        self.assertEqual(show("=ЕСЛИ(И(A2>=40;A2<=70);1;0)", {"A2": "70"}), "1")
        self.assertEqual(show("=ЕСЛИ(И(A2>=40;A2<=70);1;0)", {"A2": "71"}), "0")

    def test_if_evaluates_only_its_branch(self):
        self.assertEqual(show('=ЕСЛИ(B2=0;"нет данных";A2/B2)', {"A2": "5"}), "нет данных")

    def test_and_is_not_short_circuit(self):
        self.assertEqual(show("=И(B2<>0;A2/B2>1)", {"A2": "5"}), "#ДЕЛ/0!")

    def test_iferror(self):
        self.assertEqual(show("=ЕСЛИОШИБКА(1/0;0)"), "0")


class Criteria(unittest.TestCase):
    COLUMN = {"A2": "5", "A3": "7", "A4": "10", "A5": "Москва", "A6": "москва", "A7": "Казань"}

    def test_number_text_and_operator(self):
        self.assertEqual(show("=СЧЁТЕСЛИ(A2:A7;5)", self.COLUMN), "1")
        self.assertEqual(show('=СЧЁТЕСЛИ(A2:A7;">5")', self.COLUMN), "2")
        self.assertEqual(show('=СЧЁТЕСЛИ(A2:A7;"Москва")', self.COLUMN), "2")

    def test_reference_inside_text_is_not_replaced(self):
        cells = {**self.COLUMN, "D2": "6"}
        self.assertEqual(show('=СЧЁТЕСЛИ(A2:A7;">"&D2)', cells), "2")
        self.assertEqual(show('=СЧЁТЕСЛИ(A2:A4;">D2")', cells), "0")
        self.assertEqual(show("=СЧЁТЕСЛИ(A2:A7;D2)", {**cells, "D2": "7"}), "1")

    def test_wildcards(self):
        cells = {"A1": "Казань", "A2": "Курск", "A3": "Омск", "A4": "127", "A5": "a*b"}
        self.assertEqual(show('=СЧЁТЕСЛИ(A1:A5;"К*")', cells), "2")
        self.assertEqual(show('=СЧЁТЕСЛИ(A1:A5;"*ск")', cells), "2")
        self.assertEqual(show('=СЧЁТЕСЛИ(A1:A5;"a~*b")', cells), "1")

    def test_countifs_and_sumifs(self):
        cells = {
            "A2": "Книги",
            "B2": "Москва",
            "D2": "100",
            "A3": "Книги",
            "B3": "Казань",
            "D3": "200",
            "A4": "Еда",
            "B4": "Москва",
            "D4": "50",
        }
        self.assertEqual(show('=СУММЕСЛИ(A2:A4;"Книги";D2:D4)', cells), "300")
        self.assertEqual(show('=СЧЁТЕСЛИ(A2:A4;"Книги")', cells), "2")
        self.assertEqual(show('=СУММЕСЛИМН(D2:D4;A2:A4;"Книги";B2:B4;"Москва")', cells), "100")
        self.assertEqual(show('=СЧЁТЕСЛИМН(D2:D4;">=10";D2:D4;"<=100")', cells), "2")
        self.assertEqual(show('=СРЗНАЧЕСЛИ(A2:A4;"Нет";D2:D4)', cells), "#ДЕЛ/0!")
        self.assertEqual(show('=СУММЕСЛИМН(D2:D4;A2:A3;"Книги")', cells), "#ЗНАЧ!")

    def test_frequencies_of_a_row(self):
        book = Book()
        sheet = book.sheet("Повторы")
        for col, v in zip("ABCDEF", (4, 4, 1, 2, 3, 5), strict=True):
            sheet.set(f"{col}2", str(v))
        formula = "=СЧЁТЕСЛИ($A2:$F2;A2)"
        for k, col in enumerate("GHIJKL"):
            sheet.set(f"{col}2", shift(formula, 0, k))
        sheet.set("M2", "=И(СЧЁТЕСЛИ(G2:L2;2)=2;СЧЁТЕСЛИ(G2:L2;1)=4)")
        sheet.set("N2", '=СУММЕСЛИ(G2:L2;">1";A2:F2)')
        sheet.set("O2", "=СУММЕСЛИ(G2:L2;1;A2:F2)")
        freqs = [display(book.value("Повторы", f"{c}2")) for c in "GHIJKL"]
        self.assertEqual(freqs, ["2", "2", "1", "1", "1", "1"])
        self.assertEqual(display(book.value("Повторы", "M2")), "ИСТИНА")
        self.assertEqual(display(book.value("Повторы", "N2")), "8")
        self.assertEqual(display(book.value("Повторы", "O2")), "11")


class Numbers(unittest.TestCase):
    def test_rounding(self):
        self.assertEqual(show("=ОКРУГЛ(126;-1)"), "130")
        self.assertEqual(show("=ОКРУГЛ(2,5;0)"), "3")
        self.assertEqual(show("=ОКРУГЛ(-2,5;0)"), "-3")
        self.assertEqual(show("=ОКРУГЛ(1,005;2)"), "1,01")
        self.assertEqual(show("=ОКРУГЛВВЕРХ(-2,3;0)"), "-3")
        self.assertEqual(show("=ОКРУГЛВНИЗ(-2,3;0)"), "-2")
        self.assertEqual(show("=ОКРУГЛВВЕРХ(37/8;0)"), "5")
        self.assertEqual(show("=ЦЕЛОЕ(-2,3)"), "-3")
        self.assertEqual(show("=ОТБР(-2,3)"), "-2")
        self.assertEqual(show("=ЦЕЛОЕ((19+8-1)/8)"), "3")

    def test_mod(self):
        self.assertEqual(show("=ОСТАТ(17;5)"), "2")
        self.assertEqual(show("=ОСТАТ(-7;3)"), "2")
        self.assertEqual(show("=ОСТАТ(ABS(A2);10)=7", {"A2": "-127"}), "ИСТИНА")
        self.assertEqual(show("=ОСТАТ(5;0)"), "#ДЕЛ/0!")

    def test_percent_change(self):
        self.assertEqual(show("=800*1,15*0,85"), "782")
        self.assertEqual(show("=(100-80)/80"), "0,25")

    def test_float_display(self):
        self.assertEqual(show("=1/3"), "0,333333333333333")
        self.assertEqual(show("=0,1+0,2"), "0,3")


class Text(unittest.TestCase):
    def test_text_functions(self):
        cells = {"A2": "ABCDE"}
        self.assertEqual(show("=ДЛСТР(A2)", cells), "5")
        self.assertEqual(show("=ЛЕВСИМВ(A2;3)", cells), "ABC")
        self.assertEqual(show("=ПРАВСИМВ(A2;2)", cells), "DE")
        self.assertEqual(show("=ПСТР(A2;2;3)", cells), "BCD")
        self.assertEqual(show('=СЖПРОБЕЛЫ("  a   b ")'), "a b")
        self.assertEqual(show('=ПОДСТАВИТЬ("12-34-5";"-";"")'), "12345")
        self.assertEqual(show('=СОВПАД("Да";"да")'), "ЛОЖЬ")
        self.assertEqual(show('="Да"="да"'), "ИСТИНА")
        self.assertEqual(show('=A1&" "&B1', {"A1": "Иван", "B1": "Петров"}), "Иван Петров")

    def test_types(self):
        self.assertEqual(show("=ЕЧИСЛО(A1)", {"A1": "120"}), "ИСТИНА")
        self.assertEqual(show("=ЕТЕКСТ(A1)", {"A1": "'00127"}), "ИСТИНА")
        self.assertEqual(show("=ЗНАЧЕН(A1)+1", {"A1": "'12,5"}), "13,5")
        self.assertEqual(show("=ПРАВСИМВ(A1;2)", {"A1": "1234"}), "34")
        self.assertEqual(show("=ЕЧИСЛО(ПРАВСИМВ(A1;2))", {"A1": "1234"}), "ЛОЖЬ")

    def test_dates(self):
        self.assertEqual(show("=ДАТА(2026;10;1)"), "46296")
        self.assertEqual(show("=ДАТА(2026;13;1)-ДАТА(2027;1;1)"), "0")
        self.assertEqual(show("=ДЕНЬ(A1)", {"A1": "05.10.2026"}), "5")
        self.assertEqual(show("=МЕСЯЦ(A1)", {"A1": "05.10.2026"}), "10")
        self.assertEqual(show("=A1<ДАТА(2026;10;16)", {"A1": "15.10.2026"}), "ИСТИНА")


class Lookup(unittest.TestCase):
    def book(self) -> Book:
        book = Book()
        goods = book.sheet("Товары")
        rows = [
            ("101", "Чай", "Напитки", "100"),
            ("102", "Кофе", "Напитки", "250"),
            ("103", "Печенье", "Выпечка", "200"),
            ("104", "Какао", "Напитки", "150"),
        ]
        for r, row in enumerate(rows, start=2):
            for col, v in zip("ABCD", row, strict=True):
                goods.set(f"{col}{r}", v)
        return book

    def test_vlookup_exact(self):
        book = self.book()
        ops = book.sheet("Операции")
        ops.set("B2", "102")
        ops.set("C2", "=ВПР(B2;Товары!$A$2:$D$5;4;0)")
        ops.set("D2", "=ВПР(B2;Товары!$A$2:$D$5;5;0)")
        ops.set("E2", "=ВПР(999;Товары!$A$2:$D$5;2;0)")
        ops.set("F2", "=ИНДЕКС(Товары!$C$2:$C$5;ПОИСКПОЗ(B2;Товары!$A$2:$A$5;0))")
        ops.set("G2", "=ПОИСКПОЗ(103;Товары!$A$2:$A$5;0)")
        got = [display(book.value("Операции", f"{c}2")) for c in "CDEFG"]
        self.assertEqual(got, ["250", "#ССЫЛКА!", "#Н/Д", "Напитки", "3"])

    def test_quoted_sheet_name(self):
        book = Book()
        book.sheet("Каталог товаров").set("A1", "7")
        book.sheet("Итоги").set("A1", "='Каталог товаров'!A1*2")
        self.assertEqual(display(book.value("Итоги", "A1")), "14")

    def test_unknown_sheet_and_function(self):
        self.assertEqual(show("=Нет!A1"), "#ССЫЛКА!")
        self.assertEqual(show("=СУММА(A1:A2)"), "#ИМЯ?")


class Visibility(unittest.TestCase):
    def test_subtotal_modes(self):
        book = Book()
        sheet = book.sheet("Л")
        for r, v in zip(range(2, 6), (10, 20, 30, 40), strict=True):
            sheet.set(f"D{r}", str(v))
        sheet.filtered.add(3)
        sheet.hidden.add(4)
        sheet.set("F1", "=СУММ(D2:D5)")
        sheet.set("F2", "=ПРОМЕЖУТОЧНЫЕ.ИТОГИ(9;D2:D5)")
        sheet.set("F3", "=ПРОМЕЖУТОЧНЫЕ.ИТОГИ(109;D2:D5)")
        sheet.set("F4", "=ПРОМЕЖУТОЧНЫЕ.ИТОГИ(102;D2:D5)")
        got = [display(book.value("Л", f"F{r}")) for r in range(1, 5)]
        self.assertEqual(got, ["100", "80", "50", "2"])


class Copying(unittest.TestCase):
    def test_four_kinds_of_reference(self):
        self.assertEqual(shift("=A2", 0, 1), "=B2")
        self.assertEqual(shift("=A2", 1, 0), "=A3")
        self.assertEqual(shift("=$A$2", 1, 1), "=$A$2")
        self.assertEqual(shift("=$A2", 1, 1), "=$A3")
        self.assertEqual(shift("=A$2", 1, 1), "=B$2")

    def test_course_examples(self):
        self.assertEqual(shift("=B2*C2", 3, 0), "=B5*C5")
        self.assertEqual(shift("=B2*C2", 0, 2), "=D2*E2")
        self.assertEqual(shift("=$B2*C$1+$H$2", 3, 2), "=$B5*E$1+$H$2")
        self.assertEqual(shift("=D2*(1-$H$2)", 1, 0), "=D3*(1-$H$2)")
        self.assertEqual(shift("=СУММ($A$2:A2)", 1, 0), "=СУММ($A$2:A3)")
        self.assertEqual(shift("=СЧЁТЕСЛИ($A2:$F2;A2)", 0, 1), "=СЧЁТЕСЛИ($A2:$F2;B2)")

    def test_text_and_sheet_names_do_not_move(self):
        self.assertEqual(shift('="A2"&A2', 1, 0), '="A2"&A3')
        self.assertEqual(shift("=Товары!$A$2:$D$5", 1, 1), "=Товары!$A$2:$D$5")
        self.assertEqual(shift("=A1", -1, 0), "=#ССЫЛКА!")

    def test_references(self):
        refs = references("=ВПР(B2;Товары!$A$2:$D$5;3;0)")
        self.assertEqual([(r.sheet, r.r1, r.c1, r.r2, r.c2) for r in refs],
                         [(None, 2, 2, 2, 2), ("Товары", 2, 1, 5, 4)])  # fmt: skip

    def test_multiplication_table(self):
        book = Book()
        sheet = book.sheet("Л")
        for i in range(1, 6):
            sheet.set(f"A{i + 1}", str(i))
            sheet.set(f"{'ABCDEF'[i]}1", str(i))
        for dr in range(5):
            for dc in range(5):
                sheet.set(f"{'BCDEF'[dc]}{dr + 2}", shift("=$A2*B$1", dr, dc))
        self.assertEqual(display(book.value("Л", "F6")), "25")
        self.assertEqual(display(book.value("Л", "D3")), "6")


class Row(unittest.TestCase):
    def test_row_of_the_cell_and_of_a_reference(self):
        book = Book()
        sheet = book.sheet("Л")
        sheet.set("C7", "=СТРОКА()")
        sheet.set("D2", "=СТРОКА(B9)+СТРОКА()")
        self.assertEqual(display(book.value("Л", "C7")), "7")
        self.assertEqual(display(book.value("Л", "D2")), "11")


class Cycles(unittest.TestCase):
    def test_cycle_is_an_error(self):
        book = Book()
        sheet = book.sheet("Л")
        sheet.set("A1", "=B1+1")
        sheet.set("B1", "=A1+1")
        self.assertEqual(display(book.value("Л", "A1")), "#ЦИКЛ!")


class English(unittest.TestCase):
    def test_to_english(self):
        self.assertEqual(
            to_english('=СУММЕСЛИ(G2:L2;">1";A2:F2)*0,5'), '=SUMIF(G2:L2,">1",A2:F2)*0.5'
        )
        self.assertEqual(to_english('=ЕСЛИ(A1;"а;б";ЛОЖЬ)'), '=IF(A1,"а;б",FALSE)')
        self.assertEqual(to_english("=ПРОМЕЖУТОЧНЫЕ.ИТОГИ(109;D2:D100)"), "=SUBTOTAL(109,D2:D100)")


if __name__ == "__main__":
    unittest.main()
