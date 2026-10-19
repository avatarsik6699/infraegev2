// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%lt_ops(['A ∧ B', 'A ∨ B', 'A → B', 'A ≡ B'])%%
  ltOps_c5dd45: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 220"><text x="90.0" y="28.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><text x="186.0" y="28.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><text x="282.0" y="28.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A ∧ B</text><text x="378.0" y="28.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A ∨ B</text><text x="474.0" y="28.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A → B</text><text x="570.0" y="28.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A ≡ B</text><line x1="234.0" y1="10" x2="234.0" y2="212" stroke="#d9d9d4" stroke-width="1"/><rect x="42.0" y="44.0" width="576.0" height="36" rx="4" fill="#fff"/><text x="90.0" y="68.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="186.0" y="68.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="282.0" y="68.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="378.0" y="68.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="474.0" y="68.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="570.0" y="68.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="42.0" y="84.0" width="576.0" height="36" rx="4" fill="#f3f3f1"/><text x="90.0" y="108.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="186.0" y="108.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="282.0" y="108.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="378.0" y="108.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="474.0" y="108.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="570.0" y="108.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="42.0" y="124.0" width="576.0" height="36" rx="4" fill="#fff"/><text x="90.0" y="148.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="186.0" y="148.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="282.0" y="148.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="378.0" y="148.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="474.0" y="148.0" font-family="inherit" font-size="16" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="570.0" y="148.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="42.0" y="164.0" width="576.0" height="36" rx="4" fill="#f3f3f1"/><text x="90.0" y="188.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="186.0" y="188.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="282.0" y="188.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="378.0" y="188.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="474.0" y="188.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="570.0" y="188.0" font-family="inherit" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text></svg>',
    width: 660,
    height: 220,
    alt: "Значения операций",
  },
  // %%lt_tree('((¬x ∨ y) → z) ≡ (x ∧ w)', {'x': 1, 'y': 0, 'z': 0, 'w': 1})%%
  ltTreexyzxw_x1y0z0w1: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 308"><line x1="98.0" y1="258.0" x2="156.0" y2="192.0" stroke="#d9d9d4" stroke-width="1.6"/><line x1="214.0" y1="258.0" x2="156.0" y2="192.0" stroke="#d9d9d4" stroke-width="1.6"/><line x1="156.0" y1="192.0" x2="243.0" y2="126.0" stroke="#d9d9d4" stroke-width="1.6"/><line x1="330.0" y1="192.0" x2="243.0" y2="126.0" stroke="#d9d9d4" stroke-width="1.6"/><line x1="243.0" y1="126.0" x2="373.5" y2="60.0" stroke="#d9d9d4" stroke-width="1.6"/><line x1="446.0" y1="192.0" x2="504.0" y2="126.0" stroke="#d9d9d4" stroke-width="1.6"/><line x1="562.0" y1="192.0" x2="504.0" y2="126.0" stroke="#d9d9d4" stroke-width="1.6"/><line x1="504.0" y1="126.0" x2="373.5" y2="60.0" stroke="#d9d9d4" stroke-width="1.6"/><rect x="78.0" y="241.0" width="40.0" height="34" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="98.0" y="263.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">¬x</text><text x="124.0" y="263.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 0</text><rect x="197.0" y="241.0" width="34.0" height="34" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="214.0" y="263.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">y</text><text x="237.0" y="263.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 0</text><rect x="139.0" y="175.0" width="34.0" height="34" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="156.0" y="197.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">∨</text><text x="179.0" y="197.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 0</text><rect x="313.0" y="175.0" width="34.0" height="34" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="330.0" y="197.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">z</text><text x="353.0" y="197.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 0</text><rect x="226.0" y="109.0" width="34.0" height="34" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="243.0" y="131.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">→</text><text x="266.0" y="131.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 1</text><rect x="429.0" y="175.0" width="34.0" height="34" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="446.0" y="197.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">x</text><text x="469.0" y="197.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 1</text><rect x="545.0" y="175.0" width="34.0" height="34" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="562.0" y="197.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">w</text><text x="585.0" y="197.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 1</text><rect x="487.0" y="109.0" width="34.0" height="34" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="504.0" y="131.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">∧</text><text x="527.0" y="131.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 1</text><rect x="356.5" y="43.0" width="34.0" height="34" rx="8" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="373.5" y="65.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">≡</text><text x="396.5" y="65.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 1</text><text x="330.0" y="296.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">x = 1, y = 0, z = 0, w = 1</text></svg>',
    width: 660,
    height: 308,
    alt: "Дерево формулы ((¬x ∨ y) → z) ≡ (x ∧ w)",
  },
  // %%lt_cases('(x ∨ y) ∧ (x → z)', 'x', 1)%%
  ltCasesxyxz_x_1: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="330.0" y="24.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F = (x ∨ y) ∧ (x → z) = 1</text><rect x="30.0" y="44" width="270.0" height="136" rx="10" fill="#f3f3f1" stroke="#d9d9d4"/><text x="46.0" y="72.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">x = 0</text><text x="46.0" y="100.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">y = 1, z любое</text><text x="46.0" y="140.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">наборы xyz:</text><text x="46.0" y="166.0" font-family="inherit" font-size="17" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">010, 011</text><rect x="360.0" y="44" width="270.0" height="136" rx="10" fill="#f3f3f1" stroke="#d9d9d4"/><text x="376.0" y="72.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">x = 1</text><text x="376.0" y="100.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">z = 1, y любое</text><text x="376.0" y="140.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">наборы xyz:</text><text x="376.0" y="166.0" font-family="inherit" font-size="17" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">101, 111</text></svg>',
    width: 660,
    height: 200,
    alt: "Разбор по x",
  },
  // %%lt_rows('(x ∨ y) ∧ (x → z)', 'xzy', ['**0', '**0', '011'])%%
  ltRowsxyxz_xzy: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 248"><text x="110.0" y="26.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">строки, столбцы x z y</text><text x="530.0" y="26.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">подходящие наборы</text><line x1="190" y1="77.0" x2="460" y2="123.0" stroke="#ff6a00" stroke-width="2.2"/><line x1="190" y1="123.0" x2="460" y2="123.0" stroke="#ff6a00" stroke-width="2.2"/><line x1="190" y1="169.0" x2="460" y2="77.0" stroke="#4d535e" stroke-width="1.2"/><rect x="40" y="60" width="150" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="115.0" y="83.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">* * 0  F=1</text><rect x="40" y="106" width="150" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="115.0" y="129.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">* * 0  F=1</text><rect x="40" y="152" width="150" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="115.0" y="175.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0 1 1  F=1</text><rect x="460" y="60" width="140" height="34" rx="6" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1"/><text x="530.0" y="83.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0 1 1</text><rect x="460" y="106" width="140" height="34" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="530.0" y="129.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1 1 0</text><text x="330.0" y="232.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">двум строкам достаётся один и тот же набор — порядок не подходит</text></svg>',
    width: 660,
    height: 248,
    alt: "Порядок xzy",
  },
  // %%lt_rows('(x ∨ y) ∧ (x → z)', 'yzx', ['**0', '**0', '011'])%%
  ltRowsxyxz_yzx: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 248"><text x="110.0" y="26.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">строки, столбцы y z x</text><text x="530.0" y="26.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">подходящие наборы</text><line x1="190" y1="77.0" x2="460" y2="123.0" stroke="#4d535e" stroke-width="1.2"/><line x1="190" y1="77.0" x2="460" y2="169.0" stroke="#4d535e" stroke-width="1.2"/><line x1="190" y1="123.0" x2="460" y2="123.0" stroke="#4d535e" stroke-width="1.2"/><line x1="190" y1="123.0" x2="460" y2="169.0" stroke="#4d535e" stroke-width="1.2"/><line x1="190" y1="169.0" x2="460" y2="77.0" stroke="#4d535e" stroke-width="1.2"/><rect x="40" y="60" width="150" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="115.0" y="83.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">* * 0  F=1</text><rect x="40" y="106" width="150" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="115.0" y="129.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">* * 0  F=1</text><rect x="40" y="152" width="150" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="115.0" y="175.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0 1 1  F=1</text><rect x="460" y="60" width="140" height="34" rx="6" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1"/><text x="530.0" y="83.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0 1 1</text><rect x="460" y="106" width="140" height="34" rx="6" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1"/><text x="530.0" y="129.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1 0 0</text><rect x="460" y="152" width="140" height="34" rx="6" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1"/><text x="530.0" y="175.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1 1 0</text><text x="330.0" y="232.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">каждой строке можно выбрать свой набор</text></svg>',
    width: 660,
    height: 248,
    alt: "Порядок yzx",
  },
  // %%lt_chain('xyzw', ['0*1*', '10*0', '*011'])%%
  ltChainxyzw: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="55.0" y="34.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">x</text><text x="85.0" y="34.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">y</text><text x="115.0" y="34.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">z</text><text x="145.0" y="34.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">w</text><rect x="40" y="46" width="30" height="30" fill="#fff" stroke="#d9d9d4"/><text x="55.0" y="66.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="70" y="46" width="30" height="30" fill="#fff" stroke="#d9d9d4"/><text x="85.0" y="66.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="100" y="46" width="30" height="30" fill="#fff" stroke="#d9d9d4"/><text x="115.0" y="66.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="130" y="46" width="30" height="30" fill="#fff" stroke="#d9d9d4"/><text x="145.0" y="66.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="40" y="76" width="30" height="30" fill="#fff" stroke="#d9d9d4"/><text x="55.0" y="96.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="70" y="76" width="30" height="30" fill="#fff" stroke="#d9d9d4"/><text x="85.0" y="96.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="100" y="76" width="30" height="30" fill="#fff" stroke="#d9d9d4"/><text x="115.0" y="96.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="130" y="76" width="30" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="145.0" y="96.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="40" y="106" width="30" height="30" fill="#fff" stroke="#d9d9d4"/><text x="55.0" y="126.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="70" y="106" width="30" height="30" fill="#fff" stroke="#d9d9d4"/><text x="85.0" y="126.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="100" y="106" width="30" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="115.0" y="126.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="130" y="106" width="30" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="145.0" y="126.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="40" y="136" width="30" height="30" fill="#fff" stroke="#d9d9d4"/><text x="55.0" y="156.0" font-family="inherit" font-size="15" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="70" y="136" width="30" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="85.0" y="156.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="100" y="136" width="30" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="115.0" y="156.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="130" y="136" width="30" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="145.0" y="156.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="40" y="166" width="30" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="55.0" y="186.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="70" y="166" width="30" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="85.0" y="186.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="100" y="166" width="30" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="115.0" y="186.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="130" y="166" width="30" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="145.0" y="186.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="40.0" y="222.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">после первой 1 — только 1</text><text x="230.0" y="34.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">порядок столбцов вдоль цепочки</text><rect x="230.0" y="62" width="82.0" height="36" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="271.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C2</text><text x="271.0" y="122.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">= x</text><rect x="330.0" y="62" width="82.0" height="36" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="371.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C4</text><text x="371.0" y="122.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">= y</text><text x="321.0" y="86.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">→</text><rect x="430.0" y="62" width="82.0" height="36" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="471.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C1</text><text x="471.0" y="122.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">= z</text><text x="421.0" y="86.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">→</text><rect x="530.0" y="62" width="82.0" height="36" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="571.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C3</text><text x="571.0" y="122.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">= w</text><text x="521.0" y="86.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">→</text><text x="230.0" y="154.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">строка 1: C1 раньше C3</text><text x="230.0" y="176.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">строка 2: C2 раньше C1, C4 раньше C1</text><text x="230.0" y="198.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">строка 3: C2 раньше C3, C2 раньше C4</text></svg>',
    width: 660,
    height: 230,
    alt: "Цепочка импликаций",
  },
  runPairs: {
    kind: "run",
    code: "for a in (0, 1):\n    for b in (0, 1):\n        print(a, b, int((not a) or b))",
    fileName: "pairs.py",
    output: "0 0 1\n0 1 1\n1 0 0\n1 1 1",
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
        text: "`for` берёт первое значение: `a` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "a", v: "0", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`for` берёт первое значение: `b` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "0", ref: null, ch: false },
              { n: "b", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "На экран выводится «0 0 1».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "0", ref: null, ch: false },
              { n: "b", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0 1\n",
      },
      {
        line: 2,
        text: "`for` берёт следующее значение: `b` = `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "0", ref: null, ch: false },
              { n: "b", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "0 0 1\n",
      },
      {
        line: 3,
        text: "На экран выводится «0 1 1».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "0", ref: null, ch: false },
              { n: "b", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0 1\n0 1 1\n",
      },
      {
        line: 2,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "0", ref: null, ch: false },
              { n: "b", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0 1\n0 1 1\n",
      },
      {
        line: 1,
        text: "`for` берёт следующее значение: `a` = `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "1", ref: null, ch: true },
              { n: "b", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0 1\n0 1 1\n",
      },
      {
        line: 2,
        text: "`for` берёт первое значение: `b` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "1", ref: null, ch: false },
              { n: "b", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "0 0 1\n0 1 1\n",
      },
      {
        line: 3,
        text: "На экран выводится «1 0 0».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "1", ref: null, ch: false },
              { n: "b", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0 1\n0 1 1\n1 0 0\n",
      },
      {
        line: 2,
        text: "`for` берёт следующее значение: `b` = `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "1", ref: null, ch: false },
              { n: "b", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "0 0 1\n0 1 1\n1 0 0\n",
      },
      {
        line: 3,
        text: "На экран выводится «1 1 1».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "1", ref: null, ch: false },
              { n: "b", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0 1\n0 1 1\n1 0 0\n1 1 1\n",
      },
      {
        line: 2,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "1", ref: null, ch: false },
              { n: "b", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0 1\n0 1 1\n1 0 0\n1 1 1\n",
      },
      {
        line: 1,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "1", ref: null, ch: false },
              { n: "b", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0 1\n0 1 1\n1 0 0\n1 1 1\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
