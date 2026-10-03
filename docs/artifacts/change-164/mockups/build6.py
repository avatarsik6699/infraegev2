# v5 "notebook": v1/v3 composition; colourful home, colour elsewhere only for illustrations and the
# main next step; the warm surface is replaced by white with a barely visible engineering grid in page heads.
import os, re
import build5  # noqa: F401  builds v2..v4 into site/ (side effect)
import build_base as B
from build_base import header, mockbar, page
from brand_kit import cr

P = {"sage": "#e6f0e4", "sky": "#e3edf7", "lilac": "#ece8f6", "apricot": "#ffeadb"}
GRID = "#e6ebf2"
SOFT = "#f8f8f6"
OR = "#c24c00"  # single UI orange: AA on white and the neutral surface; logo keeps #ff6a00

V5_CSS = f"""
/* v5 notebook */
:root{{--p-sage:{P["sage"]};--p-sky:{P["sky"]};--p-lilac:{P["lilac"]};--p-apricot:{P["apricot"]};
--tint:{SOFT};--tint-l:#fbfbfa;--cream:{SOFT};--side:#fbfbfa;--wash:#f3f3f1;--grid-major:rgba(48,78,128,.085);--grid-minor:rgba(48,78,128,.035)}}
.grid-bg,.pband,.hero2,.band3{{position:relative;background:#fff;border-bottom:1px solid var(--line)}}
.grid-bg::before,.pband::before,.hero2::before,.band3::before{{content:"";position:absolute;inset:0;pointer-events:none;
/* engineering grid: rectangular cells, major every 5 minor, barely visible, fades to every edge */
background-image:linear-gradient(90deg,var(--grid-major) 1px,transparent 1px),linear-gradient(var(--grid-major) 1px,transparent 1px),
linear-gradient(90deg,var(--grid-minor) 1px,transparent 1px),linear-gradient(var(--grid-minor) 1px,transparent 1px);
background-size:80px 48px,80px 48px,16px 12px,16px 12px;background-position:-1px -1px;
-webkit-mask-image:radial-gradient(ellipse 62% 78% at 55% 42%,#000 0%,rgba(0,0,0,.45) 50%,transparent 82%);
mask-image:radial-gradient(ellipse 62% 78% at 55% 42%,#000 0%,rgba(0,0,0,.45) 50%,transparent 82%)}}
.grid-bg>*,.pband>*,.hero2>*,.band3>*{{position:relative}}
.pband .ill{{background:#fff;border:1px dashed var(--line2)}}
/* home: the one colourful page */
.s-home .tile2{{border:0}}
.s-home .tile2.sage{{background:var(--p-sage)}}.s-home .tile2.sky{{background:var(--p-sky)}}.s-home .tile2.butter{{background:var(--p-lilac)}}
.s-home .tile2:hover{{filter:brightness(.98)}}
.s-home .hero2 .plate{{background:var(--p-apricot)!important;border:0!important}}
.s-home .tcard:nth-child(4n+1) .pl{{background:var(--p-sky)}}.s-home .tcard:nth-child(4n+2) .pl{{background:var(--p-sage)}}
.s-home .tcard:nth-child(4n+3) .pl{{background:var(--p-lilac)}}.s-home .tcard:nth-child(4n+4) .pl{{background:var(--p-apricot)}}
.s-home .try{{background:var(--tint)}}.s-home .bandsky{{background:var(--p-sky)}}
/* elsewhere: colour only on illustration plates and the main next step */
.rows .row .ill,.card .ill{{border:0;background:var(--tint)}}
.course-ill{{background:var(--p-sky)!important}}
.next{{background:var(--p-sky)!important}}
.callout,.callout.warn{{background:var(--tint-l)}}
"""


