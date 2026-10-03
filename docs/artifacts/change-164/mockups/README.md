# Change 164 mockups — v5 "notebook" (approved main variant)

Approved by the architect on 2026-10-03. Earlier variants (v1–v4) were removed. Open `single.html`
(all pages, hash routing) or `index.html`.

- Home is the one colourful page: pastel path tiles, topic illustration plates and course band
  (sky `#e3edf7`, sage `#e6f0e4`, lilac `#ece8f6`, apricot `#ffeadb`; ink text ≥14.6:1,
  secondary `#3f4550` ≥8:1). The "try now" block sits on a neutral surface `#f8f8f6`.
- Other pages are white. Topic and course catalogs have neutral illustration plates. At most one
  colour plate per page for the main next step (course illustration, profile next step).
- Page heads (home hero, section heads, course hero, profile head) carry a barely visible
  engineering grid: rectangular 16×12 minor cells, major lines every 80×48, radial fade to all edges.
- Every link is blue `--link: #1f4fd0` (6.8:1 on white, ≥5.6:1 on pastels): inline links
  underlined, standalone action links semibold with an arrow.
- One UI orange `--or: #c24c00` (4.85:1 on white), role "you are here" only: the line under the
  current nav item, tab, lesson subtopic and page-rail item, plus the "Подтема N из M" label.
  `--orink` is removed.
- Orange is not used for code keywords (violet `#5b3b9a`), warnings (ink2 border and icon), focus
  rings (ink), badges or diagram emphasis, so unrelated parts never share its colour.
- Logo orange `#ff6a00` stays only in the mark and in the single highlighted phrase on home.
- Green/red only for answer results and destructive actions.
- Not used: section colours, yellow, blush, cairn progress, handwritten signature.

Generator: `build6.py` (runs on top of the scratchpad build chain; kept for reference).
