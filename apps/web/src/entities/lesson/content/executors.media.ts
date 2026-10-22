// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%tm_tape('10100', head=5, state='q0')%%
  tmTape10100_3b536b: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 124"><rect x="170.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="190.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="190.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">-1</text><rect x="210.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="230.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="230.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="250.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="270.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="270.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="290.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="310.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="310.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="330.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="350.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="350.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="370.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="390.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="390.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="410.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="430.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="430.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="450.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="470.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="470.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><path d="M 421.0 28.0 L 439.0 28.0 L 430.0 40.0 Z" fill="#ff6a00"/><text x="430.0" y="22.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">q0</text></svg>',
    width: 660,
    height: 124,
    alt: "Лента и головка",
  },
  // %%tm_trace('10100', 'q0: λLq1 - -; q1: λSq1 1Lq1 0Sq1')%%
  tmTrace10100_q0Lq1q1Sq11Lq10Sq1: {
    kind: "stepper",
    width: 660,
    height: 234,
    frames: [
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 234"><rect x="170.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="190.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="190.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">-1</text><rect x="210.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="230.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="230.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="250.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="270.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="270.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="290.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="310.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="310.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="330.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="350.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="350.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="370.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="390.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="390.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="410.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="430.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="430.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="450.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="470.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="470.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><path d="M 421.0 28.0 L 439.0 28.0 L 430.0 40.0 Z" fill="#ff6a00"/><text x="430.0" y="22.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">q0</text><text x="288.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="350.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="412.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="249.0" y="171.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">q0</text><rect x="257.0" y="152.0" width="62" height="28" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="288.0" y="171.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ, L, q1</text><rect x="319.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="350.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">—</text><rect x="381.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="412.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">—</text><text x="249.0" y="199.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">q1</text><rect x="257.0" y="180.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="288.0" y="199.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ, S, q1</text><rect x="319.0" y="180.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="350.0" y="199.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1, L, q1</text><rect x="381.0" y="180.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="412.0" y="199.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0, S, q1</text><text x="648.0" y="226.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">такт 0 из 4</text></svg>',
        caption:
          "Начало: q0, головка в клетке 5. Перед тактом 1: q0 читает λ в клетке 5 → записать λ, влево, q1.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 234"><rect x="170.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="190.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="190.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">-1</text><rect x="210.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="230.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="230.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="250.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="270.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="270.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="290.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="310.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="310.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="330.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="350.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="350.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="370.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="390.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="390.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="410.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="430.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="430.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="450.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="470.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="470.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><path d="M 381.0 28.0 L 399.0 28.0 L 390.0 40.0 Z" fill="#ff6a00"/><text x="390.0" y="22.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">q1</text><text x="288.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="350.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="412.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="249.0" y="171.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">q0</text><rect x="257.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="288.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ, L, q1</text><rect x="319.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="350.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">—</text><rect x="381.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="412.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">—</text><text x="249.0" y="199.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">q1</text><rect x="257.0" y="180.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="288.0" y="199.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ, S, q1</text><rect x="319.0" y="180.0" width="62" height="28" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="350.0" y="199.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1, L, q1</text><rect x="381.0" y="180.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="412.0" y="199.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0, S, q1</text><text x="648.0" y="226.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">такт 1 из 4</text></svg>',
        caption:
          "Перед тактом 2: q1 читает 0 в клетке 4 → записать 1, влево, q1.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 234"><rect x="170.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="190.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="190.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">-1</text><rect x="210.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="230.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="230.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="250.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="270.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="270.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="290.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="310.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="310.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="330.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="350.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="350.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="370.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="390.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="390.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="410.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="430.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="430.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="450.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="470.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="470.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><path d="M 341.0 28.0 L 359.0 28.0 L 350.0 40.0 Z" fill="#ff6a00"/><text x="350.0" y="22.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">q1</text><text x="288.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="350.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="412.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="249.0" y="171.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">q0</text><rect x="257.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="288.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ, L, q1</text><rect x="319.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="350.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">—</text><rect x="381.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="412.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">—</text><text x="249.0" y="199.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">q1</text><rect x="257.0" y="180.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="288.0" y="199.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ, S, q1</text><rect x="319.0" y="180.0" width="62" height="28" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="350.0" y="199.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1, L, q1</text><rect x="381.0" y="180.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="412.0" y="199.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0, S, q1</text><text x="648.0" y="226.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">такт 2 из 4</text></svg>',
        caption:
          "Перед тактом 3: q1 читает 0 в клетке 3 → записать 1, влево, q1.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 234"><rect x="170.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="190.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="190.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">-1</text><rect x="210.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="230.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="230.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="250.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="270.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="270.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="290.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="310.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="310.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="330.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="350.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="350.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="370.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="390.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="390.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="410.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="430.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="430.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="450.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="470.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="470.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><path d="M 301.0 28.0 L 319.0 28.0 L 310.0 40.0 Z" fill="#ff6a00"/><text x="310.0" y="22.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">q1</text><text x="288.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="350.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="412.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="249.0" y="171.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">q0</text><rect x="257.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="288.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ, L, q1</text><rect x="319.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="350.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">—</text><rect x="381.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="412.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">—</text><text x="249.0" y="199.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">q1</text><rect x="257.0" y="180.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="288.0" y="199.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ, S, q1</text><rect x="319.0" y="180.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="350.0" y="199.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1, L, q1</text><rect x="381.0" y="180.0" width="62" height="28" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="412.0" y="199.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0, S, q1</text><text x="648.0" y="226.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">такт 3 из 4</text></svg>',
        caption:
          "Перед тактом 4: q1 читает 1 в клетке 2 → записать 0, стоп, q1.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 234"><rect x="170.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="190.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="190.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">-1</text><rect x="210.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="230.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="230.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="250.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="270.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="270.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="290.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="310.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="310.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="330.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="350.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="350.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="370.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="390.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="390.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="410.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="430.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="430.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="450.0" y="44.0" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="470.0" y="71.0" font-family="inherit" font-size="19" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="470.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><path d="M 301.0 28.0 L 319.0 28.0 L 310.0 40.0 Z" fill="#ff6a00"/><text x="310.0" y="22.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">стоп</text><text x="288.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ</text><text x="350.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="412.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="249.0" y="171.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">q0</text><rect x="257.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="288.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ, L, q1</text><rect x="319.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="350.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">—</text><rect x="381.0" y="152.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="412.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">—</text><text x="249.0" y="199.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">q1</text><rect x="257.0" y="180.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="288.0" y="199.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">λ, S, q1</text><rect x="319.0" y="180.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="350.0" y="199.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1, L, q1</text><rect x="381.0" y="180.0" width="62" height="28" fill="#fff" stroke="#d9d9d4" stroke-width="1"/><text x="412.0" y="199.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0, S, q1</text><text x="648.0" y="226.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">такт 4 из 4</text></svg>',
        caption: "Остановка: на ленте 10011, тактов 4, головка на 2.",
      },
    ],
  },
  // %%tm_map('111220', '0>2 1>0 2>1')%%
  tmMap111220_021021: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><rect x="210.0" y="18" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="230.0" y="45.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="250.0" y="18" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="270.0" y="45.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="290.0" y="18" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="310.0" y="45.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="330.0" y="18" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="350.0" y="45.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="370.0" y="18" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="390.0" y="45.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="410.0" y="18" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="430.0" y="45.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="198.0" y="45.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">до</text><rect x="210.0" y="108" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="230.0" y="135.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="250.0" y="108" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="270.0" y="135.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="290.0" y="108" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="310.0" y="135.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="330.0" y="108" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="350.0" y="135.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="370.0" y="108" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="390.0" y="135.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="410.0" y="108" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="430.0" y="135.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="198.0" y="135.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">после</text><line x1="230.0" y1="62" x2="230.0" y2="100" stroke="#4d535e" stroke-width="1.2"/><path d="M 226.0 94 L 234.0 94 L 230.0 102 Z" fill="#4d535e"/><line x1="270.0" y1="62" x2="270.0" y2="100" stroke="#4d535e" stroke-width="1.2"/><path d="M 266.0 94 L 274.0 94 L 270.0 102 Z" fill="#4d535e"/><line x1="310.0" y1="62" x2="310.0" y2="100" stroke="#4d535e" stroke-width="1.2"/><path d="M 306.0 94 L 314.0 94 L 310.0 102 Z" fill="#4d535e"/><line x1="350.0" y1="62" x2="350.0" y2="100" stroke="#4d535e" stroke-width="1.2"/><path d="M 346.0 94 L 354.0 94 L 350.0 102 Z" fill="#4d535e"/><line x1="390.0" y1="62" x2="390.0" y2="100" stroke="#4d535e" stroke-width="1.2"/><path d="M 386.0 94 L 394.0 94 L 390.0 102 Z" fill="#4d535e"/><line x1="430.0" y1="62" x2="430.0" y2="100" stroke="#4d535e" stroke-width="1.2"/><path d="M 426.0 94 L 434.0 94 L 430.0 102 Z" fill="#4d535e"/><text x="330.0" y="188.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0 → 2: 1 · 1 → 0: 3 · 2 → 1: 2</text></svg>',
    width: 660,
    height: 200,
    alt: "Проход с заменой символов",
  },
  // %%tm_map('597595', '5>1 7>1 9>0')%%
  tmMap597595_517190: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><rect x="210.0" y="18" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="230.0" y="45.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="250.0" y="18" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="270.0" y="45.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><rect x="290.0" y="18" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="310.0" y="45.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><rect x="330.0" y="18" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="350.0" y="45.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="370.0" y="18" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="390.0" y="45.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><rect x="410.0" y="18" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="430.0" y="45.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="198.0" y="45.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">до</text><rect x="210.0" y="108" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="230.0" y="135.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="250.0" y="108" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="270.0" y="135.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="290.0" y="108" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="310.0" y="135.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="330.0" y="108" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="350.0" y="135.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="370.0" y="108" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="390.0" y="135.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="410.0" y="108" width="40" height="40" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="430.0" y="135.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="198.0" y="135.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">после</text><line x1="230.0" y1="62" x2="230.0" y2="100" stroke="#4d535e" stroke-width="1.2"/><path d="M 226.0 94 L 234.0 94 L 230.0 102 Z" fill="#4d535e"/><line x1="270.0" y1="62" x2="270.0" y2="100" stroke="#4d535e" stroke-width="1.2"/><path d="M 266.0 94 L 274.0 94 L 270.0 102 Z" fill="#4d535e"/><line x1="310.0" y1="62" x2="310.0" y2="100" stroke="#4d535e" stroke-width="1.2"/><path d="M 306.0 94 L 314.0 94 L 310.0 102 Z" fill="#4d535e"/><line x1="350.0" y1="62" x2="350.0" y2="100" stroke="#4d535e" stroke-width="1.2"/><path d="M 346.0 94 L 354.0 94 L 350.0 102 Z" fill="#4d535e"/><line x1="390.0" y1="62" x2="390.0" y2="100" stroke="#4d535e" stroke-width="1.2"/><path d="M 386.0 94 L 394.0 94 L 390.0 102 Z" fill="#4d535e"/><line x1="430.0" y1="62" x2="430.0" y2="100" stroke="#4d535e" stroke-width="1.2"/><path d="M 426.0 94 L 434.0 94 L 430.0 102 Z" fill="#4d535e"/><text x="330.0" y="188.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5 → 1: 3 · 7 → 1: 1 · 9 → 0: 2</text></svg>',
    width: 660,
    height: 200,
    alt: "Проход с заменой символов",
  },
  runTm: {
    kind: "run",
    code: "rules = {\n    ('q0', 'λ'): ('λ', 'L', 'q1'),\n    ('q1', 'λ'): ('λ', 'S', 'q1'),\n    ('q1', '0'): ('1', 'L', 'q1'),\n    ('q1', '1'): ('0', 'S', 'q1'),\n}\ntape = {0: '1', 1: '0', 2: '1', 3: '0', 4: '0'}\npos, state = 5, 'q0'\nwhile True:\n    write, move, state = rules[(state, tape.get(pos, 'λ'))]\n    tape[pos] = write\n    if move == 'S':\n        break\n    pos += -1 if move == 'L' else 1\nprint(tape[0] + tape[1] + tape[2] + tape[3] + tape[4])",
    fileName: "tm.py",
    output: "10011",
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
        line: 2,
        text: "Строка выполнена.",
        kind: "line",
        frames: [{ title: "программа", names: [] }],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Строка выполнена.",
        kind: "line",
        frames: [{ title: "программа", names: [] }],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Строка выполнена.",
        kind: "line",
        frames: [{ title: "программа", names: [] }],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Строка выполнена.",
        kind: "line",
        frames: [{ title: "программа", names: [] }],
        objs: {},
        out: "",
      },
      {
        line: 1,
        text: "`rules` получает значение `{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: true,
              },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: true,
          },
        },
        out: "",
      },
      {
        line: 7,
        text: "`tape` получает значение `{0: '1', 1: '0', 2: '1', 3: '0', 4: '0'}`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0'}",
                ref: 1,
                ch: true,
              },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0'}", ch: true },
        },
        out: "",
      },
      {
        line: 8,
        text: "`pos` = `5`; `state` = `'q0'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "5", ref: null, ch: true },
              { n: "state", v: "'q0'", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0'}", ch: false },
        },
        out: "",
      },
      {
        line: 9,
        text: "Проверка `True` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "5", ref: null, ch: false },
              { n: "state", v: "'q0'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0'}", ch: false },
        },
        out: "",
      },
      {
        line: 10,
        text: "`state`: было `'q0'`, стало `'q1'`; `write` = `'λ'`; `move` = `'L'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "5", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: true },
              { n: "write", v: "'λ'", ref: null, ch: true },
              { n: "move", v: "'L'", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0'}", ch: false },
        },
        out: "",
      },
      {
        line: 11,
        text: "Python вычисляет `write` → `'λ'` и записывает это в `tape[5]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0', 5: 'λ'}",
                ref: 1,
                ch: true,
              },
              { n: "pos", v: "5", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'λ'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0', 5: 'λ'}",
            ch: true,
          },
        },
        out: "",
      },
      {
        line: 12,
        text: "Проверка `move == 'S'` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "5", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'λ'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 14,
        text: "`pos += -1 if move == 'L' else 1`: значение `pos` увеличилось — было `5`, стало `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "4", ref: null, ch: true },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'λ'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 9,
        text: "Проверка `True` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "4", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'λ'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 10,
        text: "`write`: было `'λ'`, стало `'1'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "4", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: true },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '0', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 11,
        text: "Python вычисляет `write` → `'1'` и записывает это в `tape[4]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: true,
              },
              { n: "pos", v: "4", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '1', 5: 'λ'}",
            ch: true,
          },
        },
        out: "",
      },
      {
        line: 12,
        text: "Проверка `move == 'S'` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "4", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '1', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 14,
        text: "`pos += -1 if move == 'L' else 1`: значение `pos` увеличилось — было `4`, стало `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "3", ref: null, ch: true },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '1', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 9,
        text: "Проверка `True` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "3", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '1', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 10,
        text: "Строка выполнена.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "3", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: '1', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 11,
        text: "Python вычисляет `write` → `'1'` и записывает это в `tape[3]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: true,
              },
              { n: "pos", v: "3", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: '1', 5: 'λ'}",
            ch: true,
          },
        },
        out: "",
      },
      {
        line: 12,
        text: "Проверка `move == 'S'` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "3", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: '1', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 14,
        text: "`pos += -1 if move == 'L' else 1`: значение `pos` увеличилось — было `3`, стало `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "2", ref: null, ch: true },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: '1', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 9,
        text: "Проверка `True` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "2", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: '1', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 10,
        text: "`write`: было `'1'`, стало `'0'`; `move`: было `'L'`, стало `'S'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "2", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'0'", ref: null, ch: true },
              { n: "move", v: "'S'", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: '1', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 11,
        text: "Python вычисляет `write` → `'0'` и записывает это в `tape[2]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: true,
              },
              { n: "pos", v: "2", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'0'", ref: null, ch: false },
              { n: "move", v: "'S'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: '1', 5: 'λ'}",
            ch: true,
          },
        },
        out: "",
      },
      {
        line: 12,
        text: "Проверка `move == 'S'` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "2", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'0'", ref: null, ch: false },
              { n: "move", v: "'S'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: '1', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 13,
        text: "`break` прерывает цикл.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "2", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'0'", ref: null, ch: false },
              { n: "move", v: "'S'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: '1', 5: 'λ'}",
            ch: false,
          },
        },
        out: "",
      },
      {
        line: 15,
        text: "На экран выводится «10011».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: '1', 5: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "2", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'0'", ref: null, ch: false },
              { n: "move", v: "'S'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', 'λ'): ('…",
            ch: false,
          },
          "1": {
            v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: '1', 5: 'λ'}",
            ch: false,
          },
        },
        out: "10011\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