def brand():
    sw = [
        (
            "#17191e",
            "Текст, основная кнопка",
            f"{cr('#17191e', '#ffffff'):.1f}:1 на белом",
        ),
        (
            "#3f4550",
            "Вторичный текст",
            f"не ниже {min(cr('#3f4550', c) for c in P.values()):.1f}:1 на пастели",
        ),
        (
            OR,
            "Оранжевый --or: «вы здесь»",
            f"{OR} · {cr(OR, '#ffffff'):.1f}:1 на белом · {cr(OR, SOFT):.1f}:1 на подложке",
        ),
        ("#1f4fd0", "Синий --link: все ссылки", f"{cr('#1f4fd0', '#ffffff'):.1f}:1 на белом · от {min(cr('#1f4fd0', c) for c in P.values()):.1f}:1 на пастели"),
        ("#ff6a00", "Оранжевый логотипа", "только знак и подчёркивание фразы на главной"),
    ] + [
        (c, n, f"{c} · {cr('#17191e', c):.1f}:1 с текстом")
        for n, c in [
            ("Пастель: небо", P["sky"]),
            ("Пастель: шалфей", P["sage"]),
            ("Пастель: сирень", P["lilac"]),
            ("Пастель: абрикос", P["apricot"]),
        ]
    ]
    cells = "".join(
        f'<div class="sw"><div class="c" style="background:{c}"></div><div class="t"><b>{n}</b><small>{d}</small></div></div>'
        for c, n, d in sw
    )
    body = (
        mockbar(
            "Фирменный стиль · v5",
            "Белый фон, инженерная сетка в шапках, синие ссылки, оранжевая метка «вы здесь».",
        )
        + header()
        + f"""<section class="grid-bg"><div class="wrap" style="padding:44px 24px 36px"><h1 class="t" style="font-size:40px;margin:0">Фирменный стиль</h1>
<p style="color:var(--ink2);font-size:18px;max-width:64ch;margin:10px 0 0">Сайт выглядит как аккуратный учебник: белый лист, едва заметная инженерная сетка в шапках страниц, чёрный текст, синие ссылки и оранжевая метка там, где вы сейчас. Цвет не закреплён за разделами: пастель живёт на главной, на других страницах максимум одна цветная плашка у главного действия.</p></div></section>
<div class="wrap" style="padding:32px 24px 60px">
<div class="cards c3" style="margin:0 0 28px"><div class="card"><h3>Знак</h3><div style="display:flex;gap:14px;align-items:center"><svg style="width:56px;height:74px"><use href="#m"/></svg><b style="font:600 24px var(--sans)">infraege</b></div></div>
<div class="card"><h3>Инженерная сетка</h3><div class="grid-bg" style="height:84px;border:1px solid var(--line);border-radius:10px"></div><p style="font-size:14px">Прямоугольная сетка с главными линиями, только в шапке страницы, растворяется к краям. В области чтения сетки нет.</p></div>
<div class="card"><h3>Оранжевая метка</h3><p style="margin:0 0 10px"><span style="box-shadow:inset 0 -2px 0 var(--or);padding-bottom:4px;font-weight:500">Темы</span> &nbsp; <a class="lnk" href="#">Открыть тему →</a> <span style="font-size:13px;color:var(--mu)">(ссылка, синяя)</span></p><p style="font-size:14px">Одна роль: где вы сейчас. Линия под пунктом меню, вкладкой, текущей подтемой. Ссылки всегда синие. Оранжевый не используется для ссылок, кода, предупреждений, фокуса и бейджей.</p></div></div>
<h2 class="s">Цвета</h2><div class="cards c4" style="margin:14px 0 28px">{cells}</div>
<h2 class="s">Где появляется цвет</h2>
<div class="rule">Главная: плашки путей, подложки иллюстраций тем, блок курса. Мини-задача на нейтральной подложке. Это единственная по-настоящему цветная страница.</div>
<div class="rule">Каталоги тем и курсов: без цвета, подложки иллюстраций нейтральные.</div>
<div class="rule">Курс и профиль: одна цветная плашка на страницу, у главного следующего шага или иллюстрации курса.</div>
<div class="rule">Урок, задача и формы: белый фон, цвет только у результата проверки (зелёный, красный).</div></div>"""
        + build5.FOOT
    )
    page("brand.html", "Фирменный стиль — макет", body)


brand()

