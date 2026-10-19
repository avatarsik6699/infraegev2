// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%cmb_tree("АБ", "012")%%
  cmbTree012: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 250"><circle cx="40" cy="119.0" r="5" fill="#17191e"/><text x="40.0" y="105.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">начало</text><text x="200.0" y="16.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">первый символ</text><text x="380.0" y="16.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">второй символ</text><text x="500.0" y="16.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">код</text><line x1="45" y1="119.0" x2="186" y2="74.0" stroke="#17191e" stroke-width="1.5"/><rect x="186.0" y="59.0" width="30.0" height="30.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="201.0" y="80.0" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><line x1="216" y1="74.0" x2="366" y2="44.0" stroke="#4d535e" stroke-width="1.25"/><rect x="366.0" y="31.0" width="26.0" height="26.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="379.0" y="49.2" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="500.0" y="49.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А0</text><line x1="216" y1="74.0" x2="366" y2="74.0" stroke="#4d535e" stroke-width="1.25"/><rect x="366.0" y="61.0" width="26.0" height="26.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="379.0" y="79.2" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="500.0" y="79.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А1</text><line x1="216" y1="74.0" x2="366" y2="104.0" stroke="#4d535e" stroke-width="1.25"/><rect x="366.0" y="91.0" width="26.0" height="26.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="379.0" y="109.2" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="500.0" y="109.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А2</text><line x1="45" y1="119.0" x2="186" y2="164.0" stroke="#17191e" stroke-width="1.5"/><rect x="186.0" y="149.0" width="30.0" height="30.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="201.0" y="170.0" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б</text><line x1="216" y1="164.0" x2="366" y2="134.0" stroke="#4d535e" stroke-width="1.25"/><rect x="366.0" y="121.0" width="26.0" height="26.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="379.0" y="139.2" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="500.0" y="139.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б0</text><line x1="216" y1="164.0" x2="366" y2="164.0" stroke="#4d535e" stroke-width="1.25"/><rect x="366.0" y="151.0" width="26.0" height="26.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="379.0" y="169.2" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="500.0" y="169.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б1</text><line x1="216" y1="164.0" x2="366" y2="194.0" stroke="#4d535e" stroke-width="1.25"/><rect x="366.0" y="181.0" width="26.0" height="26.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="379.0" y="199.2" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="500.0" y="199.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б2</text><text x="600.0" y="238.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">2 · 3 = 6</text></svg>',
    width: 660,
    height: 250,
    alt: "Дерево выбора двухсимвольного кода: 6 вариантов",
  },
  // %%cmb_shrink("АОБВГ", ("АБ", "ГО"))%%
  cmbShrink_b80ea4: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 182"><text x="16.0" y="18.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">место 1: 5 букв</text><text x="226.0" y="18.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">место 2: 4 буквы</text><text x="436.0" y="18.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">место 3: 3 буквы</text><rect x="16.0" y="34.0" width="24.0" height="24.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="28.0" y="50.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="43.0" y="34.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="55.0" y="50.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О</text><rect x="70.0" y="34.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="82.0" y="50.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б</text><rect x="97.0" y="34.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="109.0" y="50.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">В</text><rect x="124.0" y="34.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="136.0" y="50.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Г</text><text x="16.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">выбрана А</text><rect x="226.0" y="34.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="238.0" y="50.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О</text><rect x="253.0" y="34.0" width="24.0" height="24.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="265.0" y="50.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б</text><rect x="280.0" y="34.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="292.0" y="50.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">В</text><rect x="307.0" y="34.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="319.0" y="50.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Г</text><text x="226.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">выбрана Б</text><rect x="436.0" y="34.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="448.0" y="50.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О</text><rect x="463.0" y="34.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="475.0" y="50.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">В</text><rect x="490.0" y="34.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="502.0" y="50.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Г</text><text x="436.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">после АБ: 3</text><rect x="16.0" y="108.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="28.0" y="124.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="43.0" y="108.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="55.0" y="124.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О</text><rect x="70.0" y="108.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="82.0" y="124.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б</text><rect x="97.0" y="108.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="109.0" y="124.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">В</text><rect x="124.0" y="108.0" width="24.0" height="24.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="136.0" y="124.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Г</text><text x="16.0" y="150.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">выбрана Г</text><rect x="226.0" y="108.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="238.0" y="124.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="253.0" y="108.0" width="24.0" height="24.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="265.0" y="124.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О</text><rect x="280.0" y="108.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="292.0" y="124.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б</text><rect x="307.0" y="108.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="319.0" y="124.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">В</text><text x="226.0" y="150.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">выбрана О</text><rect x="436.0" y="108.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="448.0" y="124.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="463.0" y="108.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="475.0" y="124.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б</text><rect x="490.0" y="108.0" width="24.0" height="24.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="502.0" y="124.8" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">В</text><text x="436.0" y="150.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">после ГО: 3</text></svg>',
    width: 660,
    height: 182,
    alt: "Слова без повторений: число свободных букв на каждом месте",
  },
  // %%cmb_or_grid("АОБВГ", "А")%%
  cmbOrGrid_fa18af: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 258"><text x="210.0" y="18.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">последняя буква</text><text x="16.0" y="138.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">первая буква</text><text x="108.0" y="70.3" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><text x="138.0" y="38.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="120.0" y="48.0" width="36.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="138.0" y="71.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="156.0" y="48.0" width="36.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="174.0" y="71.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="192.0" y="48.0" width="36.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="210.0" y="71.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="228.0" y="48.0" width="36.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="246.0" y="71.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="264.0" y="48.0" width="36.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="282.0" y="71.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="108.0" y="106.3" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О</text><text x="174.0" y="38.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О</text><rect x="120.0" y="84.0" width="36.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="138.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="156.0" y="84.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="174.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="192.0" y="84.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="210.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="228.0" y="84.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="246.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="264.0" y="84.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="282.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="108.0" y="142.3" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б</text><text x="210.0" y="38.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б</text><rect x="120.0" y="120.0" width="36.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="138.0" y="143.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="156.0" y="120.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="174.0" y="143.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="192.0" y="120.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="210.0" y="143.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="228.0" y="120.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="246.0" y="143.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="264.0" y="120.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="282.0" y="143.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="108.0" y="178.3" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">В</text><text x="246.0" y="38.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">В</text><rect x="120.0" y="156.0" width="36.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="138.0" y="179.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="156.0" y="156.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="174.0" y="179.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="192.0" y="156.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="210.0" y="179.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="228.0" y="156.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="246.0" y="179.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="264.0" y="156.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="282.0" y="179.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="108.0" y="214.3" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Г</text><text x="282.0" y="38.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Г</text><rect x="120.0" y="192.0" width="36.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="138.0" y="215.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="156.0" y="192.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="174.0" y="215.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="192.0" y="192.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="210.0" y="215.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="228.0" y="192.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="246.0" y="215.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="264.0" y="192.0" width="36.0" height="36.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="282.0" y="215.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="120.0" y="48.0" width="36.0" height="36.0" rx="0" fill="none" stroke="#ff6a00" stroke-width="2.5"/><text x="340.0" y="66.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">строка А: 25 слов</text><text x="340.0" y="92.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">столбец А: 25 слов</text><text x="340.0" y="118.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">на пересечении: 5 слов</text><text x="340.0" y="156.0" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">25 + 25 − 5 = 45</text></svg>',
    width: 660,
    height: 258,
    alt: "Трёхбуквенные слова: начинаются с А или заканчиваются на А",
  },
  // %%combo_grids("АОБ")%%
  comboGrids_23b46d: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 232"><text x="82.5" y="20.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="600" fill="#17191e" text-anchor="middle" textLength="52.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">product</text><text x="82.5" y="40.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">9 пар</text><text x="33.5" y="78.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">А</text><text x="58.5" y="54.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">А</text><rect x="43.5" y="60.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="58.5" y="80.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">АА</text><rect x="73.5" y="60.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="88.5" y="80.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">АО</text><rect x="103.5" y="60.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="118.5" y="80.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">АБ</text><text x="33.5" y="108.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">О</text><text x="88.5" y="54.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">О</text><rect x="43.5" y="90.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="58.5" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ОА</text><rect x="73.5" y="90.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="88.5" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ОО</text><rect x="103.5" y="90.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="118.5" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ОБ</text><text x="33.5" y="138.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">Б</text><text x="118.5" y="54.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">Б</text><rect x="43.5" y="120.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="58.5" y="140.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">БА</text><rect x="73.5" y="120.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="88.5" y="140.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">БО</text><rect x="103.5" y="120.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="118.5" y="140.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ББ</text><text x="82.5" y="176.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">порядок важен,</text><text x="82.5" y="194.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">повтор можно</text><text x="247.5" y="20.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="600" fill="#17191e" text-anchor="middle" textLength="90.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">permutations</text><text x="247.5" y="40.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">6 пар</text><text x="198.5" y="78.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">А</text><text x="223.5" y="54.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">А</text><rect x="208.5" y="60.0" width="30.0" height="30.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="223.5" y="80.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">АА</text><rect x="238.5" y="60.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="253.5" y="80.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">АО</text><rect x="268.5" y="60.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="283.5" y="80.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">АБ</text><text x="198.5" y="108.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">О</text><text x="253.5" y="54.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">О</text><rect x="208.5" y="90.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="223.5" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ОА</text><rect x="238.5" y="90.0" width="30.0" height="30.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="253.5" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ОО</text><rect x="268.5" y="90.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="283.5" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ОБ</text><text x="198.5" y="138.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">Б</text><text x="283.5" y="54.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">Б</text><rect x="208.5" y="120.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="223.5" y="140.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">БА</text><rect x="238.5" y="120.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="253.5" y="140.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">БО</text><rect x="268.5" y="120.0" width="30.0" height="30.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="283.5" y="140.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ББ</text><text x="247.5" y="176.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">порядок важен,</text><text x="247.5" y="194.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">без повтора</text><path d="M 165 8 V 200" stroke="#d9d9d4"/><text x="412.5" y="20.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="600" fill="#17191e" text-anchor="middle" textLength="90.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">combinations</text><text x="412.5" y="40.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">3 пар</text><text x="363.5" y="78.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">А</text><text x="388.5" y="54.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">А</text><rect x="373.5" y="60.0" width="30.0" height="30.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="388.5" y="80.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">АА</text><rect x="403.5" y="60.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="418.5" y="80.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">АО</text><rect x="433.5" y="60.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="448.5" y="80.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">АБ</text><text x="363.5" y="108.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">О</text><text x="418.5" y="54.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">О</text><rect x="373.5" y="90.0" width="30.0" height="30.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="388.5" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ОА</text><rect x="403.5" y="90.0" width="30.0" height="30.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="418.5" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ОО</text><rect x="433.5" y="90.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="448.5" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ОБ</text><text x="363.5" y="138.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">Б</text><text x="448.5" y="54.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">Б</text><rect x="373.5" y="120.0" width="30.0" height="30.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="388.5" y="140.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">БА</text><rect x="403.5" y="120.0" width="30.0" height="30.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="418.5" y="140.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">БО</text><rect x="433.5" y="120.0" width="30.0" height="30.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="448.5" y="140.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ББ</text><text x="412.5" y="176.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">без порядка,</text><text x="412.5" y="194.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">без повтора</text><path d="M 330 8 V 200" stroke="#d9d9d4"/><text x="577.5" y="20.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="600" fill="#17191e" text-anchor="middle" textLength="135.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">…_with_replacement</text><text x="577.5" y="40.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">6 пар</text><text x="528.5" y="78.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">А</text><text x="553.5" y="54.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">А</text><rect x="538.5" y="60.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="553.5" y="80.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">АА</text><rect x="568.5" y="60.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="583.5" y="80.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">АО</text><rect x="598.5" y="60.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="613.5" y="80.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">АБ</text><text x="528.5" y="108.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">О</text><text x="583.5" y="54.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">О</text><rect x="538.5" y="90.0" width="30.0" height="30.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="553.5" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ОА</text><rect x="568.5" y="90.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="583.5" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ОО</text><rect x="598.5" y="90.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="613.5" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ОБ</text><text x="528.5" y="138.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">Б</text><text x="613.5" y="54.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">Б</text><rect x="538.5" y="120.0" width="30.0" height="30.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="553.5" y="140.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">БА</text><rect x="568.5" y="120.0" width="30.0" height="30.0" rx="0" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="583.5" y="140.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">БО</text><rect x="598.5" y="120.0" width="30.0" height="30.0" rx="0" fill="#f3f3f1" stroke="#ff6a00" stroke-width="1.5"/><text x="613.5" y="140.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#17191e" text-anchor="middle" textLength="13.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ББ</text><text x="577.5" y="176.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">без порядка,</text><text x="577.5" y="194.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">повтор можно</text><path d="M 495 8 V 200" stroke="#d9d9d4"/><text x="330.0" y="224.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">строка — первая буква пары, столбец — вторая</text></svg>',
    width: 660,
    height: 232,
    alt: "Пары из трёх букв для четырёх средств itertools",
  },
  // %%cmb_places(5, 2, "А")%%
  cmbPlaces5_2: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="16.0" y="18.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">2 А на 5 местах</text><text x="336.0" y="18.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">2 А на 5 местах</text><rect x="16.0" y="28.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="29.0" y="46.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="45.0" y="28.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="58.0" y="46.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="74.0" y="28.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="103.0" y="28.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="132.0" y="28.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="173.0" y="46.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">места 1 и 2</text><rect x="16.0" y="62.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="29.0" y="80.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="45.0" y="62.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="74.0" y="62.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="87.0" y="80.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="103.0" y="62.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="132.0" y="62.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="173.0" y="80.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">места 1 и 3</text><rect x="16.0" y="96.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="29.0" y="114.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="45.0" y="96.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="74.0" y="96.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="103.0" y="96.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="116.0" y="114.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="132.0" y="96.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="173.0" y="114.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">места 1 и 4</text><rect x="16.0" y="130.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="29.0" y="148.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="45.0" y="130.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="74.0" y="130.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="103.0" y="130.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="132.0" y="130.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="145.0" y="148.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><text x="173.0" y="148.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">места 1 и 5</text><rect x="16.0" y="164.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="45.0" y="164.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="58.0" y="182.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="74.0" y="164.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="87.0" y="182.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="103.0" y="164.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="132.0" y="164.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="173.0" y="182.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">места 2 и 3</text><rect x="336.0" y="28.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="365.0" y="28.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="378.0" y="46.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="394.0" y="28.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="423.0" y="28.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="436.0" y="46.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="452.0" y="28.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="493.0" y="46.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">места 2 и 4</text><rect x="336.0" y="62.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="365.0" y="62.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="378.0" y="80.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="394.0" y="62.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="423.0" y="62.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="452.0" y="62.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="465.0" y="80.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><text x="493.0" y="80.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">места 2 и 5</text><rect x="336.0" y="96.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="365.0" y="96.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="394.0" y="96.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="407.0" y="114.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="423.0" y="96.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="436.0" y="114.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="452.0" y="96.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="493.0" y="114.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">места 3 и 4</text><rect x="336.0" y="130.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="365.0" y="130.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="394.0" y="130.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="407.0" y="148.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="423.0" y="130.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="452.0" y="130.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="465.0" y="148.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><text x="493.0" y="148.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">места 3 и 5</text><rect x="336.0" y="164.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="365.0" y="164.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="394.0" y="164.0" width="26.0" height="26.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><rect x="423.0" y="164.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="436.0" y="182.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="452.0" y="164.0" width="26.0" height="26.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="465.0" y="182.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><text x="493.0" y="182.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">места 4 и 5</text><text x="330.0" y="220.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">20 упорядоченных выборов / 2! = 10 = C₅²</text></svg>',
    width: 660,
    height: 230,
    alt: "Все способы выбрать 2 места из 5: 10",
  },
  // %%cmb_labels("ТОПОТ")%%
  cmbLabels_dadd31: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 218"><text x="16.0" y="18.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">подписанные буквы</text><text x="430.0" y="18.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">обычное слово</text><rect x="16.0" y="30.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="33.0" y="53.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Т₁</text><rect x="54.0" y="30.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="71.0" y="53.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О₁</text><rect x="92.0" y="30.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="109.0" y="53.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">П</text><rect x="130.0" y="30.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="147.0" y="53.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О₂</text><rect x="168.0" y="30.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="185.0" y="53.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Т₂</text><line x1="212.0" y1="47.0" x2="413.4" y2="110.3" stroke="#4d535e" stroke-width="1.5"/><path d="M 422.0 113.0 L 412.1 114.6 L 414.8 106.0 Z" fill="#4d535e"/><rect x="16.0" y="74.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="33.0" y="97.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Т₁</text><rect x="54.0" y="74.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="71.0" y="97.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О₂</text><rect x="92.0" y="74.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="109.0" y="97.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">П</text><rect x="130.0" y="74.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="147.0" y="97.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О₁</text><rect x="168.0" y="74.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="185.0" y="97.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Т₂</text><line x1="212.0" y1="91.0" x2="413.0" y2="112.1" stroke="#4d535e" stroke-width="1.5"/><path d="M 422.0 113.0 L 412.6 116.5 L 413.5 107.6 Z" fill="#4d535e"/><rect x="16.0" y="118.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="33.0" y="141.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Т₂</text><rect x="54.0" y="118.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="71.0" y="141.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О₁</text><rect x="92.0" y="118.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="109.0" y="141.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">П</text><rect x="130.0" y="118.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="147.0" y="141.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О₂</text><rect x="168.0" y="118.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="185.0" y="141.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Т₁</text><line x1="212.0" y1="135.0" x2="413.0" y2="113.9" stroke="#4d535e" stroke-width="1.5"/><path d="M 422.0 113.0 L 413.5 118.4 L 412.6 109.5 Z" fill="#4d535e"/><rect x="16.0" y="162.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="33.0" y="185.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Т₂</text><rect x="54.0" y="162.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="71.0" y="185.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О₂</text><rect x="92.0" y="162.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="109.0" y="185.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">П</text><rect x="130.0" y="162.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="147.0" y="185.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О₁</text><rect x="168.0" y="162.0" width="34.0" height="34.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="185.0" y="185.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Т₁</text><line x1="212.0" y1="179.0" x2="413.4" y2="115.7" stroke="#4d535e" stroke-width="1.5"/><path d="M 422.0 113.0 L 414.8 120.0 L 412.1 111.4 Z" fill="#4d535e"/><rect x="430.0" y="96.0" width="34.0" height="34.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="447.0" y="119.0" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Т</text><rect x="468.0" y="96.0" width="34.0" height="34.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="485.0" y="119.0" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О</text><rect x="506.0" y="96.0" width="34.0" height="34.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="523.0" y="119.0" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">П</text><rect x="544.0" y="96.0" width="34.0" height="34.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="561.0" y="119.0" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">О</text><rect x="582.0" y="96.0" width="34.0" height="34.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="599.0" y="119.0" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Т</text><text x="430.0" y="156.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">4 подписанных → 1 слово</text></svg>',
    width: 660,
    height: 218,
    alt: "Подписанные одинаковые буквы слова ТОПОТ",
  },
  // %%cmb_gaps("БВГБ", (1, 4), "А")%%
  cmbGaps14: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 250"><text x="16.0" y="20.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">буквы без А и 5 промежутков</text><rect x="182.0" y="40.0" width="24.0" height="38.0" rx="4" fill="#fff" stroke="#4d535e" stroke-width="1" stroke-dasharray="5 4"/><text x="194.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="209.0" y="40.0" width="38.0" height="38.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="228.0" y="65.8" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б</text><rect x="250.0" y="40.0" width="24.0" height="38.0" rx="4" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="262.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="262.0" y="65.8" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="277.0" y="40.0" width="38.0" height="38.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="296.0" y="65.8" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">В</text><rect x="318.0" y="40.0" width="24.0" height="38.0" rx="4" fill="#fff" stroke="#4d535e" stroke-width="1" stroke-dasharray="5 4"/><text x="330.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="345.0" y="40.0" width="38.0" height="38.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="364.0" y="65.8" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Г</text><rect x="386.0" y="40.0" width="24.0" height="38.0" rx="4" fill="#fff" stroke="#4d535e" stroke-width="1" stroke-dasharray="5 4"/><text x="398.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="413.0" y="40.0" width="38.0" height="38.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="432.0" y="65.8" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б</text><rect x="454.0" y="40.0" width="24.0" height="38.0" rx="4" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="466.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="466.0" y="65.8" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><text x="16.0" y="140.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">получилось слово</text><rect x="204.0" y="150.0" width="38.0" height="38.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="223.0" y="175.8" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б</text><rect x="246.0" y="150.0" width="38.0" height="38.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="265.0" y="175.8" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><rect x="288.0" y="150.0" width="38.0" height="38.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="307.0" y="175.8" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">В</text><rect x="330.0" y="150.0" width="38.0" height="38.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="349.0" y="175.8" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Г</text><rect x="372.0" y="150.0" width="38.0" height="38.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="391.0" y="175.8" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б</text><rect x="414.0" y="150.0" width="38.0" height="38.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="433.0" y="175.8" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А</text><text x="330.0" y="236.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">выбрать 2 промежутка из 5: C₅² = 10</text></svg>',
    width: 660,
    height: 250,
    alt: "Промежутки вокруг букв БВГБ",
  },
  // %%overlap("АААА", "АА")%%
  overlap_b52f2a: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 168"><rect x="16" y="22" width="34" height="34" fill="#ffffff" stroke="#17191e"/><text x="33.0" y="45.0" text-anchor="middle" font-family="inherit" font-size="17" fill="#17191e">А</text><text x="33.0" y="16" text-anchor="middle" font-family="inherit" font-size="11" fill="#4d535e">0</text><rect x="50" y="22" width="34" height="34" fill="#ffffff" stroke="#17191e"/><text x="67.0" y="45.0" text-anchor="middle" font-family="inherit" font-size="17" fill="#17191e">А</text><text x="67.0" y="16" text-anchor="middle" font-family="inherit" font-size="11" fill="#4d535e">1</text><rect x="84" y="22" width="34" height="34" fill="#ffffff" stroke="#17191e"/><text x="101.0" y="45.0" text-anchor="middle" font-family="inherit" font-size="17" fill="#17191e">А</text><text x="101.0" y="16" text-anchor="middle" font-family="inherit" font-size="11" fill="#4d535e">2</text><rect x="118" y="22" width="34" height="34" fill="#ffffff" stroke="#17191e"/><text x="135.0" y="45.0" text-anchor="middle" font-family="inherit" font-size="17" fill="#17191e">А</text><text x="135.0" y="16" text-anchor="middle" font-family="inherit" font-size="11" fill="#4d535e">3</text><line x1="20" y1="78" x2="80" y2="78" stroke="#17191e" stroke-width="4"/><text x="170" y="83" font-family="inherit" font-size="13" fill="#17191e">с позиции 0: count находит</text><line x1="54" y1="104" x2="114" y2="104" stroke="#4d535e" stroke-width="2" stroke-dasharray="5 4"/><text x="170" y="109" font-family="inherit" font-size="13" fill="#4d535e">с позиции 1: count пропускает: перекрывается с найденным</text><line x1="88" y1="130" x2="148" y2="130" stroke="#17191e" stroke-width="4"/><text x="170" y="135" font-family="inherit" font-size="13" fill="#17191e">с позиции 2: count находит</text></svg>',
    width: 660,
    height: 168,
    alt: "Вхождения АА в АААА",
  },
  // %%cmb_one_order((5, 3, 2, 0))%%
  cmbOneOrder5320: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 208"><text x="16.0" y="18.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">набор {0, 2, 3, 5}: 24 расстановки</text><rect x="16.0" y="30.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="60.0" y="50.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0235</text><rect x="116.0" y="30.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="160.0" y="50.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0253</text><rect x="216.0" y="30.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="260.0" y="50.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0325</text><rect x="316.0" y="30.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="360.0" y="50.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0352</text><rect x="416.0" y="30.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="460.0" y="50.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0523</text><rect x="516.0" y="30.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="560.0" y="50.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0532</text><rect x="16.0" y="66.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="60.0" y="86.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2035</text><rect x="116.0" y="66.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="160.0" y="86.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2053</text><rect x="216.0" y="66.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="260.0" y="86.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2305</text><rect x="316.0" y="66.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="360.0" y="86.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2350</text><rect x="416.0" y="66.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="460.0" y="86.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2503</text><rect x="516.0" y="66.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="560.0" y="86.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2530</text><rect x="16.0" y="102.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="60.0" y="122.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3025</text><rect x="116.0" y="102.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="160.0" y="122.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3052</text><rect x="216.0" y="102.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="260.0" y="122.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3205</text><rect x="316.0" y="102.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="360.0" y="122.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3250</text><rect x="416.0" y="102.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="460.0" y="122.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3502</text><rect x="516.0" y="102.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="560.0" y="122.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3520</text><rect x="16.0" y="138.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="60.0" y="158.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5023</text><rect x="116.0" y="138.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="160.0" y="158.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5032</text><rect x="216.0" y="138.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="260.0" y="158.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5203</text><rect x="316.0" y="138.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="360.0" y="158.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5230</text><rect x="416.0" y="138.0" width="88.0" height="28.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="460.0" y="158.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5302</text><rect x="516.0" y="138.0" width="88.0" height="28.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="560.0" y="158.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5320</text><text x="330.0" y="198.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">строго убывает 1 из 24</text></svg>',
    width: 660,
    height: 208,
    alt: "Все расстановки цифр 5, 3, 2, 0",
  },
  // %%cmb_counter("АБВ", 3)%%
  cmbCounter3: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 316"><text x="90.0" y="20.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">номер</text><text x="210.0" y="20.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">слово</text><text x="340.0" y="20.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">запись</text><text x="470.0" y="20.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">значение</text><line x1="40" y1="30" x2="520" y2="30" stroke="#d9d9d4"/><text x="90.0" y="48.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="210.0" y="48.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">ААА</text><text x="326.0" y="48.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="340.0" y="48.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="354.0" y="48.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="470.0" y="48.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="90.0" y="70.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="210.0" y="70.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">ААБ</text><text x="326.0" y="70.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="340.0" y="70.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="354.0" y="70.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="470.0" y="70.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="90.0" y="92.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="210.0" y="92.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">ААВ</text><text x="326.0" y="92.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="340.0" y="92.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="354.0" y="92.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="470.0" y="92.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="90.0" y="114.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="210.0" y="114.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">АБА</text><text x="326.0" y="114.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="340.0" y="114.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="354.0" y="114.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="470.0" y="114.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="90.0" y="136.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="210.0" y="136.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">АББ</text><text x="326.0" y="136.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="340.0" y="136.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="354.0" y="136.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="470.0" y="136.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="90.0" y="158.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="210.0" y="158.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">АБВ</text><text x="326.0" y="158.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="340.0" y="158.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="354.0" y="158.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="470.0" y="158.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="90.0" y="180.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="210.0" y="180.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">АВА</text><text x="326.0" y="180.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="340.0" y="180.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="354.0" y="180.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="470.0" y="180.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="90.0" y="202.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="210.0" y="202.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">АВБ</text><text x="326.0" y="202.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="340.0" y="202.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="354.0" y="202.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="470.0" y="202.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="90.0" y="224.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="210.0" y="224.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">АВВ</text><text x="326.0" y="224.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="340.0" y="224.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="354.0" y="224.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="470.0" y="224.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="90.0" y="246.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="210.0" y="246.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">БАА</text><text x="326.0" y="246.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="340.0" y="246.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="354.0" y="246.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="470.0" y="246.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="210.0" y="268.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">…</text><text x="90.0" y="290.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">27</text><text x="210.0" y="290.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">ВВВ</text><text x="326.0" y="290.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="340.0" y="290.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="354.0" y="290.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="470.0" y="290.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">26</text><text x="580.0" y="48.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">основание 3</text><text x="580.0" y="66.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">номер =</text><text x="580.0" y="82.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">значение + 1</text></svg>',
    width: 660,
    height: 316,
    alt: "Список слов из АБВ как счётчик",
  },
  // %%place_value("1021", 3)%%
  placeValue1021_3: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 196"><rect x="181.0" y="16" width="64" height="56" rx="10" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="213.0" y="54.0" font-family="inherit" font-size="28" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="213.0" y="98.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">× 27</text><text x="213.0" y="130.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">27</text><rect x="259.0" y="16" width="64" height="56" rx="10" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="291.0" y="54.0" font-family="inherit" font-size="28" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="291.0" y="98.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">× 9</text><text x="291.0" y="130.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="337.0" y="16" width="64" height="56" rx="10" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="369.0" y="54.0" font-family="inherit" font-size="28" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="369.0" y="98.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">× 3</text><text x="369.0" y="130.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><rect x="415.0" y="16" width="64" height="56" rx="10" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="447.0" y="54.0" font-family="inherit" font-size="28" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="447.0" y="98.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">× 1</text><text x="447.0" y="130.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="169.0" y="98.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">вес</text><text x="330.0" y="172.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">27 + 0 + 6 + 1 = 34</text></svg>',
    width: 660,
    height: 196,
    alt: "Разряды записи 1021",
  },
  // %%convert_stepper(49, 3)%%
  convertStepper49_3: {
    kind: "stepper",
    width: 660,
    height: 230,
    frames: [
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="16.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">деление на 3</text><text x="640.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">запись 49 в системе с основанием 3</text><rect x="596.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="618.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="618.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3⁰</text><rect x="544.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="566.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="566.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3¹</text><rect x="492.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="514.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="514.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3²</text><rect x="440.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="462.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="462.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3³</text><text x="640.0" y="150.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">49 — что осталось перевести</text><text x="640.0" y="176.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">цифр пока нет</text></svg>',
        caption:
          "Переводим 49 в систему с основанием 3. Цифры записи появятся справа налево.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="16.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">деление на 3</text><text x="16.0" y="52.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">49 = 3 · 16 + </text><text x="150.0" y="52.0" font-family="inherit" font-size="17" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="640.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">запись 49 в системе с основанием 3</text><rect x="596.0" y="44.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="618.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="618.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3⁰</text><rect x="544.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="566.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="566.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3¹</text><rect x="492.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="514.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="514.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3²</text><rect x="440.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="462.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="462.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3³</text><text x="640.0" y="150.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">остаток 1 — цифра разряда 3⁰</text><text x="640.0" y="176.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">дальше переводим 16</text></svg>',
        caption:
          "49 = 3 · 16 + 1. Остаток 1 — цифра разряда 3⁰, дальше работаем с частным 16.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="16.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">деление на 3</text><text x="16.0" y="52.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">49 = 3 · 16 + </text><text x="150.0" y="52.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="16.0" y="86.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">16 = 3 · 5 + </text><text x="150.0" y="86.0" font-family="inherit" font-size="17" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="640.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">запись 49 в системе с основанием 3</text><rect x="596.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="618.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="618.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3⁰</text><rect x="544.0" y="44.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="566.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="566.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3¹</text><rect x="492.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="514.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="514.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3²</text><rect x="440.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="462.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="462.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3³</text><text x="640.0" y="150.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">остаток 1 — цифра разряда 3¹</text><text x="640.0" y="176.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">дальше переводим 5</text></svg>',
        caption:
          "16 = 3 · 5 + 1. Остаток 1 — цифра разряда 3¹, дальше работаем с частным 5.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="16.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">деление на 3</text><text x="16.0" y="52.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">49 = 3 · 16 + </text><text x="150.0" y="52.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="16.0" y="86.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">16 = 3 · 5 + </text><text x="150.0" y="86.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="16.0" y="120.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">5 = 3 · 1 + </text><text x="150.0" y="120.0" font-family="inherit" font-size="17" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><text x="640.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">запись 49 в системе с основанием 3</text><rect x="596.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="618.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="618.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3⁰</text><rect x="544.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="566.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="566.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3¹</text><rect x="492.0" y="44.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="514.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="514.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3²</text><rect x="440.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="462.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="462.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3³</text><text x="640.0" y="150.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">остаток 2 — цифра разряда 3²</text><text x="640.0" y="176.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">дальше переводим 1</text></svg>',
        caption:
          "5 = 3 · 1 + 2. Остаток 2 — цифра разряда 3², дальше работаем с частным 1.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="16.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">деление на 3</text><text x="16.0" y="52.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">49 = 3 · 16 + </text><text x="150.0" y="52.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="16.0" y="86.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">16 = 3 · 5 + </text><text x="150.0" y="86.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="16.0" y="120.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">5 = 3 · 1 + </text><text x="150.0" y="120.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><text x="16.0" y="154.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1 = 3 · 0 + </text><text x="150.0" y="154.0" font-family="inherit" font-size="17" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="640.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">запись 49 в системе с основанием 3</text><rect x="596.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="618.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="618.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3⁰</text><rect x="544.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="566.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="566.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3¹</text><rect x="492.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="514.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="514.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3²</text><rect x="440.0" y="44.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="462.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="462.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3³</text><text x="640.0" y="150.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">остаток 1 — цифра разряда 3³</text><text x="640.0" y="176.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">дальше переводим 0</text></svg>',
        caption:
          "1 = 3 · 0 + 1. Остаток 1 — цифра разряда 3³, частное 0 — перевод закончен.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="16.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">деление на 3</text><text x="16.0" y="52.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">49 = 3 · 16 + </text><text x="150.0" y="52.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="16.0" y="86.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">16 = 3 · 5 + </text><text x="150.0" y="86.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="16.0" y="120.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">5 = 3 · 1 + </text><text x="150.0" y="120.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><text x="16.0" y="154.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">1 = 3 · 0 + </text><text x="150.0" y="154.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="640.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">запись 49 в системе с основанием 3</text><rect x="596.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="618.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="618.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3⁰</text><rect x="544.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="566.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="566.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3¹</text><rect x="492.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="514.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="514.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3²</text><rect x="440.0" y="44.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="462.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="462.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3³</text><text x="640.0" y="150.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">49 = 1211₃</text><text x="640.0" y="176.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">остатки снизу вверх</text></svg>',
        caption:
          "Готово: 49 = 1211₃. Первый найденный остаток стоит справа, последний — слева.",
      },
    ],
  },
  // %%cmb_blocks("АБВ", 4, "БА")%%
  cmbBlocks4: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 188"><rect x="26.0" y="24.0" width="200.0" height="34.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="126.0" y="46.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">А…: 1–27</text><rect x="230.0" y="24.0" width="200.0" height="34.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="330.0" y="46.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Б…: 28–54</text><rect x="434.0" y="24.0" width="200.0" height="34.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="534.0" y="46.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">В…: 55–81</text><text x="24.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">3 блока по 27 слов</text><line x1="230.0" y1="58.0" x2="24" y2="116.0" stroke="#d9d9d4"/><line x1="430.0" y1="58.0" x2="636" y2="116.0" stroke="#d9d9d4"/><rect x="26.0" y="116.0" width="200.0" height="34.0" rx="4" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="126.0" y="138.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">БА…: 28–36</text><rect x="230.0" y="116.0" width="200.0" height="34.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="330.0" y="138.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">ББ…: 37–45</text><rect x="434.0" y="116.0" width="200.0" height="34.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="534.0" y="138.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">БВ…: 46–54</text><text x="24.0" y="168.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">3 блока по 9 слов</text></svg>',
    width: 660,
    height: 188,
    alt: "Блоки списка по началу БА",
  },
  // %%cmb_renumber("АБ", 2, "А", 1)%%
  cmbRenumber2_1: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 210"><text x="110.0" y="20.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">полный список</text><text x="470.0" y="20.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">только слова с 1 А, заново</text><text x="60.0" y="55.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="84.0" y="34.0" width="90.0" height="30.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="129.0" y="55.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">АА</text><text x="60.0" y="95.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="84.0" y="74.0" width="90.0" height="30.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="129.0" y="95.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">АБ</text><line x1="180.0" y1="89.0" x2="403.1" y2="50.5" stroke="#4d535e" stroke-width="1.5"/><path d="M 412.0 49.0 L 403.9 55.0 L 402.4 46.1 Z" fill="#4d535e"/><rect x="420.0" y="34.0" width="90.0" height="30.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="465.0" y="55.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">АБ</text><text x="540.0" y="55.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">№ 1 (был 2)</text><text x="60.0" y="135.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="84.0" y="114.0" width="90.0" height="30.0" rx="5" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="129.0" y="135.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">БА</text><line x1="180.0" y1="129.0" x2="403.1" y2="90.5" stroke="#4d535e" stroke-width="1.5"/><path d="M 412.0 89.0 L 403.9 95.0 L 402.4 86.1 Z" fill="#4d535e"/><rect x="420.0" y="74.0" width="90.0" height="30.0" rx="5" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="465.0" y="95.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">БА</text><text x="540.0" y="95.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">№ 2 (был 3)</text><text x="60.0" y="175.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="84.0" y="154.0" width="90.0" height="30.0" rx="5" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="129.0" y="175.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">ББ</text></svg>',
    width: 660,
    height: 210,
    alt: "Полный список и список после отбора",
  },
  // %%cmb_states_stepper("АБВГ", "А", 5)%%
  cmbStatesStepper5: {
    kind: "stepper",
    width: 660,
    height: 230,
    frames: [
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="110.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">длина</text><text x="260.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">на А (a)</text><text x="420.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">на другую (b)</text><text x="560.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">всего</text><line x1="60" y1="32" x2="610" y2="32" stroke="#d9d9d4"/><text x="110.0" y="56.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="260.0" y="56.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="420.0" y="56.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="560.0" y="56.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text></svg>',
        caption:
          "Длина 1: на А одно слово, на другую букву — 3. Дальше каждая строка получается из предыдущей.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="110.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">длина</text><text x="260.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">на А (a)</text><text x="420.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">на другую (b)</text><text x="560.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">всего</text><line x1="60" y1="32" x2="610" y2="32" stroke="#d9d9d4"/><text x="110.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="260.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="420.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="560.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="110.0" y="90.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="260.0" y="90.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="420.0" y="90.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="560.0" y="90.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><line x1="400.0" y1="60.0" x2="292.8" y2="80.3" stroke="#4d535e" stroke-width="1.5"/><path d="M 284.0 82.0 L 292.0 75.9 L 293.7 84.7 Z" fill="#4d535e"/><line x1="290.0" y1="60.0" x2="385.2" y2="80.1" stroke="#4d535e" stroke-width="1.5"/><path d="M 394.0 82.0 L 384.3 84.5 L 386.1 75.7 Z" fill="#4d535e"/><line x1="420.0" y1="64.0" x2="420.0" y2="67.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 420.0 76.0 L 415.5 67.0 L 424.5 67.0 Z" fill="#4d535e"/></svg>',
        caption:
          "Длина 2: a = 3 — А дописываем только к словам, которые кончаются не на А (прежнее b); b = 3 · (1 + 3) = 12 — другую букву дописываем к любому слову. Всего 15.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="110.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">длина</text><text x="260.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">на А (a)</text><text x="420.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">на другую (b)</text><text x="560.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">всего</text><line x1="60" y1="32" x2="610" y2="32" stroke="#d9d9d4"/><text x="110.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="260.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="420.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="560.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="110.0" y="90.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="260.0" y="90.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="420.0" y="90.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="560.0" y="90.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="110.0" y="124.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="260.0" y="124.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="420.0" y="124.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">45</text><text x="560.0" y="124.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">57</text><line x1="400.0" y1="94.0" x2="292.8" y2="114.3" stroke="#4d535e" stroke-width="1.5"/><path d="M 284.0 116.0 L 292.0 109.9 L 293.7 118.7 Z" fill="#4d535e"/><line x1="290.0" y1="94.0" x2="385.2" y2="114.1" stroke="#4d535e" stroke-width="1.5"/><path d="M 394.0 116.0 L 384.3 118.5 L 386.1 109.7 Z" fill="#4d535e"/><line x1="420.0" y1="98.0" x2="420.0" y2="101.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 420.0 110.0 L 415.5 101.0 L 424.5 101.0 Z" fill="#4d535e"/></svg>',
        caption:
          "Длина 3: a = 12 — А дописываем только к словам, которые кончаются не на А (прежнее b); b = 3 · (3 + 12) = 45 — другую букву дописываем к любому слову. Всего 57.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="110.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">длина</text><text x="260.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">на А (a)</text><text x="420.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">на другую (b)</text><text x="560.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">всего</text><line x1="60" y1="32" x2="610" y2="32" stroke="#d9d9d4"/><text x="110.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="260.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="420.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="560.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="110.0" y="90.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="260.0" y="90.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="420.0" y="90.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="560.0" y="90.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="110.0" y="124.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="260.0" y="124.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="420.0" y="124.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">45</text><text x="560.0" y="124.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">57</text><text x="110.0" y="158.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="260.0" y="158.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">45</text><text x="420.0" y="158.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">171</text><text x="560.0" y="158.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">216</text><line x1="400.0" y1="128.0" x2="292.8" y2="148.3" stroke="#4d535e" stroke-width="1.5"/><path d="M 284.0 150.0 L 292.0 143.9 L 293.7 152.7 Z" fill="#4d535e"/><line x1="290.0" y1="128.0" x2="385.2" y2="148.1" stroke="#4d535e" stroke-width="1.5"/><path d="M 394.0 150.0 L 384.3 152.5 L 386.1 143.7 Z" fill="#4d535e"/><line x1="420.0" y1="132.0" x2="420.0" y2="135.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 420.0 144.0 L 415.5 135.0 L 424.5 135.0 Z" fill="#4d535e"/></svg>',
        caption:
          "Длина 4: a = 45 — А дописываем только к словам, которые кончаются не на А (прежнее b); b = 3 · (12 + 45) = 171 — другую букву дописываем к любому слову. Всего 216.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="110.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">длина</text><text x="260.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">на А (a)</text><text x="420.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">на другую (b)</text><text x="560.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">всего</text><line x1="60" y1="32" x2="610" y2="32" stroke="#d9d9d4"/><text x="110.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="260.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="420.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="560.0" y="56.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="110.0" y="90.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="260.0" y="90.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="420.0" y="90.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="560.0" y="90.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="110.0" y="124.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="260.0" y="124.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="420.0" y="124.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">45</text><text x="560.0" y="124.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">57</text><text x="110.0" y="158.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="260.0" y="158.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">45</text><text x="420.0" y="158.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">171</text><text x="560.0" y="158.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">216</text><text x="110.0" y="192.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="260.0" y="192.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">171</text><text x="420.0" y="192.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">648</text><text x="560.0" y="192.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">819</text><line x1="400.0" y1="162.0" x2="292.8" y2="182.3" stroke="#4d535e" stroke-width="1.5"/><path d="M 284.0 184.0 L 292.0 177.9 L 293.7 186.7 Z" fill="#4d535e"/><line x1="290.0" y1="162.0" x2="385.2" y2="182.1" stroke="#4d535e" stroke-width="1.5"/><path d="M 394.0 184.0 L 384.3 186.5 L 386.1 177.7 Z" fill="#4d535e"/><line x1="420.0" y1="166.0" x2="420.0" y2="169.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 420.0 178.0 L 415.5 169.0 L 424.5 169.0 Z" fill="#4d535e"/></svg>',
        caption:
          "Длина 5: a = 171 — А дописываем только к словам, которые кончаются не на А (прежнее b); b = 3 · (45 + 171) = 648 — другую букву дописываем к любому слову. Всего 819.",
      },
    ],
  },
  runNeighbours: {
    kind: "run",
    code: "word = 'БАОВГ'\ngood = True\nfor i in range(len(word) - 1):\n    if word[i] in 'АО' and word[i + 1] in 'АО':\n        good = False\n        break\nprint(good)",
    fileName: "neighbours.py",
    output: "False",
    steps: [
      {
        line: null,
        text: "Программа ещё не запущена.",
        kind: "start",
        frames: [{ title: "программа", names: [] }],
        objs: {},
        out: "",
      },
      {
        line: 1,
        text: "`word` получает значение `'БАОВГ'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "word", v: "'БАОВГ'", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`good` получает значение `True`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "word", v: "'БАОВГ'", ref: null, ch: false },
              { n: "good", v: "True", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт первое значение: `i` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "word", v: "'БАОВГ'", ref: null, ch: false },
              { n: "good", v: "True", ref: null, ch: false },
              { n: "i", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `word[i] in 'АО' and word[i + 1] in 'АО'` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "word", v: "'БАОВГ'", ref: null, ch: false },
              { n: "good", v: "True", ref: null, ch: false },
              { n: "i", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `i` = `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "word", v: "'БАОВГ'", ref: null, ch: false },
              { n: "good", v: "True", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `word[i] in 'АО' and word[i + 1] in 'АО'` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "word", v: "'БАОВГ'", ref: null, ch: false },
              { n: "good", v: "True", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`good` получает значение `False`. Прежнее значение `True` больше не связано с `good`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "word", v: "'БАОВГ'", ref: null, ch: false },
              { n: "good", v: "False", ref: null, ch: true },
              { n: "i", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "`break` прерывает цикл.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "word", v: "'БАОВГ'", ref: null, ch: false },
              { n: "good", v: "False", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "На экран выводится «False».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "word", v: "'БАОВГ'", ref: null, ch: false },
              { n: "good", v: "False", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "False\n",
      },
    ],
  },
  runNeighbours5: {
    kind: "run",
    code: "d = (2, 5, 0, 1)\ni = d.index(5)\ngood = True\nfor j in (i - 1, i + 1):\n    if 0 <= j < 4 and d[j] % 2 == 1:\n        good = False\nprint(good)",
    fileName: "neighbours5.py",
    output: "True",
    steps: [
      {
        line: null,
        text: "Программа ещё не запущена.",
        kind: "start",
        frames: [{ title: "программа", names: [] }],
        objs: {},
        out: "",
      },
      {
        line: 1,
        text: "`d` получает значение `(2, 5, 0, 1)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "d", v: "(2, 5, 0, 1)", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Python вычисляет `d.index(5)` → `1`, и `i` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "d", v: "(2, 5, 0, 1)", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`good` получает значение `True`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "d", v: "(2, 5, 0, 1)", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "good", v: "True", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`for` берёт первое значение: `j` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "d", v: "(2, 5, 0, 1)", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "good", v: "True", ref: null, ch: false },
              { n: "j", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Проверка `0 <= j < 4 and d[j] % 2 == 1` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "d", v: "(2, 5, 0, 1)", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "good", v: "True", ref: null, ch: false },
              { n: "j", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`for` берёт следующее значение: `j` = `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "d", v: "(2, 5, 0, 1)", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "good", v: "True", ref: null, ch: false },
              { n: "j", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Проверка `0 <= j < 4 and d[j] % 2 == 1` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "d", v: "(2, 5, 0, 1)", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "good", v: "True", ref: null, ch: false },
              { n: "j", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "d", v: "(2, 5, 0, 1)", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "good", v: "True", ref: null, ch: false },
              { n: "j", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "На экран выводится «True».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "d", v: "(2, 5, 0, 1)", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "good", v: "True", ref: null, ch: false },
              { n: "j", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "True\n",
      },
    ],
  },
  runRank: {
    kind: "run",
    code: "alphabet = 'АБВ'\nword = 'БАВБ'\nbase = len(alphabet)\nvalue = 0\nfor letter in word:\n    digit = alphabet.index(letter)\n    value = value * base + digit\n\nprint(value + 1)",
    fileName: "rank.py",
    output: "35",
    steps: [
      {
        line: null,
        text: "Программа ещё не запущена.",
        kind: "start",
        frames: [{ title: "программа", names: [] }],
        objs: {},
        out: "",
      },
      {
        line: 1,
        text: "`alphabet` получает значение `'АБВ'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "alphabet", v: "'АБВ'", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`word` получает значение `'БАВБ'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Python вычисляет `len(alphabet)` → `3`, и `base` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`value` получает значение `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт первое значение: `letter` = `'Б'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "0", ref: null, ch: false },
              { n: "letter", v: "'Б'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `alphabet.index(letter)` → `1`, и `digit` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "0", ref: null, ch: false },
              { n: "letter", v: "'Б'", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Python вычисляет `value * base + digit` → `1`, и `value` получает это значение. Прежнее значение `0` больше не связано с `value`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "1", ref: null, ch: true },
              { n: "letter", v: "'Б'", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт следующее значение: `letter` = `'А'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "1", ref: null, ch: false },
              { n: "letter", v: "'А'", ref: null, ch: true },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `alphabet.index(letter)` → `0`, и `digit` получает это значение. Прежнее значение `1` больше не связано с `digit`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "1", ref: null, ch: false },
              { n: "letter", v: "'А'", ref: null, ch: false },
              { n: "digit", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Python вычисляет `value * base + digit` → `3`, и `value` получает это значение. Прежнее значение `1` больше не связано с `value`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "3", ref: null, ch: true },
              { n: "letter", v: "'А'", ref: null, ch: false },
              { n: "digit", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт следующее значение: `letter` = `'В'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "3", ref: null, ch: false },
              { n: "letter", v: "'В'", ref: null, ch: true },
              { n: "digit", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `alphabet.index(letter)` → `2`, и `digit` получает это значение. Прежнее значение `0` больше не связано с `digit`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "3", ref: null, ch: false },
              { n: "letter", v: "'В'", ref: null, ch: false },
              { n: "digit", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Python вычисляет `value * base + digit` → `11`, и `value` получает это значение. Прежнее значение `3` больше не связано с `value`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "11", ref: null, ch: true },
              { n: "letter", v: "'В'", ref: null, ch: false },
              { n: "digit", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт следующее значение: `letter` = `'Б'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "11", ref: null, ch: false },
              { n: "letter", v: "'Б'", ref: null, ch: true },
              { n: "digit", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `alphabet.index(letter)` → `1`, и `digit` получает это значение. Прежнее значение `2` больше не связано с `digit`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "11", ref: null, ch: false },
              { n: "letter", v: "'Б'", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Python вычисляет `value * base + digit` → `34`, и `value` получает это значение. Прежнее значение `11` больше не связано с `value`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "34", ref: null, ch: true },
              { n: "letter", v: "'Б'", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "34", ref: null, ch: false },
              { n: "letter", v: "'Б'", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 9,
        text: "На экран выводится «35».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "word", v: "'БАВБ'", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "34", ref: null, ch: false },
              { n: "letter", v: "'Б'", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "35\n",
      },
    ],
  },
  runWordByNumber: {
    kind: "run",
    code: "alphabet = 'АБВ'\nlength = 4\nnumber = 50\nbase = len(alphabet)\nvalue = number - 1\nword = ''\nfor i in range(length):\n    digit = value % base\n    word = alphabet[digit] + word\n    value = value // base\n\nprint(word)",
    fileName: "word_by_number.py",
    output: "БВББ",
    steps: [
      {
        line: null,
        text: "Программа ещё не запущена.",
        kind: "start",
        frames: [{ title: "программа", names: [] }],
        objs: {},
        out: "",
      },
      {
        line: 1,
        text: "`alphabet` получает значение `'АБВ'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "alphabet", v: "'АБВ'", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`length` получает значение `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`number` получает значение `50`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `len(alphabet)` → `3`, и `base` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `number - 1` → `49`, и `value` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "49", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "`word` получает значение `''`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "49", ref: null, ch: false },
              { n: "word", v: "''", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`for` берёт первое значение: `i` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "49", ref: null, ch: false },
              { n: "word", v: "''", ref: null, ch: false },
              { n: "i", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "Python вычисляет `value % base` → `1`, и `digit` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "49", ref: null, ch: false },
              { n: "word", v: "''", ref: null, ch: false },
              { n: "i", v: "0", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 9,
        text: "Python вычисляет `alphabet[digit] + word` → `'Б'`, и `word` получает это значение. Прежнее значение `''` больше не связано с `word`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "49", ref: null, ch: false },
              { n: "word", v: "'Б'", ref: null, ch: true },
              { n: "i", v: "0", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `value // base` → `16`, и `value` получает это значение. Прежнее значение `49` больше не связано с `value`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "16", ref: null, ch: true },
              { n: "word", v: "'Б'", ref: null, ch: false },
              { n: "i", v: "0", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`for` берёт следующее значение: `i` = `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "16", ref: null, ch: false },
              { n: "word", v: "'Б'", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: true },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "Python вычисляет `value % base` → `1`, и `digit` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "16", ref: null, ch: false },
              { n: "word", v: "'Б'", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 9,
        text: "Python вычисляет `alphabet[digit] + word` → `'ББ'`, и `word` получает это значение. Прежнее значение `'Б'` больше не связано с `word`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "16", ref: null, ch: false },
              { n: "word", v: "'ББ'", ref: null, ch: true },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `value // base` → `5`, и `value` получает это значение. Прежнее значение `16` больше не связано с `value`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "5", ref: null, ch: true },
              { n: "word", v: "'ББ'", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`for` берёт следующее значение: `i` = `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "5", ref: null, ch: false },
              { n: "word", v: "'ББ'", ref: null, ch: false },
              { n: "i", v: "2", ref: null, ch: true },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "Python вычисляет `value % base` → `2`, и `digit` получает это значение. Прежнее значение `1` больше не связано с `digit`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "5", ref: null, ch: false },
              { n: "word", v: "'ББ'", ref: null, ch: false },
              { n: "i", v: "2", ref: null, ch: false },
              { n: "digit", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 9,
        text: "Python вычисляет `alphabet[digit] + word` → `'ВББ'`, и `word` получает это значение. Прежнее значение `'ББ'` больше не связано с `word`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "5", ref: null, ch: false },
              { n: "word", v: "'ВББ'", ref: null, ch: true },
              { n: "i", v: "2", ref: null, ch: false },
              { n: "digit", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `value // base` → `1`, и `value` получает это значение. Прежнее значение `5` больше не связано с `value`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "1", ref: null, ch: true },
              { n: "word", v: "'ВББ'", ref: null, ch: false },
              { n: "i", v: "2", ref: null, ch: false },
              { n: "digit", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`for` берёт следующее значение: `i` = `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "1", ref: null, ch: false },
              { n: "word", v: "'ВББ'", ref: null, ch: false },
              { n: "i", v: "3", ref: null, ch: true },
              { n: "digit", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "Python вычисляет `value % base` → `1`, и `digit` получает это значение. Прежнее значение `2` больше не связано с `digit`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "1", ref: null, ch: false },
              { n: "word", v: "'ВББ'", ref: null, ch: false },
              { n: "i", v: "3", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 9,
        text: "Python вычисляет `alphabet[digit] + word` → `'БВББ'`, и `word` получает это значение. Прежнее значение `'ВББ'` больше не связано с `word`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "1", ref: null, ch: false },
              { n: "word", v: "'БВББ'", ref: null, ch: true },
              { n: "i", v: "3", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `value // base` → `0`, и `value` получает это значение. Прежнее значение `1` больше не связано с `value`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "0", ref: null, ch: true },
              { n: "word", v: "'БВББ'", ref: null, ch: false },
              { n: "i", v: "3", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "0", ref: null, ch: false },
              { n: "word", v: "'БВББ'", ref: null, ch: false },
              { n: "i", v: "3", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 12,
        text: "На экран выводится «БВББ».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "alphabet", v: "'АБВ'", ref: null, ch: false },
              { n: "length", v: "4", ref: null, ch: false },
              { n: "number", v: "50", ref: null, ch: false },
              { n: "base", v: "3", ref: null, ch: false },
              { n: "value", v: "0", ref: null, ch: false },
              { n: "word", v: "'БВББ'", ref: null, ch: false },
              { n: "i", v: "3", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "БВББ\n",
      },
    ],
  },
  runLast: {
    kind: "run",
    code: "from itertools import product\n\nlast_number = None\nfor number, letters in enumerate(\n        product('АБ', repeat=2), start=1):\n    word = ''.join(letters)\n    if word.count('А') == 1:\n        last_number = number\n\nprint(last_number)",
    fileName: "last.py",
    output: "3",
    steps: [
      {
        line: null,
        text: "Программа ещё не запущена.",
        kind: "start",
        frames: [{ title: "программа", names: [] }],
        objs: {},
        out: "",
      },
      {
        line: 1,
        text: "`product` = `функция`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "product", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`last_number` получает значение `None`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "None", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "None", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Строка выполнена.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "None", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`for` берёт первое значение: `(number, letters)` = `(1, ('А', 'А'))`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "None", ref: null, ch: false },
              { n: "number", v: "1", ref: null, ch: true },
              { n: "letters", v: "('А', 'А')", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `''.join(letters)` → `'АА'`, и `word` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "None", ref: null, ch: false },
              { n: "number", v: "1", ref: null, ch: false },
              { n: "letters", v: "('А', 'А')", ref: null, ch: false },
              { n: "word", v: "'АА'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Проверка `word.count('А') == 1` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "None", ref: null, ch: false },
              { n: "number", v: "1", ref: null, ch: false },
              { n: "letters", v: "('А', 'А')", ref: null, ch: false },
              { n: "word", v: "'АА'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`for` берёт следующее значение: `(number, letters)` = `(2, ('А', 'Б'))`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "None", ref: null, ch: false },
              { n: "number", v: "2", ref: null, ch: true },
              { n: "letters", v: "('А', 'Б')", ref: null, ch: true },
              { n: "word", v: "'АА'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `''.join(letters)` → `'АБ'`, и `word` получает это значение. Прежнее значение `'АА'` больше не связано с `word`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "None", ref: null, ch: false },
              { n: "number", v: "2", ref: null, ch: false },
              { n: "letters", v: "('А', 'Б')", ref: null, ch: false },
              { n: "word", v: "'АБ'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Проверка `word.count('А') == 1` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "None", ref: null, ch: false },
              { n: "number", v: "2", ref: null, ch: false },
              { n: "letters", v: "('А', 'Б')", ref: null, ch: false },
              { n: "word", v: "'АБ'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "`last_number` получает то же, что `number`: теперь оба имени ведут к `2`. Прежнее значение `None` больше не связано с `last_number`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "2", ref: null, ch: true },
              { n: "number", v: "2", ref: null, ch: false },
              { n: "letters", v: "('А', 'Б')", ref: null, ch: false },
              { n: "word", v: "'АБ'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`for` берёт следующее значение: `(number, letters)` = `(3, ('Б', 'А'))`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "2", ref: null, ch: false },
              { n: "number", v: "3", ref: null, ch: true },
              { n: "letters", v: "('Б', 'А')", ref: null, ch: true },
              { n: "word", v: "'АБ'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `''.join(letters)` → `'БА'`, и `word` получает это значение. Прежнее значение `'АБ'` больше не связано с `word`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "2", ref: null, ch: false },
              { n: "number", v: "3", ref: null, ch: false },
              { n: "letters", v: "('Б', 'А')", ref: null, ch: false },
              { n: "word", v: "'БА'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Проверка `word.count('А') == 1` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "2", ref: null, ch: false },
              { n: "number", v: "3", ref: null, ch: false },
              { n: "letters", v: "('Б', 'А')", ref: null, ch: false },
              { n: "word", v: "'БА'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "`last_number` получает то же, что `number`: теперь оба имени ведут к `3`. Прежнее значение `2` больше не связано с `last_number`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "3", ref: null, ch: true },
              { n: "number", v: "3", ref: null, ch: false },
              { n: "letters", v: "('Б', 'А')", ref: null, ch: false },
              { n: "word", v: "'БА'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`for` берёт следующее значение: `(number, letters)` = `(4, ('Б', 'Б'))`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "3", ref: null, ch: false },
              { n: "number", v: "4", ref: null, ch: true },
              { n: "letters", v: "('Б', 'Б')", ref: null, ch: true },
              { n: "word", v: "'БА'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `''.join(letters)` → `'ББ'`, и `word` получает это значение. Прежнее значение `'БА'` больше не связано с `word`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "3", ref: null, ch: false },
              { n: "number", v: "4", ref: null, ch: false },
              { n: "letters", v: "('Б', 'Б')", ref: null, ch: false },
              { n: "word", v: "'ББ'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Проверка `word.count('А') == 1` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "3", ref: null, ch: false },
              { n: "number", v: "4", ref: null, ch: false },
              { n: "letters", v: "('Б', 'Б')", ref: null, ch: false },
              { n: "word", v: "'ББ'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "3", ref: null, ch: false },
              { n: "number", v: "4", ref: null, ch: false },
              { n: "letters", v: "('Б', 'Б')", ref: null, ch: false },
              { n: "word", v: "'ББ'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "На экран выводится «3».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "product", v: "функция", ref: null, ch: false },
              { n: "last_number", v: "3", ref: null, ch: false },
              { n: "number", v: "4", ref: null, ch: false },
              { n: "letters", v: "('Б', 'Б')", ref: null, ch: false },
              { n: "word", v: "'ББ'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "3\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
