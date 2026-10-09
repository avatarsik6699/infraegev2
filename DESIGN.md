---
name: infraege
description: Понятная теория, разобранные примеры и задачи с проверкой для ЕГЭ по информатике.
colors:
  ink: "#17191e"
  ink-secondary: "#3f4550"
  ink-muted: "#4d535e"
  paper: "#ffffff"
  surface-soft: "#f8f8f6"
  surface-side: "#fbfbfa"
  wash: "#f3f3f1"
  line: "#e6e4de"
  line-strong: "#d9d9d4"
  link-blue: "#1f4fd0"
  here-orange: "#c24c00"
  logo-orange: "#ff6a00"
  pastel-sky: "#e3edf7"
  pastel-sage: "#e6f0e4"
  pastel-lilac: "#ece8f6"
  pastel-apricot: "#ffeadb"
  success: "#1d7a46"
  success-bg: "#eef7f1"
  error: "#b3261e"
  error-bg: "#fdf0ee"
  code-keyword: "#5b3b9a"
  code-string: "#2a6a3a"
  code-comment: "#636a75"
  code-number: "#0b6e75"
typography:
  display:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(36px, 4.8vw, 58px)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(30px, 3.6vw, 42px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title-sm:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.3
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.75
rounded:
  control: "6px"
  card: "12px"
  tile: "14px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "56px"
  gutter: "24px"
  gutter-mobile: "16px"
  container: "1160px"
  reading: "690px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  button-soft:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "46px"
  link:
    textColor: "{colors.link-blue}"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "3px 6px 3px 12px"
  badge:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "22px 24px"
  path-tile:
    backgroundColor: "{colors.pastel-sky}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    padding: "24px 26px 22px"
  next-step:
    backgroundColor: "{colors.pastel-sky}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "22px 26px"
---

# Design System: infraege

<!-- Source: approved mockups v5 of Change 164 (docs/artifacts/mockups-v5/), 2026-10-03.
     The app still renders the previous system until F3–F9 land; re-run `$impeccable document`
     after F4 to capture the implemented components. -->

## Overview

**Creative North Star: "The Clean Textbook"**

infraege looks like a well-made textbook: a white page, calm sans-serif type, generous line height
and colour used like bookmarks, not decoration. The home page is the cover: it is the one
genuinely colourful screen, with soft pastel plates that invite a learner in. Every other page is
an inside page: white, quiet, built for reading and solving, with at most one colour plate that
marks the main next step.

Identity comes from a few precise details rather than ornament: the three-stone logo, a barely
visible engineering grid in page heads, ink-black primary buttons, blue links you can recognise at
a glance, and one orange line that always means "you are here". Density is moderate: big readable
blocks, quiet hairline separators, small corner radii. Light theme only.

Confirmed rejections: dark or terminal/neon looks; a colour per site section; yellow or blush
plates; orange-filled buttons; AI-template badges ("бесплатно, без регистрации" pills); the stone
cairn as a progress indicator; handwritten signatures as a brand device; a warm tinted surface
spread across every page; colourful cartoon illustrations.

**Key Characteristics:**
- White reading surfaces; colour concentrated on the home page.
- Ink primary actions, blue links, orange only for position.
- Engineering grid in page heads, fading to every edge.
- Hand-drawn monochrome line illustrations on pastel or neutral plates.
- One progress indicator per piece of progress; no duplicates.

## Colors

A near-monochrome ink-on-paper system with four soft pastels for the cover, one blue for links and
one orange for position.

### Primary
- **Textbook Ink** (ink): body text, headings, primary buttons, progress bar fills. 17.6:1 on white.
- **Hyperlink Blue** (link-blue): every link, inline or standalone. Inline links are underlined
  (underline at 35% opacity, offset 3px); standalone action links are semibold with an arrow and
  underline on hover. ≥5.6:1 on every pastel, 6.8:1 on white.

### Secondary
- **Here Orange** (here-orange): the "you are here" mark only: the 2px line under the current
  nav item and selected tab, the 3px bar at the current lesson subtopic and page-rail item, and the
  small "Подтема N из M" label. 4.85:1 on white.
- **Logo Orange** (logo-orange): the top stone of the logo and of the mascot, and the single
  marker underline under the key phrase of the home hero. Nowhere else.

### Tertiary
- **Cover Pastels** (pastel-sky, pastel-sage, pastel-lilac, pastel-apricot): home-page path
  tiles, topic illustration plates and the course band. Outside home,
  one pastel plate per page for the main next step (course illustration, profile "Следующий шаг").
  Pastels rotate in a fixed order and carry no meaning; they are never assigned to a section.

### Neutral
- **Paper** (paper): page background, cards, reading areas, forms.
- **Soft Surface** (surface-soft): neutral plates (catalog illustration placeholders, the home
  "try a task" block), barely distinguishable from white on purpose.
- **Side Surface** (surface-side): lesson left panel, expanded practice rows, callouts.
- **Wash** (wash): soft buttons, badges, hover fills.
- **Progress track** (line): every progress bar is the same — a 6px hairline-grey track, ink
  fill, text above and below; the track never matches a hover fill.
- **Hairline** (line) and **Strong Hairline** (line-strong): separators, card and input borders.
- **Secondary Ink** (ink-secondary) for leads and text on plates (≥8:1 on pastels);
  **Muted Ink** (ink-muted) for metadata on white only.

### Status and code
- **Success / Error** (success, error with their -bg pairs): answer-check results (an accepted
  field, the solved mark in practice rows) and destructive actions only, never decoration.
- **Code** (code-keyword violet, code-string green, code-number teal, code-comment grey) inside code
  blocks only; every code colour keeps at least 4.5:1 on the code surface.

### Named Rules
**The Cover Rule.** Pastel colour belongs to the home page. Any other page gets at most one pastel
plate, and only for its main next step.

**The One Meaning Rule.** Each accent has exactly one job: blue is a link, orange is "you are
here", green/red are answer results. A colour never borrows another's job, so unrelated elements
are never visually linked.

**The No Section Colour Rule.** Sections are told apart by headings and illustrations, never by a
colour. Adding a section adds no colour.

## Typography

**Display Font:** Onest (with system-ui, sans-serif)
**Body Font:** Onest (with system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace)

**Character:** One friendly, clear Cyrillic grotesque carries everything from the hero to the
smallest label; the mono face marks code, task IDs and counters. Hierarchy comes from size and
weight, not from mixing families.

### Hierarchy
- **Display** (display): the home hero headline only.
- **Headline** (headline): page titles in section heads (Темы ЕГЭ, Практика, course title).
- **Title** (title): section headings and lesson h2; **Title-sm** (title-sm) for card titles.
- **Body** (body): reading text; lesson columns are capped at 690px (about 70ch).
- **Body-sm** (body-sm): card descriptions and secondary text.
- **Label** (label): kickers, metadata, table heads. Sentence case, never uppercase except
  mono state labels in internal tools.
- **Code** (code): code blocks, inline formulas and task IDs.

### Named Rules
**The One Family Rule.** Onest for all prose and UI; JetBrains Mono only for code, IDs and
numbers in tables. No handwritten face on the site (mascot artwork bakes its few labels into
outlines offline).

## Layout

Content sits in a 1160px container with 24px gutters (16px under 760px). Pages open with a
**page head**: white, title and lead on the left, optional illustration plate on the right, a
hairline below and the engineering grid behind. Catalog heads share one structure (`PageHead`
title, lead and meta): the same title, lead and meta sizes and gaps on every page. Sections are separated by whitespace (about 56px)
rather than rules.

Lessons use three zones: a 272px left panel with a file tree (EGE: published topics in exam order,
each a folder of its subtopics and «Практика и итог»; course: modules as folders of lessons), a
reading column up to 690px opening with breadcrumbs (ancestors as links, the current page as
text), and a 224px "На этой странице" rail with the lesson progress under it; on phones both side
zones collapse into a "Подтемы · N из M" disclosure that also holds the progress. Course overview, catalogs and profile have no left panel. The
practice catalog keeps inline solving in the list, task detail on its own page, and pagination
joined with the per-page limit.

Under 760px every two-column hero stacks, table-like rows reflow into title, metadata and status
lines, and form boards collapse to one column. Touch targets stay at least 40px.

**The Engineering Grid.** Page heads carry a rectangular grid: minor cells 16×12px at 3.5% blue-grey
ink, major lines every 80×48px at 8.5%, masked by a radial fade so it vanishes toward every edge. It
never appears in reading areas, cards or forms.

## Elevation & Depth

Flat by default. Depth comes from hairline borders and tonal plates, not shadows. The only
shadows are functional: dropdown and dialog surfaces get a soft ambient shadow.

### Named Rules
**The Flat Page Rule.** Cards, tiles and plates never cast shadows at rest; hover changes the
border or fill, not elevation. One exception, set by the architect (2026-10-05): the home page is
the cover, and its cards (paths, topics, the try card, the course card) are raised — a soft
gradient of their own tone, `--shadow-cover`, a light top edge and a sheen from the top-left
corner; hover lifts them by 2px (`--shadow-cover-raised`, no lift under reduced motion). No other
page uses these tokens. A second exception (2026-10-06): the published course card on `/courses`
carries a slow monochrome highlight travelling along its border (off under reduced motion).

## Shapes

Small, calm corners: 6px on controls (buttons, inputs, segmented controls), 12px on cards and
plates, 14px on home path tiles, full pills for chips and badges. Borders are 1px hairlines.
Illustrations are hand-drawn monochrome lines with one orange accent and sit directly on the
surface, no plate behind them: every EGE topic has its object illustration (home cards and `/ege`
rows, dimmed for planned topics), the Python course its own picture (home block, `/courses`
card, `/courses/python` head at about a third of the head width). They are shown by the shared
`ObjectIllustration`, mascot scenes by `MascotScene`. Planned courses keep a neutral placeholder.

## Components

### Buttons
- **Shape:** gently rounded (6px), 44px tall (36px small), semibold 15px.
- **Primary:** ink fill, white text. One primary per view.
- **Secondary:** white with strong hairline border; **Soft:** wash fill for secondary actions
  in the practice row (Подсказка, Решение); **Quiet:** transparent.
- **Danger:** white with error text and border, only for irreversible account actions. The lesson
  progress reset dialog is the one exception (architect, 2026-10-06): a soft «Отмена» and a
  filled danger «Сбросить» with white text.
- **Hover / Focus:** hover darkens the fill or border; focus is a 2px ink outline with 2px offset.
- **Never** an orange or pastel-filled button.

### Links
- Always Hyperlink Blue. Inline links underlined; standalone action links ("Открыть тему →")
  semibold with an arrow, underline on hover. On pastel plates links stay blue.

### Chips and badges
- **Filter chips:** white pill with strong hairline, 14px text, 3px 6px 3px 12px, a 14px
  dismiss icon on the right.
- **Badges:** wash pill with muted ink; success badge uses success colours. No orange badges.

### Cards / Containers
- **Corner Style:** 12px. **Background:** paper. **Border:** 1px hairline, strong hairline on
  hover. **Internal Padding:** 22px 24px.
- **Path tiles (home):** pastel fill, no border, 14px corners, big number, title, description,
  blue action link.
- **Next step plate:** one pastel plate with the next lesson and an ink "Продолжить" button.

### Inputs / Fields
- **Style:** white, 1px border (#cfcfca), 6px corners, 46px tall; answers use the mono face.
- **Focus:** 2px ink outline.
- **Error / Success:** error border plus message in error colour; an accepted answer is the
  field itself — success border and fill with a check (no circle) — and a short confetti burst
  from «Проверить» (off under reduced motion); the result is announced, not printed.
- **Practice task:** one layout everywhere (catalog, task page, lessons): field, «Проверить»,
  «Подсказка» and «Решение» in one row, their panels below.

### Navigation
- Header: logo with wordmark and descriptor (descriptor hidden on phones), three text items,
  account on the right. Current item: ink text with a 2px Here Orange underline. Phones use a
  "Меню" button.
- Profile: minimal tabs (Обзор, Настройки) with the same orange underline.

### Lesson file tree (signature)
- A quiet tree: folders (topic or module) with a chevron, files hanging off a hairline; done
  items show a success check, the current one ink text and a 3px Here Orange bar on the tree
  line. A selected item never changes weight or size, so nothing reflows.

### Lesson pipeline blocks (Change 171)
- **Level mark:** an advanced subtopic is marked in text only: a quiet «Дополнительный уровень»
  caption above its group in the tree (the root caption's label face), « · дополнительный уровень»
  in muted ink after the orange «Подтема N из M» and in the pager label. Never a badge or a colour.
- **Learning table:** hairline rows, label-face head, numeric columns right-aligned in the mono face
  with tabular figures; sized by its content, scrolling only inside itself.
- **Rule or task plate:** a stated rule or condition in prose sits on side surface with a hairline
  border and 12px corners, no coloured bar.
- **Proof disclosure:** a closed native fold with a hairline frame and a chevron; wash on hover.
- **Exact diagram and step-through:** code-built SVG drawn inline on a hairline plate (card
  radius) with one muted caption; labels in the page font (Onest), ink lines, hairline greys and
  the wash, plus one Logo Orange accent as stroke or text on the figure's main thought — never a
  fill, never a hand or monospace face. The stepper's controls copy `LessonVideo`: quiet icon
  buttons, a thin ink timeline and a «2 / 7» count. On phones both keep a readable scale and
  scroll inside their focusable plate.
- **Mask sandbox:** a hairline-framed block with two fields and digit cells: white for required
  digits, the wash for `?`, an orange outline for `*` — the same meaning as the mask diagram.
- **Compact lesson flow:** one reading flow without Callout or Mistake boxes. Program output sits
  under its code inside the code block, label-face «Вывод» and the lines joined with «, ».
- **Python term hint:** the term itself is the InfoPopover trigger: running text with a muted
  dotted underline that turns solid ink on hover or while open, no icon; the popover has a bold title, a short explanation, the course lesson name, «Читать урок →» and a
  bordered «Закрыть». Without scripting a native popover keeps the paragraph whole.
- **Variant picker:** rounded hairline chips (the shared `ChoiceChips`, also used for the remainder
  explorer presets); the chosen chip gets an ink outline and medium
  weight; the value appears below in reading size. Token rows emphasise chosen members with an
  ink border and semibold digits.
- **Topic cheat sheet:** one hairline sheet: a three-step solving order joined by small orange
  arrows (its only accent), a three-column grid of subtopic blocks (link title, code key, muted
  note), then optional topic-wide sections side by side (a two-column rows section is twice as
  wide; topic 25: candidate sources and the final checks); two columns under 47.5rem, one under
  35rem.

### Mascot
- A living stack of the three logo stones: face on the big bottom stone, the top stone outlined in
  Logo Orange, thin arms with round hands, short legs. Outline only, uneven hand-drawn line.
- Approved poses and rules: `docs/artifacts/references/mascot`. Scenes are baked by its pipeline
  into `apps/web/public/images/mascot` and shown by the shared `MascotScene` (a lazy decorative
  image at the scene's own viewBox size).
- Places: home hero (lotus with floating learning objects), sign-in (unlocking a door),
  registration (filling in a clipboard form), 404 (an open door to nowhere), error (an unplugged
  server), empty search (an empty box under a magnifier). Catalog heads (`/ege`, `/courses`,
  `/practice`) have no illustration: a scene there competed with the title. Topics and courses
  keep object illustrations without the mascot.
- Scenes after the hero are drawn as PNG by the architect and traced by the pipeline; the face is
  redrawn with the pen of the poses. Around a scene only small monochrome abstract marks
  (sparkles, rings), spread out, never clustered at the mascot; no colour, confetti or large
  floating objects.
- Sign-in and registration: white page, the form on the left without a card, the scene on the
  right, centred together with a `--space-5` gap; the scene stays lower than the form.
- 404 and error are open pages, never a card: the scene (up to 50rem), then the title, text and
  actions; no large code digits. Empty search is an open block under the filters: the scene up
  to 34rem, the title and the reset.
- Motion is CSS inside the scene file: a slow float, gentle sway, sparkles; off under
  `prefers-reduced-motion`. Hero and auth scenes are hidden below 960px, where they would wrap under
  the copy or the form.

## Do's and Don'ts

### Do:
- **Do** keep reading areas (lesson, task, forms) on white.
- **Do** make links Hyperlink Blue everywhere and keep orange for "you are here" only.
- **Do** use at most one pastel plate on any page other than home.
- **Do** keep text on plates in Textbook Ink or Secondary Ink.
- **Do** show each piece of progress once per page.
- **Do** use the engineering grid only in page heads, faded to the edges.

### Don't:
- **Don't** assign colours to site sections.
- **Don't** fill buttons with orange or pastel; primary buttons are ink.
- **Don't** use orange for links, code, warnings, focus rings, badges or diagram emphasis.
- **Don't** use yellow or blush plates, or red outside errors and destructive actions.
- **Don't** add AI-template badges, cairn progress indicators or handwritten signatures.
- **Don't** spread a tinted surface across whole pages.
- **Don't** mark callouts, cards or list items with a thick coloured side bar; callouts are
  told apart by their icon and title on the side surface.
- **Don't** add a left panel to pages where it would duplicate content (course overview,
  catalogs, profile, privacy).