MOCK = {
    "home.html": (
        "Главная · v5",
        "Единственная цветная страница: пастельные плашки, сетка в hero.",
    ),
    "course-python.html": (
        "Курс Python · v5",
        "Белая шапка с сеткой, одна цветная плашка у иллюстрации.",
    ),
    "account.html": (
        "Профиль · v5",
        "Белые плитки, одна цветная плашка у следующего шага.",
    ),
}
for fn in os.listdir("site"):
    if not fn.endswith(".html"):
        continue
    p = "site/" + fn
    s = open(p).read()
    if fn in MOCK:
        s = re.sub(
            r'<div class="mock">.*?</div>', mockbar(*MOCK[fn]), s, count=1, flags=re.S
        )
    s = s.replace(" · v4<", " · v5<").replace(
        "Макеты Change 164 · v4", "Макеты Change 164 · v5"
    )
    s = s.replace(
        "Сдержанный вариант: композиция v3, один нейтральный фон.",
        "Цветная главная, остальные страницы спокойные, сетка в шапках.",
    )
    if fn == "course-python.html":
        s = s.replace(
            '<section style="background:var(--sky)">', '<section class="grid-bg">', 1
        )
        s = s.replace(
            'class="plate" style="aspect-ratio:3/2;background:#fff;border:0"',
            'class="plate course-ill" style="aspect-ratio:3/2;border:0"',
            1,
        )
    open(p, "w").write(s)

ORANGE_CSS = f"""
/* one UI orange (--or) for navigation only: link text and the "you are here" line */
:root{{--or:{OR}}}
.hl{{background:linear-gradient(transparent 89%,#ff6a00 89% 95%,transparent 95%)}}
.s-home .tile2 .go,.s-home .bandsky .lnk{{color:var(--ink)}}
.btn:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible,button:focus-visible{{outline:2px solid var(--ink);outline-offset:2px}}
.callout .ic{{color:var(--ink2)}}.callout.warn{{border-left-color:var(--ink2)}}
.code .k{{color:#5b3b9a}}
.ex li:last-child{{color:var(--ink);font-weight:600}}
.bd.or{{background:var(--wash);color:var(--ink2)}}
.cont .kd{{color:var(--ink2)}}
.sk .hw{{fill:var(--ink2)}}
.btn.or{{background:var(--ink);border-color:var(--ink);color:#fff}}
"""
MOBILE_CSS = """
/* phone width fixes */
@media(max-width:760px){
.brand small{display:none}
.in2{grid-template-columns:minmax(0,1fr)!important;gap:24px!important;padding-top:32px!important;padding-bottom:36px!important}
.board{grid-template-columns:minmax(0,1fr);padding:0 16px 40px}.board>*{min-width:0}.authw{padding:24px 16px}
.box2 .tp{grid-template-columns:minmax(0,1fr) auto;gap:6px 12px}.box2 .tp>.bar{grid-column:1/-1;grid-row:2}
.mod .lr{grid-template-columns:36px minmax(0,1fr) 20px;row-gap:4px;padding:12px 16px}
.mod .lr>span:nth-child(3){display:flex!important;grid-column:2;grid-row:2;font-size:13.5px!important}
.mod .lr>svg{grid-column:3;grid-row:1/3}
.rows>.row[style*="pointer-events:none"]{display:none}.rows .row>svg:last-child{display:none}
.pr>div:nth-of-type(1){flex:1 1 100%;min-width:0}
.btn.sm{white-space:nowrap}
}
"""
LINK_CSS = """
/* every link is blue (--link): inline links underlined, standalone action links bold with an arrow */
.lnk,.go,.tile .go,.tile2 .go,.tcard .go,.pc2 .go,.card .go,.s-home .tile2 .go,.s-home .bandsky .lnk{color:var(--link)}
.lnk:hover,.go:hover,a:hover .go{text-decoration:underline;text-underline-offset:3px}
"""
css = B.CSS + build5.CALM_CSS + V5_CSS + ORANGE_CSS + LINK_CSS + MOBILE_CSS
css = re.sub(r"--orink:[^;}]+;?", "", css).replace("--or:#f26a0a;", "").replace("var(--orink)", "var(--or)")
open("site/styles.css", "w").write(css)
for fn in os.listdir("site"):
    if fn.endswith(".html"):
        h = open("site/" + fn).read().replace("var(--orink)", "var(--or)").replace("color:var(--or)>Продолжить", "color:var(--link)>Продолжить")
        if fn == "lesson.html":
            h = h.replace('stroke="#f26a0a"', 'stroke="#17191e" stroke-width="2.4"')
        open("site/" + fn, "w").write(h)
print("ok")
