// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%ip_bits("192.168.10.173", 26)%%
  ipBits19216810173_26: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 142"><text x="82.0" y="40.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">адрес</text><text x="157.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">192</text><text x="299.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">168</text><text x="440.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="582.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">173</text><rect x="92.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="124.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="141.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="157.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="174.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="190.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="207.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="233.5" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="249.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="266.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="282.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="299.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="315.7" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="332.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="348.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="375.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="391.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="407.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="424.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="440.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="457.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="473.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="490.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="516.5" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="532.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="549.4" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="565.8" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="582.2" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="598.7" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="615.1" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="631.6" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><text x="82.0" y="86.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">маска</text><text x="157.8" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">255</text><text x="299.2" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">255</text><text x="440.8" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">255</text><text x="582.2" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">192</text><rect x="92.0" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="124.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="141.3" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="157.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="174.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="190.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="207.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="233.5" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="249.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="266.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="282.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="299.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="315.7" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="332.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="348.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="375.0" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="391.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="407.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="424.3" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="440.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="457.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="473.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="490.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="516.5" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="532.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="549.4" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="565.8" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="582.2" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="598.7" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="615.1" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="631.6" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><line x1="549.4" y1="22.0" x2="549.4" y2="112.0" stroke="#ff6a00" stroke-width="2.5"/><text x="92.0" y="132.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">сеть: 26 бит</text><text x="648.0" y="132.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">узел: 6 бит</text><line x1="92.0" y1="118.0" x2="545.4" y2="118.0" stroke="#4d535e" stroke-width="1.2"/><line x1="553.4" y1="118.0" x2="648.0" y2="118.0" stroke="#4d535e" stroke-width="1.2"/></svg>',
    width: 660,
    height: 142,
    alt: "Адрес 192.168.10.173 и маска /26: 32 бита, граница после 26 бит",
  },
  // %%ip_and("192.168.10.173", 26)%%
  ipAnd19216810173_26: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 188"><text x="82.0" y="40.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">адрес</text><text x="157.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">192</text><text x="299.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">168</text><text x="440.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="582.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">173</text><rect x="92.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="124.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="141.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="157.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="174.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="190.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="207.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="233.5" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="249.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="266.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="282.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="299.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="315.7" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="332.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="348.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="375.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="391.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="407.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="424.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="440.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="457.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="473.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="490.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="516.5" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="532.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="549.4" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="565.8" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="582.2" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="598.7" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="615.1" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="631.6" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><text x="82.0" y="86.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">маска</text><text x="157.8" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">255</text><text x="299.2" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">255</text><text x="440.8" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">255</text><text x="582.2" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">192</text><rect x="92.0" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="124.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="141.3" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="157.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="174.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="190.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="207.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="233.5" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="249.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="266.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="282.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="299.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="315.7" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="332.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="348.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="375.0" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="391.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="407.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="424.3" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="440.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="457.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="473.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="490.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="516.5" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="532.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="549.4" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="565.8" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="582.2" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="598.7" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="615.1" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="631.6" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><text x="82.0" y="132.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">«И»</text><text x="157.8" y="112.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">192</text><text x="299.2" y="112.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">168</text><text x="440.8" y="112.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="582.2" y="112.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">128</text><rect x="92.0" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">1</text><rect x="124.9" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="141.3" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="157.8" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="174.2" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="190.6" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="207.1" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="233.5" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">1</text><rect x="249.9" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="266.4" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">1</text><rect x="282.8" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="299.2" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">1</text><rect x="315.7" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="332.1" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="348.6" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="375.0" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="391.4" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="407.9" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="424.3" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="440.8" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">1</text><rect x="457.2" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="473.6" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">1</text><rect x="490.1" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="516.5" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">1</text><rect x="532.9" y="118.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="549.4" y="118.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="565.8" y="118.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="582.2" y="118.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="598.7" y="118.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="615.1" y="118.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><rect x="631.6" y="118.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="134.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle">0</text><line x1="92.0" y1="97.0" x2="648.0" y2="97.0" stroke="#4d535e" stroke-width="1"/><line x1="549.4" y1="22.0" x2="549.4" y2="158.0" stroke="#ff6a00" stroke-width="2.5"/><text x="92.0" y="178.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">сеть: 26 бит</text><text x="648.0" y="178.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">узел: 6 бит</text><line x1="92.0" y1="164.0" x2="545.4" y2="164.0" stroke="#4d535e" stroke-width="1.2"/><line x1="553.4" y1="164.0" x2="648.0" y2="164.0" stroke="#4d535e" stroke-width="1.2"/></svg>',
    width: 660,
    height: 188,
    alt: "192.168.10.173 И маска /26 = 192.168.10.128",
  },
  // %%ip_bits("172.20.77.140", 22)%%
  ipBits1722077140_22: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 142"><text x="82.0" y="40.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">адрес</text><text x="157.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">172</text><text x="299.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><text x="440.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">77</text><text x="582.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">140</text><rect x="92.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="124.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="141.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="157.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="174.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="190.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="207.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="233.5" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="249.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="266.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="282.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="299.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="315.7" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="332.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="348.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="375.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="391.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="407.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="424.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="440.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="457.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="473.6" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="490.1" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="516.5" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="532.9" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="549.4" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="565.8" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="582.2" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="598.7" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="615.1" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="631.6" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><text x="82.0" y="86.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">маска</text><text x="157.8" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">255</text><text x="299.2" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">255</text><text x="440.8" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">252</text><text x="582.2" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="92.0" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="124.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="141.3" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="157.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="174.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="190.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="207.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="233.5" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="249.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="266.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="282.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="299.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="315.7" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="332.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="348.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="375.0" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="391.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="407.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="424.3" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="440.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="457.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="473.6" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="490.1" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="516.5" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="532.9" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="549.4" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="565.8" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="582.2" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="598.7" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="615.1" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="631.6" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><line x1="473.6" y1="22.0" x2="473.6" y2="112.0" stroke="#ff6a00" stroke-width="2.5"/><text x="92.0" y="132.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">сеть: 22 бит</text><text x="648.0" y="132.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">узел: 10 бит</text><line x1="92.0" y1="118.0" x2="469.6" y2="118.0" stroke="#4d535e" stroke-width="1.2"/><line x1="477.6" y1="118.0" x2="648.0" y2="118.0" stroke="#4d535e" stroke-width="1.2"/></svg>',
    width: 660,
    height: 142,
    alt: "Адрес 172.20.77.140 и маска /22: 32 бита, граница после 22 бит",
  },
  // %%ip_blocks(252, 77)%%
  ipBlocks252_77: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 178"><text x="16.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">октет маски 252: блоки по 256 − 252 = 4</text><rect x="233.3" y="80.0" width="96.7" height="32.0" fill="#f3f3f1" stroke="#17191e" stroke-width="1.5"/><line x1="40.0" y1="96.0" x2="620.0" y2="96.0" stroke="#17191e" stroke-width="1.5"/><line x1="40.0" y1="80.0" x2="40.0" y2="112.0" stroke="#4d535e" stroke-width="1.2"/><text x="40.0" y="130.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">68</text><line x1="136.7" y1="80.0" x2="136.7" y2="112.0" stroke="#4d535e" stroke-width="1.2"/><text x="136.7" y="130.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">72</text><line x1="233.3" y1="80.0" x2="233.3" y2="112.0" stroke="#17191e" stroke-width="1.2"/><text x="233.3" y="130.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">76</text><line x1="330.0" y1="80.0" x2="330.0" y2="112.0" stroke="#17191e" stroke-width="1.2"/><text x="330.0" y="130.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">80</text><line x1="426.7" y1="80.0" x2="426.7" y2="112.0" stroke="#4d535e" stroke-width="1.2"/><text x="426.7" y="130.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">84</text><line x1="523.3" y1="80.0" x2="523.3" y2="112.0" stroke="#4d535e" stroke-width="1.2"/><text x="523.3" y="130.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">88</text><line x1="620.0" y1="80.0" x2="620.0" y2="112.0" stroke="#4d535e" stroke-width="1.2"/><text x="620.0" y="130.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">92</text><text x="32.0" y="101.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">…</text><text x="628.0" y="101.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">…</text><line x1="269.6" y1="40.0" x2="269.6" y2="78.0" stroke="#ff6a00" stroke-width="2"/><text x="269.6" y="34.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">77</text><text x="330.0" y="166.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">77 = 19 · 4 + 1: начало блока 76, конец 79</text></svg>',
    width: 660,
    height: 178,
    alt: "Значения октета блоками по 4: 77 в блоке 76–79",
  },
  // %%ip_grid("172.20.77.140", 22)%%
  ipGrid1722077140_22: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 228"><text x="16.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">сеть 172.20.76.0/22: 4 · 256 = 1024 адресов</text><text x="111.0" y="44.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="366.0" y="44.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">128</text><text x="619.0" y="44.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">255</text><text x="100.0" y="72.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">172.20.76.</text><rect x="110.0" y="58.0" width="510.0" height="20.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.0" y="106.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">172.20.77.</text><rect x="110.0" y="92.0" width="510.0" height="20.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.0" y="140.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">172.20.78.</text><rect x="110.0" y="126.0" width="510.0" height="20.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.0" y="174.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">172.20.79.</text><rect x="110.0" y="160.0" width="510.0" height="20.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><rect x="109.0" y="58.0" width="3.0" height="20.0" fill="#17191e" stroke="#17191e" stroke-width="1.0"/><text x="118.0" y="73.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">адрес сети</text><rect x="617.0" y="160.0" width="3.0" height="20.0" fill="#17191e" stroke="#17191e" stroke-width="1.0"/><text x="612.0" y="175.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">широковещательный</text><line x1="389.9" y1="90.0" x2="389.9" y2="114.0" stroke="#ff6a00" stroke-width="3"/><text x="397.9" y="107.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">172.20.77.140: номер 396</text><text x="330.0" y="214.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">номер = 1 · 256 + 140 = 396: строки выше дают по 256 адресов</text></svg>',
    width: 660,
    height: 228,
    alt: "Сеть 172.20.76.0/22: 4 строк по 256 адресов",
  },
  // %%ip_pair("172.20.174.93", "172.20.160.0")%%
  ipPair1722017493_172201600: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 174"><text x="82.0" y="40.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">адрес</text><text x="157.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">172</text><text x="299.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><text x="440.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">174</text><text x="582.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">93</text><rect x="92.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="124.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="141.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="157.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="174.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="190.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="207.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="233.5" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="249.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="266.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="282.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="299.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="315.7" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="332.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="348.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="375.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="391.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="407.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="424.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="440.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="457.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="473.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="490.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="516.5" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="532.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="549.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="565.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="582.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="598.7" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="615.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="631.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><text x="82.0" y="86.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">сеть</text><text x="157.8" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">172</text><text x="299.2" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><text x="440.8" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">160</text><text x="582.2" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="92.0" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="124.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="141.3" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="157.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="174.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="190.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="207.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="233.5" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="249.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="266.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="282.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="299.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="315.7" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="332.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="348.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="375.0" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="391.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="407.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="424.3" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="440.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="457.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="473.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="490.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="516.5" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="532.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="549.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="565.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="582.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="598.7" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="615.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="631.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="424.3" y="24.0" width="16.4" height="26.0" fill="none" stroke="#ff6a00" stroke-width="2.5"/><rect x="424.3" y="70.0" width="16.4" height="26.0" fill="none" stroke="#ff6a00" stroke-width="2.5"/><text x="424.3" y="118.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">L = 19</text><text x="440.8" y="136.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C = 20</text><text x="330.0" y="164.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">биты в рамке бывают и сетевыми, и узловыми: 19 ≤ p ≤ 20, маски /19, /20</text></svg>',
    width: 660,
    height: 174,
    alt: "172.20.174.93 и 172.20.160.0 по битам",
  },
  // %%ip_pair("172.20.74.10", "172.20.79.200", "two")%%
  ipPair172207410_1722079200_two: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 174"><text x="82.0" y="40.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">узел 1</text><text x="157.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">172</text><text x="299.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><text x="440.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">74</text><text x="582.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><rect x="92.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="124.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="141.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="157.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="174.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="190.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="207.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="233.5" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="249.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="266.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="282.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="299.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="315.7" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="332.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="348.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="375.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="391.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="407.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="424.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="440.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="457.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="473.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="490.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="516.5" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="532.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="549.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="565.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="582.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="598.7" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="615.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="631.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><text x="82.0" y="86.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">узел 2</text><text x="157.8" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">172</text><text x="299.2" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><text x="440.8" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">79</text><text x="582.2" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">200</text><rect x="92.0" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="124.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="141.3" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="157.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="174.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="190.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="207.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="233.5" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="249.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="266.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="282.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="299.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="315.7" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="332.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="348.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="375.0" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="391.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="407.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="424.3" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="440.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="457.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="473.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="490.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="516.5" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="532.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="549.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="565.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="582.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="598.7" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="615.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="631.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><line x1="457.2" y1="22.0" x2="457.2" y2="52.0" stroke="#ff6a00" stroke-width="2.5"/><line x1="457.2" y1="68.0" x2="457.2" y2="98.0" stroke="#ff6a00" stroke-width="2.5"/><text x="457.2" y="118.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C = 21</text><text x="330.0" y="150.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">первые 21 бит совпадают: одна сеть при p ≤ 21, разные при p &gt; 21</text></svg>',
    width: 660,
    height: 174,
    alt: "172.20.74.10 и 172.20.79.200 по битам",
  },
  // %%ip_bits("172.20.72.0", 21)%%
  ipBits17220720_21: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 142"><text x="82.0" y="40.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">адрес</text><text x="157.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">172</text><text x="299.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><text x="440.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">72</text><text x="582.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="92.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="124.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="141.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="157.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="174.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="190.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="207.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="233.5" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="249.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="266.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="282.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="299.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="315.7" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="332.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="348.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="375.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="391.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="407.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="424.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="440.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="457.2" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="473.6" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="490.1" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="516.5" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="532.9" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="549.4" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="565.8" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="582.2" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="598.7" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="615.1" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="631.6" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><text x="82.0" y="86.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">маска</text><text x="157.8" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">255</text><text x="299.2" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">255</text><text x="440.8" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">248</text><text x="582.2" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="92.0" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="124.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="141.3" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="157.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="174.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="190.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="207.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="233.5" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="249.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="266.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="282.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="299.2" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="315.7" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="332.1" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="348.6" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="375.0" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="391.4" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="407.9" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="424.3" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="440.8" y="72.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="457.2" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="473.6" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="490.1" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="516.5" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="532.9" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="549.4" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="565.8" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="582.2" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="598.7" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="615.1" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="631.6" y="72.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="88.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><line x1="457.2" y1="22.0" x2="457.2" y2="112.0" stroke="#ff6a00" stroke-width="2.5"/><text x="92.0" y="132.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">сеть: 21 бит</text><text x="648.0" y="132.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">узел: 11 бит</text><line x1="92.0" y1="118.0" x2="453.2" y2="118.0" stroke="#4d535e" stroke-width="1.2"/><line x1="461.2" y1="118.0" x2="648.0" y2="118.0" stroke="#4d535e" stroke-width="1.2"/></svg>',
    width: 660,
    height: 142,
    alt: "Адрес 172.20.72.0 и маска /21: 32 бита, граница после 21 бит",
  },
  // %%ip_bits("192.168.10.0", 28, False, True)%%
  ipBits192168100_28_False_True: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 124"><text x="82.0" y="40.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">адрес</text><text x="157.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">192</text><text x="299.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">168</text><text x="440.8" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="582.2" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="92.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="100.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="108.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="116.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="124.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="133.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="141.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="149.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="157.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="166.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="174.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="182.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="190.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="198.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="207.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="215.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="233.5" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="241.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="249.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="258.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="266.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="274.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="282.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="291.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="299.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="307.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="315.7" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="323.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="332.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="340.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="348.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="356.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="375.0" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="383.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="391.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="399.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="407.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="416.1" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="424.3" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="432.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="440.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="449.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="457.2" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="465.4" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="473.6" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="481.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">1</text><rect x="490.1" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="498.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="516.5" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="524.7" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="532.9" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="541.2" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="549.4" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="557.6" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="565.8" y="26.0" width="16.4" height="22.0" fill="#fff" stroke="#d9d9d4" stroke-width="1.0"/><text x="574.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#17191e" text-anchor="middle">0</text><rect x="582.2" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="590.5" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle">?</text><rect x="598.7" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="606.9" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle">?</text><rect x="615.1" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="623.3" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle">?</text><rect x="631.6" y="26.0" width="16.4" height="22.0" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.0"/><text x="639.8" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle">?</text><line x1="582.2" y1="22.0" x2="582.2" y2="66.0" stroke="#ff6a00" stroke-width="2.5"/><text x="92.0" y="86.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">сеть: 28 бит</text><text x="648.0" y="86.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">узел: 4 бит</text><line x1="92.0" y1="72.0" x2="578.2" y2="72.0" stroke="#4d535e" stroke-width="1.2"/><line x1="586.2" y1="72.0" x2="648.0" y2="72.0" stroke="#4d535e" stroke-width="1.2"/><text x="330.0" y="114.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">единиц в сетевой части: 7 у каждого адреса; свободных битов: 4</text></svg>',
    width: 660,
    height: 124,
    alt: "Адрес 192.168.10.0 и маска /28: 32 бита, граница после 28 бит",
  },
  // %%ip_pairs(4, 7)%%
  ipPairs4_7: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 216"><text x="16.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">пара отличается только последним битом: единиц в ней k и k + 1</text><rect x="24.0" y="34.0" width="306.0" height="26.0" fill="#f3f3f1" stroke="#f3f3f1" stroke-width="1.0"/><text x="54.0" y="52.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">0000</text><text x="90.0" y="52.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">7 — нечётно</text><text x="204.0" y="52.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">0001</text><text x="240.0" y="52.0" font-family="inherit" font-size="12" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">8 — чётно</text><rect x="24.0" y="64.0" width="306.0" height="26.0" fill="#f3f3f1" stroke="#f3f3f1" stroke-width="1.0"/><text x="54.0" y="82.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">0010</text><text x="90.0" y="82.0" font-family="inherit" font-size="12" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">8 — чётно</text><text x="204.0" y="82.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">0011</text><text x="240.0" y="82.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">9 — нечётно</text><rect x="24.0" y="94.0" width="306.0" height="26.0" fill="#f3f3f1" stroke="#f3f3f1" stroke-width="1.0"/><text x="54.0" y="112.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">0100</text><text x="90.0" y="112.0" font-family="inherit" font-size="12" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">8 — чётно</text><text x="204.0" y="112.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">0101</text><text x="240.0" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">9 — нечётно</text><rect x="24.0" y="124.0" width="306.0" height="26.0" fill="#f3f3f1" stroke="#f3f3f1" stroke-width="1.0"/><text x="54.0" y="142.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">0110</text><text x="90.0" y="142.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">9 — нечётно</text><text x="204.0" y="142.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">0111</text><text x="240.0" y="142.0" font-family="inherit" font-size="12" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">10 — чётно</text><rect x="340.0" y="34.0" width="306.0" height="26.0" fill="#f3f3f1" stroke="#f3f3f1" stroke-width="1.0"/><text x="370.0" y="52.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">1000</text><text x="406.0" y="52.0" font-family="inherit" font-size="12" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">8 — чётно</text><text x="520.0" y="52.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">1001</text><text x="556.0" y="52.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">9 — нечётно</text><rect x="340.0" y="64.0" width="306.0" height="26.0" fill="#f3f3f1" stroke="#f3f3f1" stroke-width="1.0"/><text x="370.0" y="82.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">1010</text><text x="406.0" y="82.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">9 — нечётно</text><text x="520.0" y="82.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">1011</text><text x="556.0" y="82.0" font-family="inherit" font-size="12" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">10 — чётно</text><rect x="340.0" y="94.0" width="306.0" height="26.0" fill="#f3f3f1" stroke="#f3f3f1" stroke-width="1.0"/><text x="370.0" y="112.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">1100</text><text x="406.0" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">9 — нечётно</text><text x="520.0" y="112.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">1101</text><text x="556.0" y="112.0" font-family="inherit" font-size="12" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">10 — чётно</text><rect x="340.0" y="124.0" width="306.0" height="26.0" fill="#f3f3f1" stroke="#f3f3f1" stroke-width="1.0"/><text x="370.0" y="142.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">1110</text><text x="406.0" y="142.0" font-family="inherit" font-size="12" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">10 — чётно</text><text x="520.0" y="142.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle">1111</text><text x="556.0" y="142.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">11 — нечётно</text><text x="330.0" y="198.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">в каждой паре ровно один адрес с чётным числом единиц: 8 из 16</text></svg>',
    width: 660,
    height: 216,
    alt: "16 вариантов 4 свободных битов парами",
  },
  runOctet: {
    kind: "run",
    code: "n = 173\nbits = ''\nfor w in [128, 64, 32, 16, 8, 4, 2, 1]:\n    bits += str(n // w)\n    n = n % w\nprint(bits)",
    fileName: "octet.py",
    output: "10101101",
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
        text: "`n` получает значение `173`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "n", v: "173", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`bits` получает значение `''`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "173", ref: null, ch: false },
              { n: "bits", v: "''", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт первое значение: `w` = `128`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "173", ref: null, ch: false },
              { n: "bits", v: "''", ref: null, ch: false },
              { n: "w", v: "128", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`bits += str(n // w)`: значение `bits` увеличилось — было `''`, стало `'1'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "173", ref: null, ch: false },
              { n: "bits", v: "'1'", ref: null, ch: true },
              { n: "w", v: "128", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `n % w` → `45`, и `n` получает это значение. Прежнее значение `173` больше не связано с `n`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "45", ref: null, ch: true },
              { n: "bits", v: "'1'", ref: null, ch: false },
              { n: "w", v: "128", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `w` = `64`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "45", ref: null, ch: false },
              { n: "bits", v: "'1'", ref: null, ch: false },
              { n: "w", v: "64", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`bits += str(n // w)`: значение `bits` увеличилось — было `'1'`, стало `'10'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "45", ref: null, ch: false },
              { n: "bits", v: "'10'", ref: null, ch: true },
              { n: "w", v: "64", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `n % w` → `45`, и `n` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "45", ref: null, ch: false },
              { n: "bits", v: "'10'", ref: null, ch: false },
              { n: "w", v: "64", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `w` = `32`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "45", ref: null, ch: false },
              { n: "bits", v: "'10'", ref: null, ch: false },
              { n: "w", v: "32", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`bits += str(n // w)`: значение `bits` увеличилось — было `'10'`, стало `'101'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "45", ref: null, ch: false },
              { n: "bits", v: "'101'", ref: null, ch: true },
              { n: "w", v: "32", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `n % w` → `13`, и `n` получает это значение. Прежнее значение `45` больше не связано с `n`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "13", ref: null, ch: true },
              { n: "bits", v: "'101'", ref: null, ch: false },
              { n: "w", v: "32", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `w` = `16`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "13", ref: null, ch: false },
              { n: "bits", v: "'101'", ref: null, ch: false },
              { n: "w", v: "16", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`bits += str(n // w)`: значение `bits` увеличилось — было `'101'`, стало `'1010'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "13", ref: null, ch: false },
              { n: "bits", v: "'1010'", ref: null, ch: true },
              { n: "w", v: "16", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `n % w` → `13`, и `n` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "13", ref: null, ch: false },
              { n: "bits", v: "'1010'", ref: null, ch: false },
              { n: "w", v: "16", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `w` = `8`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "13", ref: null, ch: false },
              { n: "bits", v: "'1010'", ref: null, ch: false },
              { n: "w", v: "8", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`bits += str(n // w)`: значение `bits` увеличилось — было `'1010'`, стало `'10101'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "13", ref: null, ch: false },
              { n: "bits", v: "'10101'", ref: null, ch: true },
              { n: "w", v: "8", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `n % w` → `5`, и `n` получает это значение. Прежнее значение `13` больше не связано с `n`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "5", ref: null, ch: true },
              { n: "bits", v: "'10101'", ref: null, ch: false },
              { n: "w", v: "8", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `w` = `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "5", ref: null, ch: false },
              { n: "bits", v: "'10101'", ref: null, ch: false },
              { n: "w", v: "4", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`bits += str(n // w)`: значение `bits` увеличилось — было `'10101'`, стало `'101011'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "5", ref: null, ch: false },
              { n: "bits", v: "'101011'", ref: null, ch: true },
              { n: "w", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `n % w` → `1`, и `n` получает это значение. Прежнее значение `5` больше не связано с `n`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "1", ref: null, ch: true },
              { n: "bits", v: "'101011'", ref: null, ch: false },
              { n: "w", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `w` = `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "1", ref: null, ch: false },
              { n: "bits", v: "'101011'", ref: null, ch: false },
              { n: "w", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`bits += str(n // w)`: значение `bits` увеличилось — было `'101011'`, стало `'1010110'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "1", ref: null, ch: false },
              { n: "bits", v: "'1010110'", ref: null, ch: true },
              { n: "w", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `n % w` → `1`, и `n` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "1", ref: null, ch: false },
              { n: "bits", v: "'1010110'", ref: null, ch: false },
              { n: "w", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `w` = `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "1", ref: null, ch: false },
              { n: "bits", v: "'1010110'", ref: null, ch: false },
              { n: "w", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`bits += str(n // w)`: значение `bits` увеличилось — было `'1010110'`, стало `'10101101'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "1", ref: null, ch: false },
              { n: "bits", v: "'10101101'", ref: null, ch: true },
              { n: "w", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `n % w` → `0`, и `n` получает это значение. Прежнее значение `1` больше не связано с `n`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "0", ref: null, ch: true },
              { n: "bits", v: "'10101101'", ref: null, ch: false },
              { n: "w", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "0", ref: null, ch: false },
              { n: "bits", v: "'10101101'", ref: null, ch: false },
              { n: "w", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "На экран выводится «10101101».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "n", v: "0", ref: null, ch: false },
              { n: "bits", v: "'10101101'", ref: null, ch: false },
              { n: "w", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "10101101\n",
      },
    ],
  },
  runHosts: {
    kind: "run",
    code: "need = 500\nh = 0\nwhile 2 ** h - 2 < need:\n    h += 1\nprint(h, 32 - h)",
    fileName: "hosts.py",
    output: "9 23",
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
        text: "`need` получает значение `500`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "need", v: "500", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`h` получает значение `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `2 ** h - 2 < need` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`h += 1`: значение `h` увеличилось — было `0`, стало `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `2 ** h - 2 < need` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`h += 1`: значение `h` увеличилось — было `1`, стало `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `2 ** h - 2 < need` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`h += 1`: значение `h` увеличилось — было `2`, стало `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "3", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `2 ** h - 2 < need` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "3", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`h += 1`: значение `h` увеличилось — было `3`, стало `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "4", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `2 ** h - 2 < need` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`h += 1`: значение `h` увеличилось — было `4`, стало `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "5", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `2 ** h - 2 < need` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "5", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`h += 1`: значение `h` увеличилось — было `5`, стало `6`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "6", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `2 ** h - 2 < need` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`h += 1`: значение `h` увеличилось — было `6`, стало `7`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "7", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `2 ** h - 2 < need` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`h += 1`: значение `h` увеличилось — было `7`, стало `8`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "8", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `2 ** h - 2 < need` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "8", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`h += 1`: значение `h` увеличилось — было `8`, стало `9`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "9", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `2 ** h - 2 < need` даёт `False` — цикл закончен, программа идёт дальше.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "9", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "На экран выводится «9 23».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "need", v: "500", ref: null, ch: false },
              { n: "h", v: "9", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "9 23\n",
      },
    ],
  },
  runMasks: {
    kind: "run",
    code: "from ipaddress import ip_address, ip_network\n\nexpected = ip_address('172.20.160.0')\nfound = []\nfor p in range(18, 22):\n    net = ip_network(f'172.20.174.93/{p}', strict=False)\n    if net.network_address == expected:\n        found.append(p)\nprint(found)",
    fileName: "masks.py",
    output: "[19, 20]",
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
        text: "`ip_address` = `функция`; `ip_network` = `функция`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: true },
              { n: "ip_network", v: "функция", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Python вычисляет `ip_address('172.20.160.0')` → `адрес 172.20.160.0`, и `expected` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`found` получает значение `[]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[]", ref: 0, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[]", ch: true } },
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт первое значение: `p` = `18`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[]", ref: 0, ch: false },
              { n: "p", v: "18", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `ip_network(f'172.20.174.93/{p}', strict=False)` → `сеть 172.20.128.0/18`, и `net` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[]", ref: 0, ch: false },
              { n: "p", v: "18", ref: null, ch: false },
              { n: "net", v: "сеть 172.20.128.0/18", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Проверка `net.network_address == expected` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[]", ref: 0, ch: false },
              { n: "p", v: "18", ref: null, ch: false },
              { n: "net", v: "сеть 172.20.128.0/18", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[]", ch: false } },
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт следующее значение: `p` = `19`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[]", ref: 0, ch: false },
              { n: "p", v: "19", ref: null, ch: true },
              { n: "net", v: "сеть 172.20.128.0/18", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `ip_network(f'172.20.174.93/{p}', strict=False)` → `сеть 172.20.160.0/19`, и `net` получает это значение. Прежнее значение `сеть 172.20.128.0/18` больше не связано с `net`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[]", ref: 0, ch: false },
              { n: "p", v: "19", ref: null, ch: false },
              { n: "net", v: "сеть 172.20.160.0/19", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Проверка `net.network_address == expected` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[]", ref: 0, ch: false },
              { n: "p", v: "19", ref: null, ch: false },
              { n: "net", v: "сеть 172.20.160.0/19", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[]", ch: false } },
        out: "",
      },
      {
        line: 8,
        text: "`found.append(p)` меняет сам список, к которому ведёт `found`; новый не создаётся.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[19]", ref: 0, ch: true },
              { n: "p", v: "19", ref: null, ch: false },
              { n: "net", v: "сеть 172.20.160.0/19", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[19]", ch: true } },
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт следующее значение: `p` = `20`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[19]", ref: 0, ch: false },
              { n: "p", v: "20", ref: null, ch: true },
              { n: "net", v: "сеть 172.20.160.0/19", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[19]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `ip_network(f'172.20.174.93/{p}', strict=False)` → `сеть 172.20.160.0/20`, и `net` получает это значение. Прежнее значение `сеть 172.20.160.0/19` больше не связано с `net`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[19]", ref: 0, ch: false },
              { n: "p", v: "20", ref: null, ch: false },
              { n: "net", v: "сеть 172.20.160.0/20", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[19]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Проверка `net.network_address == expected` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[19]", ref: 0, ch: false },
              { n: "p", v: "20", ref: null, ch: false },
              { n: "net", v: "сеть 172.20.160.0/20", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[19]", ch: false } },
        out: "",
      },
      {
        line: 8,
        text: "`found.append(p)` меняет сам список, к которому ведёт `found`; новый не создаётся.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[19, 20]", ref: 0, ch: true },
              { n: "p", v: "20", ref: null, ch: false },
              { n: "net", v: "сеть 172.20.160.0/20", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[19, 20]", ch: true } },
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт следующее значение: `p` = `21`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[19, 20]", ref: 0, ch: false },
              { n: "p", v: "21", ref: null, ch: true },
              { n: "net", v: "сеть 172.20.160.0/20", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[19, 20]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `ip_network(f'172.20.174.93/{p}', strict=False)` → `сеть 172.20.168.0/21`, и `net` получает это значение. Прежнее значение `сеть 172.20.160.0/20` больше не связано с `net`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[19, 20]", ref: 0, ch: false },
              { n: "p", v: "21", ref: null, ch: false },
              { n: "net", v: "сеть 172.20.168.0/21", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[19, 20]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Проверка `net.network_address == expected` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[19, 20]", ref: 0, ch: false },
              { n: "p", v: "21", ref: null, ch: false },
              { n: "net", v: "сеть 172.20.168.0/21", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[19, 20]", ch: false } },
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
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[19, 20]", ref: 0, ch: false },
              { n: "p", v: "21", ref: null, ch: false },
              { n: "net", v: "сеть 172.20.168.0/21", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[19, 20]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "На экран выводится «[19, 20]».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_address", v: "функция", ref: null, ch: false },
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "expected", v: "адрес 172.20.160.0", ref: null, ch: false },
              { n: "found", v: "[19, 20]", ref: 0, ch: false },
              { n: "p", v: "21", ref: null, ch: false },
              { n: "net", v: "сеть 172.20.168.0/21", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[19, 20]", ch: false } },
        out: "[19, 20]\n",
      },
    ],
  },
  runDiffer: {
    kind: "run",
    code: "from ipaddress import ip_network\n\nfor p in range(18, 33):\n    a = ip_network(f'172.20.74.10/{p}', strict=False)\n    b = ip_network(f'172.20.79.200/{p}', strict=False)\n    if a.network_address != b.network_address:\n        break\nprint(p)",
    fileName: "differ.py",
    output: "22",
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
        text: "`ip_network` = `функция`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "ip_network", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт первое значение: `p` = `18`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "18", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `ip_network(f'172.20.74.10/{p}', strict=False)` → `сеть 172.20.64.0/18`, и `a` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "18", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.64.0/18", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `ip_network(f'172.20.79.200/{p}', strict=False)` → `сеть 172.20.64.0/18`, и `b` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "18", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.64.0/18", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.64.0/18", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `a.network_address != b.network_address` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "18", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.64.0/18", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.64.0/18", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `p` = `19`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "19", ref: null, ch: true },
              { n: "a", v: "сеть 172.20.64.0/18", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.64.0/18", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `ip_network(f'172.20.74.10/{p}', strict=False)` → `сеть 172.20.64.0/19`, и `a` получает это значение. Прежнее значение `сеть 172.20.64.0/18` больше не связано с `a`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "19", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.64.0/19", ref: null, ch: true },
              { n: "b", v: "сеть 172.20.64.0/18", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `ip_network(f'172.20.79.200/{p}', strict=False)` → `сеть 172.20.64.0/19`, и `b` получает это значение. Прежнее значение `сеть 172.20.64.0/18` больше не связано с `b`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "19", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.64.0/19", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.64.0/19", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `a.network_address != b.network_address` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "19", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.64.0/19", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.64.0/19", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `p` = `20`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "20", ref: null, ch: true },
              { n: "a", v: "сеть 172.20.64.0/19", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.64.0/19", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `ip_network(f'172.20.74.10/{p}', strict=False)` → `сеть 172.20.64.0/20`, и `a` получает это значение. Прежнее значение `сеть 172.20.64.0/19` больше не связано с `a`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "20", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.64.0/20", ref: null, ch: true },
              { n: "b", v: "сеть 172.20.64.0/19", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `ip_network(f'172.20.79.200/{p}', strict=False)` → `сеть 172.20.64.0/20`, и `b` получает это значение. Прежнее значение `сеть 172.20.64.0/19` больше не связано с `b`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "20", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.64.0/20", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.64.0/20", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `a.network_address != b.network_address` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "20", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.64.0/20", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.64.0/20", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `p` = `21`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "21", ref: null, ch: true },
              { n: "a", v: "сеть 172.20.64.0/20", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.64.0/20", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `ip_network(f'172.20.74.10/{p}', strict=False)` → `сеть 172.20.72.0/21`, и `a` получает это значение. Прежнее значение `сеть 172.20.64.0/20` больше не связано с `a`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "21", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.72.0/21", ref: null, ch: true },
              { n: "b", v: "сеть 172.20.64.0/20", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `ip_network(f'172.20.79.200/{p}', strict=False)` → `сеть 172.20.72.0/21`, и `b` получает это значение. Прежнее значение `сеть 172.20.64.0/20` больше не связано с `b`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "21", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.72.0/21", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.72.0/21", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `a.network_address != b.network_address` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "21", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.72.0/21", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.72.0/21", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `p` = `22`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "22", ref: null, ch: true },
              { n: "a", v: "сеть 172.20.72.0/21", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.72.0/21", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `ip_network(f'172.20.74.10/{p}', strict=False)` → `сеть 172.20.72.0/22`, и `a` получает это значение. Прежнее значение `сеть 172.20.72.0/21` больше не связано с `a`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "22", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.72.0/22", ref: null, ch: true },
              { n: "b", v: "сеть 172.20.72.0/21", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `ip_network(f'172.20.79.200/{p}', strict=False)` → `сеть 172.20.76.0/22`, и `b` получает это значение. Прежнее значение `сеть 172.20.72.0/21` больше не связано с `b`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "22", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.72.0/22", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.76.0/22", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `a.network_address != b.network_address` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "22", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.72.0/22", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.76.0/22", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`break` прерывает цикл.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "22", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.72.0/22", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.76.0/22", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "На экран выводится «22».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "p", v: "22", ref: null, ch: false },
              { n: "a", v: "сеть 172.20.72.0/22", ref: null, ch: false },
              { n: "b", v: "сеть 172.20.76.0/22", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "22\n",
      },
    ],
  },
  runFirst: {
    kind: "run",
    code: "from ipaddress import ip_network\n\nnet = ip_network('192.168.10.0/28')\nfor address in net.hosts():\n    bits = format(int(address), '032b')\n    if bits.count('1') == 9:\n        break\nprint(address)",
    fileName: "first.py",
    output: "192.168.10.3",
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
        text: "`ip_network` = `функция`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "ip_network", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Python вычисляет `ip_network('192.168.10.0/28')` → `сеть 192.168.10.0/28`, и `net` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "net", v: "сеть 192.168.10.0/28", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`for` берёт первое значение: `address` = `адрес 192.168.10.1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "net", v: "сеть 192.168.10.0/28", ref: null, ch: false },
              { n: "address", v: "адрес 192.168.10.1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `format(int(address), '032b')` → `'11000000101010000000101000000001'`, и `bits` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "net", v: "сеть 192.168.10.0/28", ref: null, ch: false },
              { n: "address", v: "адрес 192.168.10.1", ref: null, ch: false },
              {
                n: "bits",
                v: "'11000000101010000000101000000001'",
                ref: null,
                ch: true,
              },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `bits.count('1') == 9` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "net", v: "сеть 192.168.10.0/28", ref: null, ch: false },
              { n: "address", v: "адрес 192.168.10.1", ref: null, ch: false },
              {
                n: "bits",
                v: "'11000000101010000000101000000001'",
                ref: null,
                ch: false,
              },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`for` берёт следующее значение: `address` = `адрес 192.168.10.2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "net", v: "сеть 192.168.10.0/28", ref: null, ch: false },
              { n: "address", v: "адрес 192.168.10.2", ref: null, ch: true },
              {
                n: "bits",
                v: "'11000000101010000000101000000001'",
                ref: null,
                ch: false,
              },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `format(int(address), '032b')` → `'11000000101010000000101000000010'`, и `bits` получает это значение. Прежнее значение `'11000000101010000000101000000001'` больше не связано с `bits`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "net", v: "сеть 192.168.10.0/28", ref: null, ch: false },
              { n: "address", v: "адрес 192.168.10.2", ref: null, ch: false },
              {
                n: "bits",
                v: "'11000000101010000000101000000010'",
                ref: null,
                ch: true,
              },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `bits.count('1') == 9` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "net", v: "сеть 192.168.10.0/28", ref: null, ch: false },
              { n: "address", v: "адрес 192.168.10.2", ref: null, ch: false },
              {
                n: "bits",
                v: "'11000000101010000000101000000010'",
                ref: null,
                ch: false,
              },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`for` берёт следующее значение: `address` = `адрес 192.168.10.3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "net", v: "сеть 192.168.10.0/28", ref: null, ch: false },
              { n: "address", v: "адрес 192.168.10.3", ref: null, ch: true },
              {
                n: "bits",
                v: "'11000000101010000000101000000010'",
                ref: null,
                ch: false,
              },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `format(int(address), '032b')` → `'11000000101010000000101000000011'`, и `bits` получает это значение. Прежнее значение `'11000000101010000000101000000010'` больше не связано с `bits`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "net", v: "сеть 192.168.10.0/28", ref: null, ch: false },
              { n: "address", v: "адрес 192.168.10.3", ref: null, ch: false },
              {
                n: "bits",
                v: "'11000000101010000000101000000011'",
                ref: null,
                ch: true,
              },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `bits.count('1') == 9` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "net", v: "сеть 192.168.10.0/28", ref: null, ch: false },
              { n: "address", v: "адрес 192.168.10.3", ref: null, ch: false },
              {
                n: "bits",
                v: "'11000000101010000000101000000011'",
                ref: null,
                ch: false,
              },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`break` прерывает цикл.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "net", v: "сеть 192.168.10.0/28", ref: null, ch: false },
              { n: "address", v: "адрес 192.168.10.3", ref: null, ch: false },
              {
                n: "bits",
                v: "'11000000101010000000101000000011'",
                ref: null,
                ch: false,
              },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "На экран выводится «192.168.10.3».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ip_network", v: "функция", ref: null, ch: false },
              { n: "net", v: "сеть 192.168.10.0/28", ref: null, ch: false },
              { n: "address", v: "адрес 192.168.10.3", ref: null, ch: false },
              {
                n: "bits",
                v: "'11000000101010000000101000000011'",
                ref: null,
                ch: false,
              },
            ],
          },
        ],
        objs: {},
        out: "192.168.10.3\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
