// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%rec_unfold_stepper(5)%%
  recUnfoldStepper5: {
    kind: "stepper",
    width: 660,
    height: 200,
    frames: [
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">запрос</text><text x="82.0" y="22.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(5) = 5 · F(4)</text><rect x="16" y="62" width="116" height="70" rx="8" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="28.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(5)</text><text x="28.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(4),</text><text x="28.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 5</text><text x="644.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">сверху — запросы, снизу — ответы</text></svg>',
        caption:
          "F(5) = 5 · F(4). Значения F(4) ещё нет, поэтому F(5) ждёт и помнит, что потом умножит его на 5.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">запрос</text><text x="82.0" y="22.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(4) = 4 · F(3)</text><rect x="16" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="28.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(5)</text><text x="28.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(4),</text><text x="28.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 5</text><rect x="144" y="62" width="116" height="70" rx="8" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="156.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(4)</text><text x="156.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(3),</text><text x="156.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 4</text><path d="M 86.0 58 Q 138.0 32 184.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 190.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><text x="644.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">сверху — запросы, снизу — ответы</text></svg>',
        caption:
          "F(4) = 4 · F(3). Значения F(3) ещё нет, поэтому F(4) ждёт и помнит, что потом умножит его на 4.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">запрос</text><text x="82.0" y="22.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(3) = 3 · F(2)</text><rect x="16" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="28.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(5)</text><text x="28.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(4),</text><text x="28.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 5</text><rect x="144" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="156.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(4)</text><text x="156.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(3),</text><text x="156.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 4</text><path d="M 86.0 58 Q 138.0 32 184.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 190.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="272" y="62" width="116" height="70" rx="8" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="284.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(3)</text><text x="284.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(2),</text><text x="284.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 3</text><path d="M 214.0 58 Q 266.0 32 312.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 318.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><text x="644.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">сверху — запросы, снизу — ответы</text></svg>',
        caption:
          "F(3) = 3 · F(2). Значения F(2) ещё нет, поэтому F(3) ждёт и помнит, что потом умножит его на 3.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">запрос</text><text x="82.0" y="22.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(2) = 2 · F(1)</text><rect x="16" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="28.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(5)</text><text x="28.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(4),</text><text x="28.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 5</text><rect x="144" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="156.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(4)</text><text x="156.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(3),</text><text x="156.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 4</text><path d="M 86.0 58 Q 138.0 32 184.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 190.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="272" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="284.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(3)</text><text x="284.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(2),</text><text x="284.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 3</text><path d="M 214.0 58 Q 266.0 32 312.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 318.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="400" y="62" width="116" height="70" rx="8" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="412.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(2)</text><text x="412.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(1),</text><text x="412.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 2</text><path d="M 342.0 58 Q 394.0 32 440.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 446.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><text x="644.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">сверху — запросы, снизу — ответы</text></svg>',
        caption:
          "F(2) = 2 · F(1). Значения F(1) ещё нет, поэтому F(2) ждёт и помнит, что потом умножит его на 2.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">база</text><text x="64.0" y="22.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(1) = 1</text><rect x="16" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="28.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(5)</text><text x="28.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(4),</text><text x="28.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 5</text><rect x="144" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="156.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(4)</text><text x="156.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(3),</text><text x="156.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 4</text><path d="M 86.0 58 Q 138.0 32 184.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 190.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="272" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="284.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(3)</text><text x="284.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(2),</text><text x="284.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 3</text><path d="M 214.0 58 Q 266.0 32 312.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 318.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="400" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="412.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(2)</text><text x="412.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(1),</text><text x="412.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 2</text><path d="M 342.0 58 Q 394.0 32 440.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 446.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="528" y="62" width="116" height="70" rx="8" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="540.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(1)</text><text x="540.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">база</text><text x="540.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 1</text><path d="M 470.0 58 Q 522.0 32 568.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 574.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><text x="644.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">сверху — запросы, снизу — ответы</text></svg>',
        caption: "F(1) = 1 дано в условии — это база, новых запросов нет.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">ответ</text><text x="73.0" y="22.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(1) = 1 уходит к F(2)</text><rect x="16" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="28.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(5)</text><text x="28.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(4),</text><text x="28.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 5</text><rect x="144" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="156.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(4)</text><text x="156.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(3),</text><text x="156.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 4</text><path d="M 86.0 58 Q 138.0 32 184.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 190.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="272" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="284.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(3)</text><text x="284.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(2),</text><text x="284.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 3</text><path d="M 214.0 58 Q 266.0 32 312.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 318.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="400" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="412.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(2)</text><text x="412.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(1),</text><text x="412.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 2</text><path d="M 342.0 58 Q 394.0 32 440.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 446.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="528" y="62" width="116" height="70" rx="8" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="540.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(1)</text><text x="540.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">база</text><text x="540.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 1</text><path d="M 470.0 58 Q 522.0 32 568.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 574.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><path d="M 574.0 136 Q 522.0 164 476.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 470.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="522.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="644.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">сверху — запросы, снизу — ответы</text></svg>',
        caption: "F(1) возвращает 1 тому, кто его ждал, — вызову F(2).",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">ответ</text><text x="73.0" y="22.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(2) = 2 · 1 = 2</text><rect x="16" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="28.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(5)</text><text x="28.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(4),</text><text x="28.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 5</text><rect x="144" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="156.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(4)</text><text x="156.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(3),</text><text x="156.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 4</text><path d="M 86.0 58 Q 138.0 32 184.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 190.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="272" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="284.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(3)</text><text x="284.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(2),</text><text x="284.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 3</text><path d="M 214.0 58 Q 266.0 32 312.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 318.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="400" y="62" width="116" height="70" rx="8" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="412.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(2)</text><text x="412.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 2 · 1</text><text x="412.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 2</text><path d="M 342.0 58 Q 394.0 32 440.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 446.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="528" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="540.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(1)</text><text x="540.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">база</text><text x="540.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 1</text><path d="M 470.0 58 Q 522.0 32 568.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 574.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><path d="M 574.0 136 Q 522.0 164 476.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 470.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="522.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><path d="M 446.0 136 Q 394.0 164 348.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 342.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="394.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="644.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">сверху — запросы, снизу — ответы</text></svg>',
        caption:
          "F(2) получил F(1) = 1 и выполнил отложенное действие: 2 · 1 = 2.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">ответ</text><text x="73.0" y="22.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(3) = 3 · 2 = 6</text><rect x="16" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="28.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(5)</text><text x="28.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(4),</text><text x="28.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 5</text><rect x="144" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="156.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(4)</text><text x="156.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(3),</text><text x="156.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 4</text><path d="M 86.0 58 Q 138.0 32 184.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 190.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="272" y="62" width="116" height="70" rx="8" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="284.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(3)</text><text x="284.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 3 · 2</text><text x="284.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 6</text><path d="M 214.0 58 Q 266.0 32 312.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 318.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="400" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="412.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(2)</text><text x="412.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 2 · 1</text><text x="412.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 2</text><path d="M 342.0 58 Q 394.0 32 440.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 446.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="528" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="540.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(1)</text><text x="540.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">база</text><text x="540.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 1</text><path d="M 470.0 58 Q 522.0 32 568.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 574.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><path d="M 574.0 136 Q 522.0 164 476.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 470.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="522.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><path d="M 446.0 136 Q 394.0 164 348.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 342.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="394.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><path d="M 318.0 136 Q 266.0 164 220.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 214.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="266.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="644.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">сверху — запросы, снизу — ответы</text></svg>',
        caption:
          "F(3) получил F(2) = 2 и выполнил отложенное действие: 3 · 2 = 6.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">ответ</text><text x="73.0" y="22.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(4) = 4 · 6 = 24</text><rect x="16" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="28.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(5)</text><text x="28.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждёт F(4),</text><text x="28.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">потом · 5</text><rect x="144" y="62" width="116" height="70" rx="8" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="156.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(4)</text><text x="156.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 4 · 6</text><text x="156.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 24</text><path d="M 86.0 58 Q 138.0 32 184.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 190.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="272" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="284.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(3)</text><text x="284.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 3 · 2</text><text x="284.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 6</text><path d="M 214.0 58 Q 266.0 32 312.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 318.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="400" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="412.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(2)</text><text x="412.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 2 · 1</text><text x="412.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 2</text><path d="M 342.0 58 Q 394.0 32 440.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 446.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="528" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="540.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(1)</text><text x="540.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">база</text><text x="540.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 1</text><path d="M 470.0 58 Q 522.0 32 568.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 574.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><path d="M 574.0 136 Q 522.0 164 476.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 470.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="522.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><path d="M 446.0 136 Q 394.0 164 348.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 342.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="394.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><path d="M 318.0 136 Q 266.0 164 220.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 214.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="266.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><path d="M 190.0 136 Q 138.0 164 92.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 86.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="138.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">24</text><text x="644.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">сверху — запросы, снизу — ответы</text></svg>',
        caption:
          "F(4) получил F(3) = 6 и выполнил отложенное действие: 4 · 6 = 24.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">ответ</text><text x="73.0" y="22.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(5) = 5 · 24 = 120</text><rect x="16" y="62" width="116" height="70" rx="8" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="28.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(5)</text><text x="28.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 5 · 24</text><text x="28.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 120</text><rect x="144" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="156.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(4)</text><text x="156.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 4 · 6</text><text x="156.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 24</text><path d="M 86.0 58 Q 138.0 32 184.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 190.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="272" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="284.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(3)</text><text x="284.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 3 · 2</text><text x="284.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 6</text><path d="M 214.0 58 Q 266.0 32 312.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 318.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="400" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="412.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(2)</text><text x="412.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 2 · 1</text><text x="412.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 2</text><path d="M 342.0 58 Q 394.0 32 440.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 446.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><rect x="528" y="62" width="116" height="70" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="540.0" y="86.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(1)</text><text x="540.0" y="107.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">база</text><text x="540.0" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 1</text><path d="M 470.0 58 Q 522.0 32 568.0 56" fill="none" stroke="#17191e" stroke-width="1.3"/><path d="M 574.0 59 l -9 -4 l 3 -6 Z" fill="#17191e"/><path d="M 574.0 136 Q 522.0 164 476.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 470.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="522.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><path d="M 446.0 136 Q 394.0 164 348.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 342.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="394.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><path d="M 318.0 136 Q 266.0 164 220.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 214.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="266.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><path d="M 190.0 136 Q 138.0 164 92.0 138" fill="none" stroke="#ff6a00" stroke-width="1.5"/><path d="M 86.0 135 l 9 4 l -3 6 Z" fill="#ff6a00"/><text x="138.0" y="172.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">24</text><text x="644.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">сверху — запросы, снизу — ответы</text></svg>',
        caption:
          "F(5) получил F(4) = 24 и выполнил отложенное действие: 5 · 24 = 120. Ждущих вызовов не осталось — ответ готов.",
      },
    ],
  },
  // %%rec_chains([7, 6], -2, 1, "eq", -4)%%
  recChains2_1_eq_4: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 218"><line x1="54" y1="70" x2="646" y2="70" stroke="#d9d9d4" stroke-width="1.25"/><line x1="64.0" y1="67" x2="64.0" y2="73" stroke="#4d535e"/><text x="64.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−4</text><line x1="116.0" y1="67" x2="116.0" y2="73" stroke="#4d535e"/><text x="116.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−3</text><line x1="168.0" y1="67" x2="168.0" y2="73" stroke="#4d535e"/><text x="168.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−2</text><line x1="220.0" y1="67" x2="220.0" y2="73" stroke="#4d535e"/><text x="220.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−1</text><line x1="272.0" y1="67" x2="272.0" y2="73" stroke="#4d535e"/><text x="272.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><line x1="324.0" y1="67" x2="324.0" y2="73" stroke="#4d535e"/><text x="324.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><line x1="376.0" y1="67" x2="376.0" y2="73" stroke="#4d535e"/><text x="376.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><line x1="428.0" y1="67" x2="428.0" y2="73" stroke="#4d535e"/><text x="428.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><line x1="480.0" y1="67" x2="480.0" y2="73" stroke="#4d535e"/><text x="480.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><line x1="532.0" y1="67" x2="532.0" y2="73" stroke="#4d535e"/><text x="532.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><line x1="584.0" y1="67" x2="584.0" y2="73" stroke="#4d535e"/><text x="584.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><line x1="636.0" y1="67" x2="636.0" y2="73" stroke="#4d535e"/><text x="636.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><path d="M 636.0 63 Q 584.0 36.0 538.7 58.6" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 532.0 63 L 536.5 55.3 L 540.9 62.0 Z" fill="#17191e"/><path d="M 532.0 63 Q 480.0 36.0 434.7 58.6" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 428.0 63 L 432.5 55.3 L 436.9 62.0 Z" fill="#17191e"/><path d="M 428.0 63 Q 376.0 36.0 330.7 58.6" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 324.0 63 L 328.5 55.3 L 332.9 62.0 Z" fill="#17191e"/><circle cx="636.0" cy="70" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="532.0" cy="70" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="428.0" cy="70" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="324.0" cy="70" r="4.5" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="56.0" y="18.0" font-family="inherit" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(7): 3 перехода до базы F(1)</text><line x1="54" y1="162" x2="646" y2="162" stroke="#d9d9d4" stroke-width="1.25"/><line x1="64.0" y1="159" x2="64.0" y2="165" stroke="#4d535e"/><text x="64.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−4</text><line x1="116.0" y1="159" x2="116.0" y2="165" stroke="#4d535e"/><text x="116.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−3</text><line x1="168.0" y1="159" x2="168.0" y2="165" stroke="#4d535e"/><text x="168.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−2</text><line x1="220.0" y1="159" x2="220.0" y2="165" stroke="#4d535e"/><text x="220.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−1</text><line x1="272.0" y1="159" x2="272.0" y2="165" stroke="#4d535e"/><text x="272.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><line x1="324.0" y1="159" x2="324.0" y2="165" stroke="#4d535e"/><text x="324.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><line x1="376.0" y1="159" x2="376.0" y2="165" stroke="#4d535e"/><text x="376.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><line x1="428.0" y1="159" x2="428.0" y2="165" stroke="#4d535e"/><text x="428.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><line x1="480.0" y1="159" x2="480.0" y2="165" stroke="#4d535e"/><text x="480.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><line x1="532.0" y1="159" x2="532.0" y2="165" stroke="#4d535e"/><text x="532.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><line x1="584.0" y1="159" x2="584.0" y2="165" stroke="#4d535e"/><text x="584.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><line x1="636.0" y1="159" x2="636.0" y2="165" stroke="#4d535e"/><text x="636.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><path d="M 584.0 155 Q 532.0 128.0 486.7 150.6" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 480.0 155 L 484.5 147.3 L 488.9 154.0 Z" fill="#17191e"/><path d="M 480.0 155 Q 428.0 128.0 382.7 150.6" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 376.0 155 L 380.5 147.3 L 384.9 154.0 Z" fill="#17191e"/><path d="M 376.0 155 Q 324.0 128.0 278.7 150.6" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 272.0 155 L 276.5 147.3 L 280.9 154.0 Z" fill="#17191e"/><path d="M 272.0 155 Q 220.0 128.0 174.7 150.6" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 168.0 155 L 172.5 147.3 L 176.9 154.0 Z" fill="#17191e"/><path d="M 168.0 155 Q 116.0 128.0 70.7 150.6" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 64.0 155 L 68.5 147.3 L 72.9 154.0 Z" fill="#17191e"/><circle cx="584.0" cy="162" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="480.0" cy="162" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="376.0" cy="162" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="272.0" cy="162" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="168.0" cy="162" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="64.0" cy="162" r="4.5" fill="#fff" stroke="#17191e" stroke-width="2"/><text x="56.0" y="110.0" font-family="inherit" font-size="13" font-weight="500" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">F(6): аргументы 6, 4, 2, 0, −2, −4, … — база F(1) пропущена</text><circle cx="324.0" cy="70" r="9" fill="none" stroke="#ff6a00" stroke-dasharray="3 2"/><circle cx="324.0" cy="162" r="9" fill="none" stroke="#ff6a00" stroke-dasharray="3 2"/></svg>',
    width: 660,
    height: 218,
    alt: "Шаг −2: цепочка от 7 попадает в базу 1 за 3 перехода, цепочка от 6 проходит через 0 и уходит в отрицательные числа, не задев 1.",
  },
  // %%rec_fill_order(6, 10, 7)%%
  recFillOrder6_10_7: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 284"><text x="24.0" y="14.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(n) = F(n − 1) + F(n − 2): слева направо, f[6] = 5 + 3 = 8</text><rect x="24" y="58" width="62" height="40" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="55.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">f[1]</text><text x="55.0" y="84.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="94" y="58" width="62" height="40" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="125.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">f[2]</text><text x="125.0" y="84.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="164" y="58" width="62" height="40" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="195.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">f[3]</text><text x="195.0" y="84.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="234" y="58" width="62" height="40" rx="6" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="265.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">f[4]</text><text x="265.0" y="84.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="304" y="58" width="62" height="40" rx="6" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="335.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">f[5]</text><text x="335.0" y="84.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="374" y="58" width="62" height="40" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="405.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">f[6]</text><text x="405.0" y="84.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><path d="M 335.0 100 C 335.0 122 391.0 122 391.0 110" fill="none" stroke="#ff6a00" stroke-width="1.4"/><path d="M 391.0 100 l -4.5 10 l 9 0 Z" fill="#ff6a00"/><path d="M 265.0 100 C 265.0 138 417.0 138 417.0 110" fill="none" stroke="#ff6a00" stroke-width="1.4"/><path d="M 417.0 100 l -4.5 10 l 9 0 Z" fill="#ff6a00"/><text x="24.0" y="156.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(n) = n + F(n + 1): справа налево от f[10] = 10, f[7] = 7 + 27 = 34</text><rect x="24" y="200" width="62" height="40" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="55.0" y="192.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">f[7]</text><text x="55.0" y="226.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">34</text><rect x="94" y="200" width="62" height="40" rx="6" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="125.0" y="192.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">f[8]</text><text x="125.0" y="226.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">27</text><rect x="164" y="200" width="62" height="40" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="195.0" y="192.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">f[9]</text><text x="195.0" y="226.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><rect x="234" y="200" width="62" height="40" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="265.0" y="192.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">f[10]</text><text x="265.0" y="226.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><path d="M 125.0 242 C 125.0 264 55.0 264 55.0 252" fill="none" stroke="#ff6a00" stroke-width="1.4"/><path d="M 55.0 242 l -4.5 10 l 9 0 Z" fill="#ff6a00"/></svg>',
    width: 660,
    height: 284,
    alt: "Стрелки ведут от уже готовых ячеек к вычисляемой. Для F(n − 1) и F(n − 2) готовы ячейки слева — таблицу заполняют слева направо; для F(n + 1) готова ячейка справа — справа налево.",
  },
  // %%rec_fib_tree(5)%%
  recFibTree5: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 294"><line x1="330.0" y1="8" x2="330.0" y2="286" stroke="#d9d9d4"/><text x="16.0" y="22.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">без запоминания</text><text x="16.0" y="42.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">9 вызовов</text><line x1="63.8" y1="198" x2="30.0" y2="232" stroke="#d9d9d4" stroke-width="1.25"/><line x1="63.8" y1="198" x2="97.5" y2="232" stroke="#d9d9d4" stroke-width="1.25"/><line x1="114.4" y1="140" x2="63.8" y2="174" stroke="#d9d9d4" stroke-width="1.25"/><line x1="114.4" y1="140" x2="165.0" y2="174" stroke="#d9d9d4" stroke-width="1.25"/><line x1="266.2" y1="140" x2="232.5" y2="174" stroke="#d9d9d4" stroke-width="1.25"/><line x1="266.2" y1="140" x2="300.0" y2="174" stroke="#d9d9d4" stroke-width="1.25"/><line x1="190.3" y1="82" x2="114.4" y2="116" stroke="#d9d9d4" stroke-width="1.25"/><line x1="190.3" y1="82" x2="266.2" y2="116" stroke="#d9d9d4" stroke-width="1.25"/><rect x="10.0" y="232" width="40" height="24" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="30.0" y="248.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(2)</text><rect x="77.5" y="232" width="40" height="24" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="97.5" y="248.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(1)</text><rect x="43.8" y="174" width="40" height="24" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="1.25"/><text x="63.8" y="190.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(3)</text><rect x="145.0" y="174" width="40" height="24" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="165.0" y="190.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(2)</text><rect x="94.4" y="116" width="40" height="24" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="114.4" y="132.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(4)</text><rect x="212.5" y="174" width="40" height="24" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="232.5" y="190.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(2)</text><rect x="280.0" y="174" width="40" height="24" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="300.0" y="190.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(1)</text><rect x="246.2" y="116" width="40" height="24" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="1.25"/><text x="266.2" y="132.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(3)</text><rect x="170.3" y="58" width="40" height="24" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="190.3" y="74.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(5)</text><text x="16.0" y="282.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">F(3) вычисляется 2 раза</text><text x="346.0" y="22.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">с @cache</text><text x="346.0" y="42.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">7 вызовов, вычислено 5</text><line x1="405.0" y1="198" x2="360.0" y2="232" stroke="#d9d9d4" stroke-width="1.25"/><line x1="405.0" y1="198" x2="450.0" y2="232" stroke="#d9d9d4" stroke-width="1.25"/><line x1="472.5" y1="140" x2="405.0" y2="174" stroke="#d9d9d4" stroke-width="1.25"/><line x1="472.5" y1="140" x2="540.0" y2="174" stroke="#d9d9d4" stroke-width="1.25"/><line x1="551.2" y1="82" x2="472.5" y2="116" stroke="#d9d9d4" stroke-width="1.25"/><line x1="551.2" y1="82" x2="630.0" y2="116" stroke="#d9d9d4" stroke-width="1.25"/><rect x="340.0" y="232" width="40" height="24" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="360.0" y="248.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(2)</text><rect x="430.0" y="232" width="40" height="24" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="450.0" y="248.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(1)</text><rect x="385.0" y="174" width="40" height="24" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="405.0" y="190.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(3)</text><rect x="520.0" y="174" width="40" height="24" rx="6" fill="#f3f3f1" stroke="#4d535e" stroke-width="1.25" stroke-dasharray="4 3"/><text x="540.0" y="190.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(2)</text><rect x="452.5" y="116" width="40" height="24" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="472.5" y="132.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(4)</text><rect x="610.0" y="116" width="40" height="24" rx="6" fill="#f3f3f1" stroke="#4d535e" stroke-width="1.25" stroke-dasharray="4 3"/><text x="630.0" y="132.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(3)</text><rect x="531.2" y="58" width="40" height="24" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="551.2" y="74.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(5)</text><text x="346.0" y="282.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">пунктир — ответ взят из памяти</text></svg>',
    width: 660,
    height: 294,
    alt: "Дерево вызовов F(5) без запоминания и с запоминанием",
  },
  // %%rec_ratio(2026, 2024, 3)%%
  recRatio2026_2024_3: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 232"><text x="16.0" y="51.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(2026)</text><text x="136.0" y="51.0" font-family="inherit" font-size="16" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">=</text><rect x="150" y="24" width="74" height="42" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="1.6"/><text x="187.0" y="51.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2026</text><text x="237.0" y="51.0" font-family="inherit" font-size="18" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">·</text><rect x="250" y="24" width="74" height="42" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="287.0" y="51.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2025</text><text x="337.0" y="51.0" font-family="inherit" font-size="18" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">·</text><rect x="350" y="24" width="112" height="42" rx="6" fill="#f3f3f1" stroke="#4d535e" stroke-width="1.25"/><text x="406.0" y="51.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(2024)</text><text x="16.0" y="117.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">3 · F(2025)</text><text x="136.0" y="117.0" font-family="inherit" font-size="16" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">=</text><rect x="150" y="90" width="74" height="42" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="1.6"/><text x="187.0" y="117.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="237.0" y="117.0" font-family="inherit" font-size="18" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">·</text><rect x="250" y="90" width="74" height="42" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="287.0" y="117.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2025</text><text x="337.0" y="117.0" font-family="inherit" font-size="18" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">·</text><rect x="350" y="90" width="112" height="42" rx="6" fill="#f3f3f1" stroke="#4d535e" stroke-width="1.25"/><text x="406.0" y="117.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(2024)</text><path d="M 474 26 h 8 v 128 h -8" fill="none" stroke="#ff6a00" stroke-width="1.5"/><text x="492.0" y="84.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">общий</text><text x="492.0" y="102.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">множитель —</text><text x="492.0" y="120.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">сокращается</text><text x="16.0" y="204.0" font-family="inherit" font-size="16" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">делим на F(2024): (2026 + 3) · 2025 = 4 108 725</text><text x="16.0" y="226.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">отмечены множители, которые различаются</text></svg>',
    width: 660,
    height: 232,
    alt: "F(2026) и 3 · F(2025), расписанные до общего множителя F(2024)",
  },
  // %%rec_diff(2026, 2023)%%
  recDiff2026_2023: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 196"><text x="16.0" y="66.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(2026)</text><rect x="120" y="40" width="220" height="40" rx="6" fill="#f3f3f1" stroke="#4d535e" stroke-width="1.25"/><text x="230.0" y="66.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(2023)</text><rect x="344.0" y="40" width="94.7" height="40" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="391.3" y="58.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3 · 2024</text><text x="391.3" y="74.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6072</text><rect x="442.7" y="40" width="94.7" height="40" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="490.0" y="58.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3 · 2025</text><text x="490.0" y="74.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6075</text><rect x="541.3" y="40" width="94.7" height="40" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="588.7" y="58.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3 · 2026</text><text x="588.7" y="74.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6078</text><text x="16.0" y="136.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(2023)</text><rect x="120" y="110" width="220" height="40" rx="6" fill="#f3f3f1" stroke="#4d535e" stroke-width="1.25"/><text x="230.0" y="136.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F(2023)</text><line x1="342" y1="96" x2="342" y2="160" stroke="#ff6a00" stroke-dasharray="4 3"/><text x="354.0" y="134.0" font-family="inherit" font-size="14" font-weight="500" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">разность: 6072 + 6075 + 6078</text><text x="354.0" y="156.0" font-family="inherit" font-size="14" font-weight="500" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 18 225</text><text x="120.0" y="186.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">общая часть одинакова в обоих значениях и сокращается</text></svg>',
    width: 660,
    height: 196,
    alt: "F(2026) — это всё значение F(2023) плюс три прибавления 6072, 6075 и 6078. Общая часть в разности сокращается, остаётся 18 225. Длины полос не в масштабе.",
  },
  // %%rec_chains([20, 21], -3, 5, "le")%%
  recChains3_5_le: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 218"><rect x="56" y="24" width="79.6" height="62" rx="6" fill="#f3f3f1"/><text x="95.8" y="40.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">база: n ≤ 5</text><line x1="54" y1="70" x2="646" y2="70" stroke="#d9d9d4" stroke-width="1.25"/><line x1="64.0" y1="67" x2="64.0" y2="73" stroke="#4d535e"/><text x="64.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><line x1="95.8" y1="67" x2="95.8" y2="73" stroke="#4d535e"/><text x="95.8" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><line x1="127.6" y1="67" x2="127.6" y2="73" stroke="#4d535e"/><text x="127.6" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><line x1="159.3" y1="67" x2="159.3" y2="73" stroke="#4d535e"/><text x="159.3" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><line x1="191.1" y1="67" x2="191.1" y2="73" stroke="#4d535e"/><text x="191.1" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><line x1="222.9" y1="67" x2="222.9" y2="73" stroke="#4d535e"/><text x="222.9" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><line x1="254.7" y1="67" x2="254.7" y2="73" stroke="#4d535e"/><text x="254.7" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><line x1="286.4" y1="67" x2="286.4" y2="73" stroke="#4d535e"/><text x="286.4" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><line x1="318.2" y1="67" x2="318.2" y2="73" stroke="#4d535e"/><text x="318.2" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><line x1="350.0" y1="67" x2="350.0" y2="73" stroke="#4d535e"/><text x="350.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><line x1="381.8" y1="67" x2="381.8" y2="73" stroke="#4d535e"/><text x="381.8" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><line x1="413.6" y1="67" x2="413.6" y2="73" stroke="#4d535e"/><text x="413.6" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><line x1="445.3" y1="67" x2="445.3" y2="73" stroke="#4d535e"/><text x="445.3" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><line x1="477.1" y1="67" x2="477.1" y2="73" stroke="#4d535e"/><text x="477.1" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><line x1="508.9" y1="67" x2="508.9" y2="73" stroke="#4d535e"/><text x="508.9" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><line x1="540.7" y1="67" x2="540.7" y2="73" stroke="#4d535e"/><text x="540.7" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><line x1="572.4" y1="67" x2="572.4" y2="73" stroke="#4d535e"/><text x="572.4" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><line x1="604.2" y1="67" x2="604.2" y2="73" stroke="#4d535e"/><text x="604.2" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><line x1="636.0" y1="67" x2="636.0" y2="73" stroke="#4d535e"/><text x="636.0" y="89.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">21</text><path d="M 604.2 63 Q 556.6 36.0 515.4 58.4" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 508.9 63 L 513.1 55.1 L 517.7 61.6 Z" fill="#17191e"/><path d="M 508.9 63 Q 461.2 36.0 420.1 58.4" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 413.6 63 L 417.7 55.1 L 422.4 61.6 Z" fill="#17191e"/><path d="M 413.6 63 Q 365.9 36.0 324.7 58.4" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 318.2 63 L 322.4 55.1 L 327.1 61.6 Z" fill="#17191e"/><path d="M 318.2 63 Q 270.6 36.0 229.4 58.4" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 222.9 63 L 227.1 55.1 L 231.7 61.6 Z" fill="#17191e"/><path d="M 222.9 63 Q 175.2 36.0 134.1 58.4" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 127.6 63 L 131.7 55.1 L 136.4 61.6 Z" fill="#17191e"/><circle cx="604.2" cy="70" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="508.9" cy="70" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="413.6" cy="70" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="318.2" cy="70" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="222.9" cy="70" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="127.6" cy="70" r="4.5" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="56.0" y="18.0" font-family="inherit" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(20): 5 переходов до базы F(5)</text><rect x="56" y="116" width="79.6" height="62" rx="6" fill="#f3f3f1"/><text x="95.8" y="132.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">база: n ≤ 5</text><line x1="54" y1="162" x2="646" y2="162" stroke="#d9d9d4" stroke-width="1.25"/><line x1="64.0" y1="159" x2="64.0" y2="165" stroke="#4d535e"/><text x="64.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><line x1="95.8" y1="159" x2="95.8" y2="165" stroke="#4d535e"/><text x="95.8" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><line x1="127.6" y1="159" x2="127.6" y2="165" stroke="#4d535e"/><text x="127.6" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><line x1="159.3" y1="159" x2="159.3" y2="165" stroke="#4d535e"/><text x="159.3" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><line x1="191.1" y1="159" x2="191.1" y2="165" stroke="#4d535e"/><text x="191.1" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><line x1="222.9" y1="159" x2="222.9" y2="165" stroke="#4d535e"/><text x="222.9" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><line x1="254.7" y1="159" x2="254.7" y2="165" stroke="#4d535e"/><text x="254.7" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><line x1="286.4" y1="159" x2="286.4" y2="165" stroke="#4d535e"/><text x="286.4" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><line x1="318.2" y1="159" x2="318.2" y2="165" stroke="#4d535e"/><text x="318.2" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><line x1="350.0" y1="159" x2="350.0" y2="165" stroke="#4d535e"/><text x="350.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><line x1="381.8" y1="159" x2="381.8" y2="165" stroke="#4d535e"/><text x="381.8" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><line x1="413.6" y1="159" x2="413.6" y2="165" stroke="#4d535e"/><text x="413.6" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><line x1="445.3" y1="159" x2="445.3" y2="165" stroke="#4d535e"/><text x="445.3" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><line x1="477.1" y1="159" x2="477.1" y2="165" stroke="#4d535e"/><text x="477.1" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><line x1="508.9" y1="159" x2="508.9" y2="165" stroke="#4d535e"/><text x="508.9" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><line x1="540.7" y1="159" x2="540.7" y2="165" stroke="#4d535e"/><text x="540.7" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><line x1="572.4" y1="159" x2="572.4" y2="165" stroke="#4d535e"/><text x="572.4" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><line x1="604.2" y1="159" x2="604.2" y2="165" stroke="#4d535e"/><text x="604.2" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><line x1="636.0" y1="159" x2="636.0" y2="165" stroke="#4d535e"/><text x="636.0" y="181.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">21</text><path d="M 636.0 155 Q 588.3 128.0 547.2 150.4" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 540.7 155 L 544.9 147.1 L 549.5 153.6 Z" fill="#17191e"/><path d="M 540.7 155 Q 493.0 128.0 451.8 150.4" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 445.3 155 L 449.5 147.1 L 454.2 153.6 Z" fill="#17191e"/><path d="M 445.3 155 Q 397.7 128.0 356.5 150.4" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 350.0 155 L 354.2 147.1 L 358.8 153.6 Z" fill="#17191e"/><path d="M 350.0 155 Q 302.3 128.0 261.2 150.4" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 254.7 155 L 258.9 147.1 L 263.5 153.6 Z" fill="#17191e"/><path d="M 254.7 155 Q 207.0 128.0 165.8 150.4" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 159.3 155 L 163.5 147.1 L 168.2 153.6 Z" fill="#17191e"/><path d="M 159.3 155 Q 111.7 128.0 70.5 150.4" fill="none" stroke="#17191e" stroke-width="1.4"/><path d="M 64.0 155 L 68.2 147.1 L 72.8 153.6 Z" fill="#17191e"/><circle cx="636.0" cy="162" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="540.7" cy="162" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="445.3" cy="162" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="350.0" cy="162" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="254.7" cy="162" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="159.3" cy="162" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><circle cx="64.0" cy="162" r="4.5" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="56.0" y="110.0" font-family="inherit" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(21): 6 переходов до базы F(3)</text></svg>',
    width: 660,
    height: 218,
    alt: "Шаг −3: цепочка от 20 входит в зону базы n ≤ 5 ровно в 5 после 5 переходов, цепочка от 21 — в 3 после 6 переходов. Конец цепочки зависит от остатка при делении на 3.",
  },
  // %%rec_pairs(10, 1000)%%
  recPairs10_1000: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 214"><text x="16.0" y="48.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(11)</text><rect x="120" y="22" width="60" height="40" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="150.0" y="48.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><rect x="204" y="22" width="60" height="40" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="234.0" y="48.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="192.0" y="48.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+</text><rect x="288" y="22" width="60" height="40" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="318.0" y="48.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="276.0" y="48.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+</text><text x="360.0" y="48.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+</text><text x="402.0" y="48.0" font-family="inherit" font-size="18" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">…</text><rect x="456" y="22" width="60" height="40" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="486.0" y="48.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">999</text><text x="444.0" y="48.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+</text><rect x="540" y="22" width="60" height="40" rx="6" fill="#f3f3f1" stroke="#4d535e" stroke-width="1.25"/><text x="570.0" y="48.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1001</text><text x="528.0" y="48.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+</text><text x="16.0" y="106.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">F(10)</text><rect x="120" y="80" width="60" height="40" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="150.0" y="106.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><rect x="204" y="80" width="60" height="40" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="234.0" y="106.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="192.0" y="106.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+</text><rect x="288" y="80" width="60" height="40" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="318.0" y="106.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="276.0" y="106.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+</text><text x="360.0" y="106.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+</text><text x="402.0" y="106.0" font-family="inherit" font-size="18" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">…</text><rect x="456" y="80" width="60" height="40" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="486.0" y="106.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">998</text><text x="444.0" y="106.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+</text><rect x="540" y="80" width="60" height="40" rx="6" fill="#f3f3f1" stroke="#4d535e" stroke-width="1.25"/><text x="570.0" y="106.0" font-family="inherit" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1000</text><text x="528.0" y="106.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+</text><text x="150.0" y="140.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="234.0" y="140.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="318.0" y="140.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="486.0" y="140.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="570.0" y="140.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="570.0" y="160.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">база</text><text x="16.0" y="140.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">разность</text><text x="16.0" y="196.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">495 пар по 1 и разность баз 1: F(11) − F(10) = 496</text></svg>',
    width: 660,
    height: 214,
    alt: "Слагаемые F(11) и F(10) парами: каждая пара отличается на 1",
  },
  // %%rec_carry(2399)%%
  recCarry2399: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="16.0" y="54.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">n = 2399</text><rect x="150" y="24" width="50" height="46" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="175.0" y="54.0" font-family="inherit" font-size="20" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="206" y="24" width="50" height="46" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="1.6"/><text x="231.0" y="54.0" font-family="inherit" font-size="20" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="262" y="24" width="50" height="46" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="1.6"/><text x="287.0" y="54.0" font-family="inherit" font-size="20" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><rect x="318" y="24" width="50" height="46" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="1.6"/><text x="343.0" y="54.0" font-family="inherit" font-size="20" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="388.0" y="54.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">сумма цифр 23</text><text x="16.0" y="130.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">n + 1 = 2400</text><rect x="150" y="100" width="50" height="46" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="175.0" y="130.0" font-family="inherit" font-size="20" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="206" y="100" width="50" height="46" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="1.6"/><text x="231.0" y="130.0" font-family="inherit" font-size="20" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="262" y="100" width="50" height="46" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="1.6"/><text x="287.0" y="130.0" font-family="inherit" font-size="20" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="318" y="100" width="50" height="46" rx="6" fill="#fff" stroke="#ff6a00" stroke-width="1.6"/><text x="343.0" y="130.0" font-family="inherit" font-size="20" font-weight="500" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="388.0" y="130.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">сумма цифр 6</text><text x="231.0" y="88.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="287.0" y="88.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">−9</text><text x="343.0" y="88.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">−9</text><text x="16.0" y="182.0" font-family="inherit" font-size="14" font-weight="500" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">девяток в конце: 2; изменение суммы 1 − 9 · 2 = −17</text></svg>',
    width: 660,
    height: 200,
    alt: "2399 → 2400: две девятки в конце стали нулями (по −9), тройка перед ними стала четвёркой (+1). Сумма цифр 23 → 6, изменение 1 − 9 · 2 = −17.",
  },
  // run notes: "1: Создана функция `F` — пока только правило. Её тело выполнится, когда функцию вызовут.\n2.1: `n` = `5` — не база. Чтобы умножить на 5, нужен `F(4)`: `F(5)` ждёт.\n2.2: `n` = `4` — не база: `F(4)` ждёт `F(3)`.\n2.3: `n` = `3` — не база: `F(3)` ждёт `F(2)`.\n2.4: `n` = `2` — не база: `F(2)` ждёт `F(1)`.\n2.5: `n` = `1` — база.\n3: `F(1)` возвращает `1` без новых вызовов — тому, кто его ждал, вызову `F(2)`.\n4.1: `F(2)` получил `1` и возвращает `2 * 1` = `2` вызову `F(3)`.\n4.2: `F(3)` получил `2` и возвращает `3 * 2` = `6` вызову `F(4)`.\n4.3: `F(4)` получил `6` и возвращает `4 * 6` = `24` вызову `F(5)`.\n4.4: `F(5)` получил `24` и возвращает `5 * 24` = `120` в строку 7.\n7: `print` выводит `120`."
  runF: {
    kind: "run",
    code: "def F(n):\n    if n == 1:\n        return 1\n    return n * F(n - 1)\n\n\nprint(F(5))",
    fileName: "f.py",
    output: "120",
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
        text: "Создана функция `F` — пока только правило. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Вызывается функция `F`. У вызова свои переменные: `n` = `5`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`n` = `5` — не база. Чтобы умножить на 5, нужен `F(4)`: `F(5)` ждёт.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Вызывается функция `F`. У вызова свои переменные: `n` = `4`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: false }],
          },
          {
            title: "вызов F(4)",
            names: [{ n: "n", v: "4", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`n` = `4` — не база: `F(4)` ждёт `F(3)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: true }],
          },
          {
            title: "вызов F(4)",
            names: [{ n: "n", v: "4", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Вызывается функция `F`. У вызова свои переменные: `n` = `3`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: true }],
          },
          {
            title: "вызов F(4)",
            names: [{ n: "n", v: "4", ref: null, ch: true }],
          },
          {
            title: "вызов F(3)",
            names: [{ n: "n", v: "3", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`n` = `3` — не база: `F(3)` ждёт `F(2)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: true }],
          },
          {
            title: "вызов F(4)",
            names: [{ n: "n", v: "4", ref: null, ch: true }],
          },
          {
            title: "вызов F(3)",
            names: [{ n: "n", v: "3", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Вызывается функция `F`. У вызова свои переменные: `n` = `2`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: true }],
          },
          {
            title: "вызов F(4)",
            names: [{ n: "n", v: "4", ref: null, ch: true }],
          },
          {
            title: "вызов F(3)",
            names: [{ n: "n", v: "3", ref: null, ch: true }],
          },
          {
            title: "вызов F(2)",
            names: [{ n: "n", v: "2", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`n` = `2` — не база: `F(2)` ждёт `F(1)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: true }],
          },
          {
            title: "вызов F(4)",
            names: [{ n: "n", v: "4", ref: null, ch: true }],
          },
          {
            title: "вызов F(3)",
            names: [{ n: "n", v: "3", ref: null, ch: true }],
          },
          {
            title: "вызов F(2)",
            names: [{ n: "n", v: "2", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Вызывается функция `F`. У вызова свои переменные: `n` = `1`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: true }],
          },
          {
            title: "вызов F(4)",
            names: [{ n: "n", v: "4", ref: null, ch: true }],
          },
          {
            title: "вызов F(3)",
            names: [{ n: "n", v: "3", ref: null, ch: true }],
          },
          {
            title: "вызов F(2)",
            names: [{ n: "n", v: "2", ref: null, ch: true }],
          },
          {
            title: "вызов F(1)",
            names: [{ n: "n", v: "1", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`n` = `1` — база.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: true }],
          },
          {
            title: "вызов F(4)",
            names: [{ n: "n", v: "4", ref: null, ch: true }],
          },
          {
            title: "вызов F(3)",
            names: [{ n: "n", v: "3", ref: null, ch: true }],
          },
          {
            title: "вызов F(2)",
            names: [{ n: "n", v: "2", ref: null, ch: true }],
          },
          {
            title: "вызов F(1)",
            names: [{ n: "n", v: "1", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`F(1)` возвращает `1` без новых вызовов — тому, кто его ждал, вызову `F(2)`.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: true }],
          },
          {
            title: "вызов F(4)",
            names: [{ n: "n", v: "4", ref: null, ch: true }],
          },
          {
            title: "вызов F(3)",
            names: [{ n: "n", v: "3", ref: null, ch: true }],
          },
          {
            title: "вызов F(2)",
            names: [{ n: "n", v: "2", ref: null, ch: true }],
          },
          {
            title: "вызов F(1)",
            names: [{ n: "n", v: "1", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`F(2)` получил `1` и возвращает `2 * 1` = `2` вызову `F(3)`.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: true }],
          },
          {
            title: "вызов F(4)",
            names: [{ n: "n", v: "4", ref: null, ch: true }],
          },
          {
            title: "вызов F(3)",
            names: [{ n: "n", v: "3", ref: null, ch: true }],
          },
          {
            title: "вызов F(2)",
            names: [{ n: "n", v: "2", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`F(3)` получил `2` и возвращает `3 * 2` = `6` вызову `F(4)`.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: true }],
          },
          {
            title: "вызов F(4)",
            names: [{ n: "n", v: "4", ref: null, ch: true }],
          },
          {
            title: "вызов F(3)",
            names: [{ n: "n", v: "3", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`F(4)` получил `6` и возвращает `4 * 6` = `24` вызову `F(5)`.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: true }],
          },
          {
            title: "вызов F(4)",
            names: [{ n: "n", v: "4", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`F(5)` получил `24` и возвращает `5 * 24` = `120` в строку 7.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов F(5)",
            names: [{ n: "n", v: "5", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`print` выводит `120`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "F", v: "функция", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "120\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
