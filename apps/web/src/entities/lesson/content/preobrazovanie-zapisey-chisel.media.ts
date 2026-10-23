// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%place_value("1101", 2)%%
  placeValue1101_2: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 196"><rect x="181.0" y="16" width="64" height="56" rx="10" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="213.0" y="54.0" font-family="inherit" font-size="28" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="213.0" y="98.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">× 8</text><text x="213.0" y="130.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><rect x="259.0" y="16" width="64" height="56" rx="10" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="291.0" y="54.0" font-family="inherit" font-size="28" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="291.0" y="98.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">× 4</text><text x="291.0" y="130.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="337.0" y="16" width="64" height="56" rx="10" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="369.0" y="54.0" font-family="inherit" font-size="28" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="369.0" y="98.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">× 2</text><text x="369.0" y="130.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="415.0" y="16" width="64" height="56" rx="10" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="447.0" y="54.0" font-family="inherit" font-size="28" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="447.0" y="98.0" font-family="inherit" font-size="15" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">× 1</text><text x="447.0" y="130.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="169.0" y="98.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">вес</text><text x="330.0" y="172.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8 + 4 + 0 + 1 = 13</text></svg>',
    width: 660,
    height: 196,
    alt: "Разряды записи 1101",
  },
  // %%convert_stepper(29, 3)%%
  convertStepper29_3: {
    kind: "stepper",
    width: 660,
    height: 230,
    frames: [
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="16.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">деление на 3</text><text x="640.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">запись 29 в системе с основанием 3</text><rect x="596.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="618.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="618.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3⁰</text><rect x="544.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="566.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="566.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3¹</text><rect x="492.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="514.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="514.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3²</text><rect x="440.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="462.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="462.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3³</text><text x="640.0" y="150.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">29 — что осталось перевести</text><text x="640.0" y="176.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">цифр пока нет</text></svg>',
        caption:
          "Переводим 29 в систему с основанием 3. Цифры записи появятся справа налево.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="16.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">деление на 3</text><text x="16.0" y="52.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">29 = 3 · 9 + </text><text x="150.0" y="52.0" font-family="inherit" font-size="17" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><text x="640.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">запись 29 в системе с основанием 3</text><rect x="596.0" y="44.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="618.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="618.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3⁰</text><rect x="544.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="566.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="566.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3¹</text><rect x="492.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="514.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="514.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3²</text><rect x="440.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="462.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="462.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3³</text><text x="640.0" y="150.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">остаток 2 — цифра разряда 3⁰</text><text x="640.0" y="176.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">дальше переводим 9</text></svg>',
        caption:
          "29 = 3 · 9 + 2. Остаток 2 — цифра разряда 3⁰, дальше работаем с частным 9.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="16.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">деление на 3</text><text x="16.0" y="52.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">29 = 3 · 9 + </text><text x="150.0" y="52.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><text x="16.0" y="86.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">9 = 3 · 3 + </text><text x="150.0" y="86.0" font-family="inherit" font-size="17" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">0</text><text x="640.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">запись 29 в системе с основанием 3</text><rect x="596.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="618.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="618.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3⁰</text><rect x="544.0" y="44.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="566.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="566.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3¹</text><rect x="492.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="514.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="514.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3²</text><rect x="440.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="462.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="462.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3³</text><text x="640.0" y="150.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">остаток 0 — цифра разряда 3¹</text><text x="640.0" y="176.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">дальше переводим 3</text></svg>',
        caption:
          "9 = 3 · 3 + 0. Остаток 0 — цифра разряда 3¹, дальше работаем с частным 3.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="16.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">деление на 3</text><text x="16.0" y="52.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">29 = 3 · 9 + </text><text x="150.0" y="52.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><text x="16.0" y="86.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">9 = 3 · 3 + </text><text x="150.0" y="86.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">0</text><text x="16.0" y="120.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">3 = 3 · 1 + </text><text x="150.0" y="120.0" font-family="inherit" font-size="17" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">0</text><text x="640.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">запись 29 в системе с основанием 3</text><rect x="596.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="618.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="618.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3⁰</text><rect x="544.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="566.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="566.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3¹</text><rect x="492.0" y="44.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="514.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="514.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3²</text><rect x="440.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="462.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums"></text><text x="462.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3³</text><text x="640.0" y="150.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">остаток 0 — цифра разряда 3²</text><text x="640.0" y="176.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">дальше переводим 1</text></svg>',
        caption:
          "3 = 3 · 1 + 0. Остаток 0 — цифра разряда 3², дальше работаем с частным 1.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="16.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">деление на 3</text><text x="16.0" y="52.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">29 = 3 · 9 + </text><text x="150.0" y="52.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><text x="16.0" y="86.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">9 = 3 · 3 + </text><text x="150.0" y="86.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">0</text><text x="16.0" y="120.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">3 = 3 · 1 + </text><text x="150.0" y="120.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">0</text><text x="16.0" y="154.0" font-family="inherit" font-size="17" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1 = 3 · 0 + </text><text x="150.0" y="154.0" font-family="inherit" font-size="17" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="640.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">запись 29 в системе с основанием 3</text><rect x="596.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="618.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="618.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3⁰</text><rect x="544.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="566.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="566.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3¹</text><rect x="492.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="514.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="514.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3²</text><rect x="440.0" y="44.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="462.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="462.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3³</text><text x="640.0" y="150.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">остаток 1 — цифра разряда 3³</text><text x="640.0" y="176.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">дальше переводим 0</text></svg>',
        caption:
          "1 = 3 · 0 + 1. Остаток 1 — цифра разряда 3³, частное 0 — перевод закончен.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="16.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">деление на 3</text><text x="16.0" y="52.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">29 = 3 · 9 + </text><text x="150.0" y="52.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><text x="16.0" y="86.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">9 = 3 · 3 + </text><text x="150.0" y="86.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">0</text><text x="16.0" y="120.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">3 = 3 · 1 + </text><text x="150.0" y="120.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">0</text><text x="16.0" y="154.0" font-family="inherit" font-size="17" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">1 = 3 · 0 + </text><text x="150.0" y="154.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="640.0" y="24.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">запись 29 в системе с основанием 3</text><rect x="596.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="618.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="618.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3⁰</text><rect x="544.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="566.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="566.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3¹</text><rect x="492.0" y="44.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="514.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="514.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3²</text><rect x="440.0" y="44.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="462.0" y="73.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="462.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3³</text><text x="640.0" y="150.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">29 = 1002₃</text><text x="640.0" y="176.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">остатки снизу вверх</text></svg>',
        caption:
          "Готово: 29 = 1002₃. Первый найденный остаток стоит справа, последний — слева.",
      },
    ],
  },
  // %%lengths(2, 4)%%
  lengths2_4: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 150"><rect x="20.0" y="30" width="41.3" height="30" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="40.7" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="61.3" y="30" width="41.3" height="30" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="82.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="102.7" y="30" width="41.3" height="30" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="123.3" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="144.0" y="30" width="41.3" height="30" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="164.7" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="185.3" y="30" width="41.3" height="30" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="206.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="226.7" y="30" width="41.3" height="30" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="247.3" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><rect x="268.0" y="30" width="41.3" height="30" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="288.7" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><rect x="309.3" y="30" width="41.3" height="30" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="330.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><rect x="350.7" y="30" width="41.3" height="30" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="371.3" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><rect x="392.0" y="30" width="41.3" height="30" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="412.7" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><rect x="433.3" y="30" width="41.3" height="30" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="454.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><rect x="474.7" y="30" width="41.3" height="30" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="495.3" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><rect x="516.0" y="30" width="41.3" height="30" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="536.7" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><rect x="557.3" y="30" width="41.3" height="30" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="578.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><rect x="598.7" y="30" width="41.3" height="30" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="619.3" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><path d="M 22.0 70 v 8 H 59.3 v -8" fill="none" stroke="#ff6a00" stroke-width="1.5"/><text x="40.7" y="96.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">L = 1</text><text x="40.7" y="114.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><path d="M 63.3 70 v 8 H 142.0 v -8" fill="none" stroke="#ff6a00" stroke-width="1.5"/><text x="102.7" y="96.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">L = 2</text><text x="102.7" y="114.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10 … 11</text><path d="M 146.0 70 v 8 H 307.3 v -8" fill="none" stroke="#ff6a00" stroke-width="1.5"/><text x="226.7" y="96.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">L = 3</text><text x="226.7" y="114.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">100 … 111</text><path d="M 311.3 70 v 8 H 638.0 v -8" fill="none" stroke="#ff6a00" stroke-width="1.5"/><text x="474.7" y="96.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">L = 4</text><text x="474.7" y="114.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1000 … 1111</text><text x="330.0" y="142.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">запись из L цифр с основанием 2: от 2ᴸ⁻¹ до 2ᴸ − 1; следующая длина начинается с 2ᴸ</text><text x="20.0" y="20.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">числа и длина их записи</text></svg>',
    width: 660,
    height: 150,
    alt: "Длина записи и диапазон чисел, основание 2",
  },
  // %%append("1011", "1", 2)%%
  append1011_1_2: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 268"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">было: 1011₂ = 11</text><rect x="256.0" y="34.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="278.0" y="63.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="278.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2³</text><rect x="308.0" y="34.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="330.0" y="63.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="330.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2²</text><rect x="360.0" y="34.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="382.0" y="63.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="382.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2¹</text><rect x="412.0" y="34.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="434.0" y="63.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="434.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2⁰</text><line x1="278.0" y1="102.0" x2="233.4" y2="132.9" stroke="#ff6a00" stroke-width="1.5"/><path d="M 226.0 138.0 L 230.8 129.2 L 236.0 136.6 Z" fill="#ff6a00"/><line x1="330.0" y1="102.0" x2="285.4" y2="132.9" stroke="#ff6a00" stroke-width="1.5"/><path d="M 278.0 138.0 L 282.8 129.2 L 288.0 136.6 Z" fill="#ff6a00"/><line x1="382.0" y1="102.0" x2="337.4" y2="132.9" stroke="#ff6a00" stroke-width="1.5"/><path d="M 330.0 138.0 L 334.8 129.2 L 340.0 136.6 Z" fill="#ff6a00"/><line x1="434.0" y1="102.0" x2="389.4" y2="132.9" stroke="#ff6a00" stroke-width="1.5"/><path d="M 382.0 138.0 L 386.8 129.2 L 392.0 136.6 Z" fill="#ff6a00"/><text x="16.0" y="140.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">стало: 10111₂ = 23</text><rect x="204.0" y="148.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="226.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="226.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2⁴</text><rect x="256.0" y="148.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="278.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="278.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2³</text><rect x="308.0" y="148.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="330.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="330.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2²</text><rect x="360.0" y="148.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="382.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="382.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2¹</text><rect x="412.0" y="148.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="434.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="434.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2⁰</text><text x="330.0" y="236.0" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">R = 11 · 2¹ + 1₂ = 22 + 1 = 23</text><text x="330.0" y="258.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">старые цифры сдвинулись на 1 разряд влево: вес каждой вырос в 2 раз</text></svg>',
    width: 660,
    height: 268,
    alt: "Дописывание 1 к записи 1011",
  },
  // %%append("1011", "01", 2)%%
  append1011_01_2: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 268"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">было: 1011₂ = 11</text><rect x="282.0" y="34.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="304.0" y="63.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="304.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2³</text><rect x="334.0" y="34.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="356.0" y="63.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="356.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2²</text><rect x="386.0" y="34.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="408.0" y="63.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="408.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2¹</text><rect x="438.0" y="34.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="460.0" y="63.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="460.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2⁰</text><line x1="304.0" y1="102.0" x2="208.5" y2="135.1" stroke="#ff6a00" stroke-width="1.5"/><path d="M 200.0 138.0 L 207.0 130.8 L 210.0 139.3 Z" fill="#ff6a00"/><line x1="356.0" y1="102.0" x2="260.5" y2="135.1" stroke="#ff6a00" stroke-width="1.5"/><path d="M 252.0 138.0 L 259.0 130.8 L 262.0 139.3 Z" fill="#ff6a00"/><line x1="408.0" y1="102.0" x2="312.5" y2="135.1" stroke="#ff6a00" stroke-width="1.5"/><path d="M 304.0 138.0 L 311.0 130.8 L 314.0 139.3 Z" fill="#ff6a00"/><line x1="460.0" y1="102.0" x2="364.5" y2="135.1" stroke="#ff6a00" stroke-width="1.5"/><path d="M 356.0 138.0 L 363.0 130.8 L 366.0 139.3 Z" fill="#ff6a00"/><text x="16.0" y="140.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">стало: 101101₂ = 45</text><rect x="178.0" y="148.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="200.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="200.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2⁵</text><rect x="230.0" y="148.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="252.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="252.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2⁴</text><rect x="282.0" y="148.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="304.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="304.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2³</text><rect x="334.0" y="148.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="356.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="356.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2²</text><rect x="386.0" y="148.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="408.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="408.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2¹</text><rect x="438.0" y="148.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="460.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="460.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2⁰</text><text x="330.0" y="236.0" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">R = 11 · 2² + 01₂ = 44 + 1 = 45</text><text x="330.0" y="258.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">старые цифры сдвинулись на 2 разряда влево: вес каждой вырос в 4 раз</text></svg>',
    width: 660,
    height: 268,
    alt: "Дописывание 01 к записи 1011",
  },
  // %%append("1011", "10", 2, "left")%%
  append1011_10_2_left: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 268"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">было: 1011₂ = 11</text><rect x="282.0" y="34.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="304.0" y="63.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="304.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2³</text><rect x="334.0" y="34.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="356.0" y="63.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="356.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2²</text><rect x="386.0" y="34.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="408.0" y="63.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="408.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2¹</text><rect x="438.0" y="34.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="460.0" y="63.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="460.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2⁰</text><line x1="304.0" y1="102.0" x2="304.0" y2="129.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 304.0 138.0 L 299.5 129.0 L 308.5 129.0 Z" fill="#d9d9d4"/><line x1="356.0" y1="102.0" x2="356.0" y2="129.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 356.0 138.0 L 351.5 129.0 L 360.5 129.0 Z" fill="#d9d9d4"/><line x1="408.0" y1="102.0" x2="408.0" y2="129.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 408.0 138.0 L 403.5 129.0 L 412.5 129.0 Z" fill="#d9d9d4"/><line x1="460.0" y1="102.0" x2="460.0" y2="129.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 460.0 138.0 L 455.5 129.0 L 464.5 129.0 Z" fill="#d9d9d4"/><text x="16.0" y="140.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">стало: 101011₂ = 43</text><rect x="178.0" y="148.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="200.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="200.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2⁵</text><rect x="230.0" y="148.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="252.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="252.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2⁴</text><rect x="282.0" y="148.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="304.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="304.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2³</text><rect x="334.0" y="148.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="356.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="356.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2²</text><rect x="386.0" y="148.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="408.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="408.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2¹</text><rect x="438.0" y="148.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="460.0" y="177.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="460.0" y="210.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2⁰</text><text x="330.0" y="236.0" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">R = 10₂ · 2⁴ + 11 = 32 + 11 = 43</text><text x="330.0" y="258.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">старые цифры остались на месте; новый блок стоит над разрядами от 2⁴</text></svg>',
    width: 660,
    height: 268,
    alt: "Дописывание 10 к записи 1011",
  },
  // %%slice("101110", 1, 4)%%
  slice101110_1_4: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 156"><rect x="30" y="30" width="46" height="46" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="53.0" y="60.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="53.0" y="21.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="53.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">-6</text><rect x="76" y="30" width="46" height="46" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="99.0" y="60.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="99.0" y="21.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="99.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">-5</text><text x="99.0" y="120.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1-й</text><rect x="122" y="30" width="46" height="46" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="145.0" y="60.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="145.0" y="21.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="145.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">-4</text><text x="145.0" y="120.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">2-й</text><rect x="168" y="30" width="46" height="46" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="191.0" y="60.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="191.0" y="21.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="191.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">-3</text><text x="191.0" y="120.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">3-й</text><rect x="214" y="30" width="46" height="46" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="237.0" y="60.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="237.0" y="21.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="237.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">-2</text><rect x="260" y="30" width="46" height="46" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="283.0" y="60.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="283.0" y="21.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="283.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">-1</text><text x="332.0" y="42.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">индекс от начала</text><text x="332.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">индекс с конца</text><text x="332.0" y="66.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">s[1:4] → &#x27;011&#x27;</text><line x1="76" y1="26" x2="76" y2="80" stroke="#17191e" stroke-width="2.5"/><line x1="214" y1="26" x2="214" y2="80" stroke="#17191e" stroke-width="2.5"/></svg>',
    width: 660,
    height: 156,
    alt: "Срез строки 101110",
  },
  // %%invert("10110", 2)%%
  invert10110_2: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 214"><text x="132.0" y="41.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">N</text><rect x="150.0" y="12.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="172.0" y="41.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="202.0" y="12.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="224.0" y="41.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="254.0" y="12.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="276.0" y="41.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="306.0" y="12.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="328.0" y="41.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="358.0" y="12.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="380.0" y="41.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="420.0" y="41.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 22</text><text x="132.0" y="99.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">M</text><rect x="150.0" y="70.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="172.0" y="99.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="202.0" y="70.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="224.0" y="99.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="254.0" y="70.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="276.0" y="99.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="306.0" y="70.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="328.0" y="99.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="358.0" y="70.0" width="44" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="380.0" y="99.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="420.0" y="99.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">= 9</text><text x="132.0" y="157.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="end" style="font-variant-numeric:tabular-nums">N + M</text><rect x="150.0" y="128.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="172.0" y="157.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="202.0" y="128.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="224.0" y="157.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="254.0" y="128.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="276.0" y="157.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="306.0" y="128.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="328.0" y="157.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="358.0" y="128.0" width="44" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="380.0" y="157.9" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="420.0" y="157.0" font-family="inherit" font-size="17" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">= 31</text><line x1="146" y1="122" x2="406" y2="122" stroke="#17191e" stroke-width="1.25"/><text x="330.0" y="204.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">в каждом столбце 1, поэтому N + M = 2⁵ − 1 = 31 и M = 31 − 22 = 9</text></svg>',
    width: 660,
    height: 214,
    alt: "Инверсия записи 10110",
  },
  // %%parity(12, 13)%%
  parity12_13: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 214"><text x="16.0" y="20.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">N = 12, единиц 2 — чётно</text><rect x="16.0" y="34.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="33.0" y="57.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="55.0" y="34.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="72.0" y="57.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="94.0" y="34.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="111.0" y="57.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="133.0" y="34.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="150.0" y="57.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="254.0" y="49.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">запись N</text><text x="254.0" y="65.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">единиц 2</text><rect x="16.0" y="86.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="33.0" y="109.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="55.0" y="86.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="72.0" y="109.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="94.0" y="86.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="111.0" y="109.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="133.0" y="86.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="150.0" y="109.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="172.0" y="86.0" width="34" height="34" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="189.0" y="109.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="254.0" y="101.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">дописали 0</text><text x="254.0" y="117.0" font-family="inherit" font-size="12" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">единиц 2</text><rect x="16.0" y="138.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="33.0" y="161.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="55.0" y="138.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="72.0" y="161.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="94.0" y="138.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="111.0" y="161.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="133.0" y="138.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="150.0" y="161.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="172.0" y="138.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="189.0" y="161.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="211.0" y="138.0" width="34" height="34" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="228.0" y="161.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="254.0" y="153.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">дописали 0</text><text x="254.0" y="169.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">единиц 2</text><text x="16.0" y="204.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">хвост 00: R = 4 · 12 + 0 = 48</text><text x="346.0" y="20.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">N = 13, единиц 3 — нечётно</text><rect x="346.0" y="34.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="363.0" y="57.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="385.0" y="34.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="402.0" y="57.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="424.0" y="34.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="441.0" y="57.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="463.0" y="34.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="480.0" y="57.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="584.0" y="49.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">запись N</text><text x="584.0" y="65.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">единиц 3</text><rect x="346.0" y="86.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="363.0" y="109.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="385.0" y="86.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="402.0" y="109.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="424.0" y="86.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="441.0" y="109.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="463.0" y="86.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="480.0" y="109.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="502.0" y="86.0" width="34" height="34" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="519.0" y="109.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="584.0" y="101.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">дописали 1</text><text x="584.0" y="117.0" font-family="inherit" font-size="12" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">единиц 4</text><rect x="346.0" y="138.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="363.0" y="161.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="385.0" y="138.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="402.0" y="161.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="424.0" y="138.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="441.0" y="161.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="463.0" y="138.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="480.0" y="161.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="502.0" y="138.0" width="34" height="34" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="519.0" y="161.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="541.0" y="138.0" width="34" height="34" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="558.0" y="161.1" font-family="inherit" font-size="22" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="584.0" y="153.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">дописали 0</text><text x="584.0" y="169.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">единиц 4</text><text x="346.0" y="204.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">хвост 10: R = 4 · 13 + 2 = 54</text></svg>',
    width: 660,
    height: 214,
    alt: "Дважды дописанный остаток суммы цифр",
  },
  // %%rn_plot("even111_odd0", 1, 12, 8)%%
  rnPloteven111odd0_1_12_8: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 262"><line x1="72" y1="214" x2="640" y2="214" stroke="#17191e" stroke-width="1.25"/><line x1="72" y1="22" x2="72" y2="214" stroke="#17191e" stroke-width="1.25"/><text x="64.0" y="26.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">R</text><text x="644.0" y="218.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">N</text><text x="72.0" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="123.6" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="175.3" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="226.9" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="278.5" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="330.2" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="381.8" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="433.5" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="485.1" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="536.7" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="588.4" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="640.0" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><line x1="72" y1="200.2" x2="640" y2="200.2" stroke="#4d535e" stroke-width="1.25" stroke-dasharray="5 4"/><text x="66.0" y="204.2" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">R &gt; 8</text><circle cx="72.0" cy="210.5" r="4" fill="#fff" stroke="#4d535e" stroke-width="1.5"/><text x="72.0" y="200.5" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><circle cx="123.6" cy="174.2" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><text x="123.6" y="164.2" font-family="inherit" font-size="11" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">23</text><circle cx="175.3" cy="203.6" r="4" fill="#fff" stroke="#4d535e" stroke-width="1.5"/><text x="175.3" y="193.6" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><circle cx="226.9" cy="146.5" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><text x="226.9" y="136.5" font-family="inherit" font-size="11" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">39</text><circle cx="278.5" cy="196.7" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><text x="278.5" y="186.7" font-family="inherit" font-size="11" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><circle cx="330.2" cy="118.9" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><text x="330.2" y="108.9" font-family="inherit" font-size="11" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">55</text><circle cx="381.8" cy="189.8" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><text x="381.8" y="179.8" font-family="inherit" font-size="11" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><circle cx="433.5" cy="91.2" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><text x="433.5" y="81.2" font-family="inherit" font-size="11" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">71</text><circle cx="485.1" cy="182.9" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><text x="485.1" y="172.9" font-family="inherit" font-size="11" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><circle cx="536.7" cy="63.5" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><text x="536.7" y="53.5" font-family="inherit" font-size="11" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">87</text><circle cx="588.4" cy="175.9" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><text x="588.4" y="165.9" font-family="inherit" font-size="11" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">22</text><circle cx="640.0" cy="35.8" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><text x="640.0" y="25.8" font-family="inherit" font-size="11" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">103</text><circle cx="123.6" cy="174.2" r="11" fill="none" stroke="#ff6a00" stroke-width="2"/><rect x="267.5" y="185.7" width="22" height="22" rx="3" fill="none" stroke="#ff6a00" stroke-width="2"/><text x="330.0" y="254.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">● — подходящие входы;   ○ — первое подходящее N;   □ — наименьший подходящий R</text></svg>',
    width: 660,
    height: 262,
    alt: "Результаты алгоритма: чётному N дописать 111, нечётному — 0",
  },
  // %%blocks(2, 2, [5, 6, 7])%%
  blocks2_2: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 150"><rect x="30.0" y="40" width="50.0" height="34" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="55.0" y="62.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="80.0" y="40" width="50.0" height="34" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="105.0" y="62.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">21</text><rect x="130.0" y="40" width="50.0" height="34" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="155.0" y="62.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">22</text><rect x="180.0" y="40" width="50.0" height="34" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="205.0" y="62.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">23</text><rect x="230.0" y="40" width="50.0" height="34" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="255.0" y="62.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">24</text><rect x="280.0" y="40" width="50.0" height="34" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="305.0" y="62.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">25</text><rect x="330.0" y="40" width="50.0" height="34" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="355.0" y="62.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">26</text><rect x="380.0" y="40" width="50.0" height="34" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="405.0" y="62.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">27</text><rect x="430.0" y="40" width="50.0" height="34" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="455.0" y="62.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">28</text><rect x="480.0" y="40" width="50.0" height="34" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="505.0" y="62.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">29</text><rect x="530.0" y="40" width="50.0" height="34" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="555.0" y="62.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">30</text><rect x="580.0" y="40" width="50.0" height="34" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="605.0" y="62.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">31</text><path d="M 32.0 84 v 8 H 228.0 v -8" fill="none" stroke="#ff6a00" stroke-width="1.5"/><text x="130.0" y="112.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">N = 5</text><text x="130.0" y="30.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5·4 … 5·4 + 3</text><path d="M 232.0 84 v 8 H 428.0 v -8" fill="none" stroke="#ff6a00" stroke-width="1.5"/><text x="330.0" y="112.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">N = 6</text><text x="330.0" y="30.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6·4 … 6·4 + 3</text><path d="M 432.0 84 v 8 H 628.0 v -8" fill="none" stroke="#ff6a00" stroke-width="1.5"/><text x="530.0" y="112.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">N = 7</text><text x="530.0" y="30.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7·4 … 7·4 + 3</text><text x="330.0" y="140.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">дописаны 2 цифры в системе с основанием 2: блок N кончается раньше, чем начинается блок N + 1</text></svg>',
    width: 660,
    height: 150,
    alt: "Блоки результатов при дописывании 2 цифр",
  },
  // %%rn_plot("tern7", 1, 33, 300, False)%%
  rnPlottern7_1_33_300_False: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 262"><line x1="72" y1="214" x2="640" y2="214" stroke="#17191e" stroke-width="1.25"/><line x1="72" y1="22" x2="72" y2="214" stroke="#17191e" stroke-width="1.25"/><text x="64.0" y="26.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">R</text><text x="644.0" y="218.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">N</text><text x="72.0" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="107.5" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="143.0" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="178.5" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="214.0" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="249.5" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="285.0" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="320.5" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="356.0" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="391.5" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="427.0" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">21</text><text x="462.5" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">23</text><text x="498.0" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">25</text><text x="533.5" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">27</text><text x="569.0" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">29</text><text x="604.5" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">31</text><text x="640.0" y="232.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">33</text><line x1="72" y1="153.4" x2="640" y2="153.4" stroke="#4d535e" stroke-width="1.25" stroke-dasharray="5 4"/><text x="66.0" y="157.4" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">R ≤ 300</text><circle cx="72.0" cy="210.8" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="89.8" cy="200.3" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="107.5" cy="207.9" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="125.2" cy="205.3" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="143.0" cy="183.9" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="160.8" cy="201.9" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="178.5" cy="199.9" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="196.2" cy="167.6" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="214.0" cy="197.6" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="231.8" cy="194.4" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="249.5" cy="151.2" r="4" fill="#fff" stroke="#4d535e" stroke-width="1.5"/><circle cx="267.2" cy="191.6" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="285.0" cy="189.0" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="302.8" cy="134.9" r="4" fill="#fff" stroke="#4d535e" stroke-width="1.5"/><circle cx="320.5" cy="185.5" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="338.2" cy="183.5" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="356.0" cy="118.5" r="4" fill="#fff" stroke="#4d535e" stroke-width="1.5"/><circle cx="373.8" cy="181.3" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="391.5" cy="178.1" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="409.2" cy="102.2" r="4" fill="#fff" stroke="#4d535e" stroke-width="1.5"/><circle cx="427.0" cy="175.2" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="444.8" cy="172.6" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="462.5" cy="85.8" r="4" fill="#fff" stroke="#4d535e" stroke-width="1.5"/><circle cx="480.2" cy="169.2" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="498.0" cy="167.2" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="515.8" cy="69.4" r="4" fill="#fff" stroke="#4d535e" stroke-width="1.5"/><circle cx="533.5" cy="164.9" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="551.2" cy="161.7" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="569.0" cy="53.1" r="4" fill="#fff" stroke="#4d535e" stroke-width="1.5"/><circle cx="586.8" cy="158.9" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="604.5" cy="156.3" r="5" fill="#17191e" stroke="#17191e" stroke-width="1.5"/><circle cx="622.2" cy="36.7" r="4" fill="#fff" stroke="#4d535e" stroke-width="1.5"/><circle cx="640.0" cy="152.8" r="4" fill="#fff" stroke="#4d535e" stroke-width="1.5"/><rect x="593.5" y="145.3" width="22" height="22" rx="3" fill="none" stroke="#ff6a00" stroke-width="2"/><text x="330.0" y="254.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">● — подходящие входы;   □ — наибольший подходящий R</text></svg>',
    width: 660,
    height: 262,
    alt: "Результаты алгоритма: троичный: копия двух цифр или запись 7·(N mod 3)",
  },
  runToBase: {
    kind: "run",
    code: "def to_base(n, q):\n    if n == 0:\n        return '0'\n\n    s = ''\n    x = n\n\n    while x > 0:\n        digit = x % q\n        s = str(digit) + s\n        x = x // q\n\n    return s\n\n\ns = to_base(29, 3)\nprint(s)\nprint(int(s, 3))",
    fileName: "to_base.py",
    output: "1002\n29",
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
        text: "Создана функция `to_base`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 16,
        text: "Вызывается функция `to_base`. У вызова свои переменные: `n` = `29`, `q` = `3`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: true },
              { n: "q", v: "3", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Проверка `n == 0` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`s` получает значение `''`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "''", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "`x` получает то же, что `n`: теперь оба имени ведут к `29`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "''", ref: null, ch: false },
              { n: "x", v: "29", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "Проверка `x > 0` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "''", ref: null, ch: false },
              { n: "x", v: "29", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 9,
        text: "Python вычисляет `x % q` → `2`, и `digit` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "''", ref: null, ch: false },
              { n: "x", v: "29", ref: null, ch: false },
              { n: "digit", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `str(digit) + s` → `'2'`, и `s` получает это значение. Прежнее значение `''` больше не связано с `s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'2'", ref: null, ch: true },
              { n: "x", v: "29", ref: null, ch: false },
              { n: "digit", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 11,
        text: "Python вычисляет `x // q` → `9`, и `x` получает это значение. Прежнее значение `29` больше не связано с `x`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'2'", ref: null, ch: false },
              { n: "x", v: "9", ref: null, ch: true },
              { n: "digit", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "Проверка `x > 0` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'2'", ref: null, ch: false },
              { n: "x", v: "9", ref: null, ch: false },
              { n: "digit", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 9,
        text: "Python вычисляет `x % q` → `0`, и `digit` получает это значение. Прежнее значение `2` больше не связано с `digit`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'2'", ref: null, ch: false },
              { n: "x", v: "9", ref: null, ch: false },
              { n: "digit", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `str(digit) + s` → `'02'`, и `s` получает это значение. Прежнее значение `'2'` больше не связано с `s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'02'", ref: null, ch: true },
              { n: "x", v: "9", ref: null, ch: false },
              { n: "digit", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 11,
        text: "Python вычисляет `x // q` → `3`, и `x` получает это значение. Прежнее значение `9` больше не связано с `x`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'02'", ref: null, ch: false },
              { n: "x", v: "3", ref: null, ch: true },
              { n: "digit", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "Проверка `x > 0` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'02'", ref: null, ch: false },
              { n: "x", v: "3", ref: null, ch: false },
              { n: "digit", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 9,
        text: "Python вычисляет `x % q` → `0`, и `digit` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'02'", ref: null, ch: false },
              { n: "x", v: "3", ref: null, ch: false },
              { n: "digit", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `str(digit) + s` → `'002'`, и `s` получает это значение. Прежнее значение `'02'` больше не связано с `s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'002'", ref: null, ch: true },
              { n: "x", v: "3", ref: null, ch: false },
              { n: "digit", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 11,
        text: "Python вычисляет `x // q` → `1`, и `x` получает это значение. Прежнее значение `3` больше не связано с `x`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'002'", ref: null, ch: false },
              { n: "x", v: "1", ref: null, ch: true },
              { n: "digit", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "Проверка `x > 0` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'002'", ref: null, ch: false },
              { n: "x", v: "1", ref: null, ch: false },
              { n: "digit", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 9,
        text: "Python вычисляет `x % q` → `1`, и `digit` получает это значение. Прежнее значение `0` больше не связано с `digit`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'002'", ref: null, ch: false },
              { n: "x", v: "1", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `str(digit) + s` → `'1002'`, и `s` получает это значение. Прежнее значение `'002'` больше не связано с `s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'1002'", ref: null, ch: true },
              { n: "x", v: "1", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 11,
        text: "Python вычисляет `x // q` → `0`, и `x` получает это значение. Прежнее значение `1` больше не связано с `x`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'1002'", ref: null, ch: false },
              { n: "x", v: "0", ref: null, ch: true },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "Проверка `x > 0` даёт `False` — цикл закончен, программа идёт дальше.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'1002'", ref: null, ch: false },
              { n: "x", v: "0", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 13,
        text: "Функция возвращает `'1002'` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "to_base", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов to_base(29, 3)",
            names: [
              { n: "n", v: "29", ref: null, ch: false },
              { n: "q", v: "3", ref: null, ch: false },
              { n: "s", v: "'1002'", ref: null, ch: false },
              { n: "x", v: "0", ref: null, ch: false },
              { n: "digit", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 16,
        text: "Python вычисляет `to_base(29, 3)` → `'1002'`, и `s` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "to_base", v: "функция", ref: null, ch: false },
              { n: "s", v: "'1002'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 17,
        text: "На экран выводится «1002».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "to_base", v: "функция", ref: null, ch: false },
              { n: "s", v: "'1002'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "1002\n",
      },
      {
        line: 18,
        text: "На экран выводится «29».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "to_base", v: "функция", ref: null, ch: false },
              { n: "s", v: "'1002'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "1002\n29\n",
      },
    ],
  },
  runTransform: {
    kind: "run",
    code: "def transform(n):\n    s = bin(n)[2:]\n    if n % 2 == 0:\n        s = '1' + s + '0'\n    else:\n        s = '11' + s + '1'\n    return int(s, 2)\n\n\nprint(transform(6))\nprint(transform(7))",
    fileName: "transform.py",
    output: "28\n63",
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
        text: "Создана функция `transform`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "transform", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "Вызывается функция `transform`. У вызова свои переменные: `n` = `6`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "transform", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов transform(6)",
            names: [{ n: "n", v: "6", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Python вычисляет `bin(n)[2:]` → `'110'`, и `s` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "transform", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов transform(6)",
            names: [
              { n: "n", v: "6", ref: null, ch: false },
              { n: "s", v: "'110'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `n % 2 == 0` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "transform", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов transform(6)",
            names: [
              { n: "n", v: "6", ref: null, ch: false },
              { n: "s", v: "'110'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `'1' + s + '0'` → `'11100'`, и `s` получает это значение. Прежнее значение `'110'` больше не связано с `s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "transform", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов transform(6)",
            names: [
              { n: "n", v: "6", ref: null, ch: false },
              { n: "s", v: "'11100'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Функция возвращает `28` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "transform", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов transform(6)",
            names: [
              { n: "n", v: "6", ref: null, ch: false },
              { n: "s", v: "'11100'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "На экран выводится «28».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "transform", v: "функция", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "28\n",
      },
      {
        line: 11,
        text: "Вызывается функция `transform`. У вызова свои переменные: `n` = `7`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "transform", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов transform(7)",
            names: [{ n: "n", v: "7", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "28\n",
      },
      {
        line: 2,
        text: "Python вычисляет `bin(n)[2:]` → `'111'`, и `s` получает это значение. Прежнее значение `'11100'` больше не связано с `s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "transform", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов transform(7)",
            names: [
              { n: "n", v: "7", ref: null, ch: false },
              { n: "s", v: "'111'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "28\n",
      },
      {
        line: 3,
        text: "Проверка `n % 2 == 0` даёт `False` — блок пропускается, дальше следующая проверка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "transform", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов transform(7)",
            names: [
              { n: "n", v: "7", ref: null, ch: false },
              { n: "s", v: "'111'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "28\n",
      },
      {
        line: 6,
        text: "Python вычисляет `'11' + s + '1'` → `'111111'`, и `s` получает это значение. Прежнее значение `'111'` больше не связано с `s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "transform", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов transform(7)",
            names: [
              { n: "n", v: "7", ref: null, ch: false },
              { n: "s", v: "'111111'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "28\n",
      },
      {
        line: 7,
        text: "Функция возвращает `63` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "transform", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов transform(7)",
            names: [
              { n: "n", v: "7", ref: null, ch: false },
              { n: "s", v: "'111111'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "28\n",
      },
      {
        line: 11,
        text: "На экран выводится «63».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "transform", v: "функция", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "28\n63\n",
      },
    ],
  },
  runInvert: {
    kind: "run",
    code: "s = '10110'\nnew_s = ''\nfor digit in s:\n    if digit == '0':\n        new_s = new_s + '1'\n    else:\n        new_s = new_s + '0'\nprint(new_s)",
    fileName: "invert.py",
    output: "01001",
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
        text: "`s` получает значение `'10110'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "s", v: "'10110'", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`new_s` получает значение `''`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "''", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт первое значение: `digit` = `'1'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "''", ref: null, ch: false },
              { n: "digit", v: "'1'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `digit == '0'` даёт `False` — блок пропускается, дальше следующая проверка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "''", ref: null, ch: false },
              { n: "digit", v: "'1'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Python вычисляет `new_s + '0'` → `'0'`, и `new_s` получает это значение. Прежнее значение `''` больше не связано с `new_s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'0'", ref: null, ch: true },
              { n: "digit", v: "'1'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `digit` = `'0'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'0'", ref: null, ch: false },
              { n: "digit", v: "'0'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `digit == '0'` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'0'", ref: null, ch: false },
              { n: "digit", v: "'0'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `new_s + '1'` → `'01'`, и `new_s` получает это значение. Прежнее значение `'0'` больше не связано с `new_s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'01'", ref: null, ch: true },
              { n: "digit", v: "'0'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `digit` = `'1'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'01'", ref: null, ch: false },
              { n: "digit", v: "'1'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `digit == '0'` даёт `False` — блок пропускается, дальше следующая проверка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'01'", ref: null, ch: false },
              { n: "digit", v: "'1'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Python вычисляет `new_s + '0'` → `'010'`, и `new_s` получает это значение. Прежнее значение `'01'` больше не связано с `new_s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'010'", ref: null, ch: true },
              { n: "digit", v: "'1'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `digit` = `'1'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'010'", ref: null, ch: false },
              { n: "digit", v: "'1'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `digit == '0'` даёт `False` — блок пропускается, дальше следующая проверка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'010'", ref: null, ch: false },
              { n: "digit", v: "'1'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Python вычисляет `new_s + '0'` → `'0100'`, и `new_s` получает это значение. Прежнее значение `'010'` больше не связано с `new_s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'0100'", ref: null, ch: true },
              { n: "digit", v: "'1'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `digit` = `'0'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'0100'", ref: null, ch: false },
              { n: "digit", v: "'0'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `digit == '0'` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'0100'", ref: null, ch: false },
              { n: "digit", v: "'0'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `new_s + '1'` → `'01001'`, и `new_s` получает это значение. Прежнее значение `'0100'` больше не связано с `new_s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'01001'", ref: null, ch: true },
              { n: "digit", v: "'0'", ref: null, ch: false },
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
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'01001'", ref: null, ch: false },
              { n: "digit", v: "'0'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "На экран выводится «01001».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'10110'", ref: null, ch: false },
              { n: "new_s", v: "'01001'", ref: null, ch: false },
              { n: "digit", v: "'0'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "01001\n",
      },
    ],
  },
  runParity: {
    kind: "run",
    code: "def parity_twice(n):\n    s = bin(n)[2:]\n    s = s + str(s.count('1') % 2)\n    s = s + str(s.count('1') % 2)\n    return int(s, 2)\n\n\ndef parity_copied(n):\n    s = bin(n)[2:]\n    bit = str(s.count('1') % 2)\n    return int(s + bit + bit, 2)\n\n\nprint(parity_twice(13), parity_copied(13))",
    fileName: "parity.py",
    output: "54 55",
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
        text: "Создана функция `parity_twice`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "parity_twice", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "Создана функция `parity_copied`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "parity_twice", v: "функция", ref: null, ch: false },
              { n: "parity_copied", v: "функция", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 14,
        text: "Вызывается функция `parity_twice`. У вызова свои переменные: `n` = `13`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [
              { n: "parity_twice", v: "функция", ref: null, ch: false },
              { n: "parity_copied", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов parity_twice(13)",
            names: [{ n: "n", v: "13", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Python вычисляет `bin(n)[2:]` → `'1101'`, и `s` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "parity_twice", v: "функция", ref: null, ch: false },
              { n: "parity_copied", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов parity_twice(13)",
            names: [
              { n: "n", v: "13", ref: null, ch: false },
              { n: "s", v: "'1101'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Python вычисляет `s + str(s.count('1') % 2)` → `'11011'`, и `s` получает это значение. Прежнее значение `'1101'` больше не связано с `s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "parity_twice", v: "функция", ref: null, ch: false },
              { n: "parity_copied", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов parity_twice(13)",
            names: [
              { n: "n", v: "13", ref: null, ch: false },
              { n: "s", v: "'11011'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `s + str(s.count('1') % 2)` → `'110110'`, и `s` получает это значение. Прежнее значение `'11011'` больше не связано с `s`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "parity_twice", v: "функция", ref: null, ch: false },
              { n: "parity_copied", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов parity_twice(13)",
            names: [
              { n: "n", v: "13", ref: null, ch: false },
              { n: "s", v: "'110110'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Функция возвращает `54` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [
              { n: "parity_twice", v: "функция", ref: null, ch: false },
              { n: "parity_copied", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов parity_twice(13)",
            names: [
              { n: "n", v: "13", ref: null, ch: false },
              { n: "s", v: "'110110'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 14,
        text: "Вызывается функция `parity_copied`. У вызова свои переменные: `n` = `13`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [
              { n: "parity_twice", v: "функция", ref: null, ch: false },
              { n: "parity_copied", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов parity_copied(13)",
            names: [{ n: "n", v: "13", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 9,
        text: "Python вычисляет `bin(n)[2:]` → `'1101'`, и `s` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "parity_twice", v: "функция", ref: null, ch: false },
              { n: "parity_copied", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов parity_copied(13)",
            names: [
              { n: "n", v: "13", ref: null, ch: false },
              { n: "s", v: "'1101'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `str(s.count('1') % 2)` → `'1'`, и `bit` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "parity_twice", v: "функция", ref: null, ch: false },
              { n: "parity_copied", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов parity_copied(13)",
            names: [
              { n: "n", v: "13", ref: null, ch: false },
              { n: "s", v: "'1101'", ref: null, ch: false },
              { n: "bit", v: "'1'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 11,
        text: "Функция возвращает `55` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [
              { n: "parity_twice", v: "функция", ref: null, ch: false },
              { n: "parity_copied", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов parity_copied(13)",
            names: [
              { n: "n", v: "13", ref: null, ch: false },
              { n: "s", v: "'1101'", ref: null, ch: false },
              { n: "bit", v: "'1'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 14,
        text: "На экран выводится «54 55».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "parity_twice", v: "функция", ref: null, ch: false },
              { n: "parity_copied", v: "функция", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "54 55\n",
      },
    ],
  },
  runWindows: {
    kind: "run",
    code: "def transform_windows(n):\n    s = str(n)\n    values = []\n\n    for i in range(len(s) - 2):\n        part = s[i:i + 3]\n        values.append(int(part))\n\n    return max(values) - min(values)\n\n\nprint(transform_windows(30042))",
    fileName: "windows.py",
    output: "296",
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
        text: "Создана функция `transform_windows`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 12,
        text: "Вызывается функция `transform_windows`. У вызова свои переменные: `n` = `30042`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [{ n: "n", v: "30042", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Python вычисляет `str(n)` → `'30042'`, и `s` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [
              { n: "n", v: "30042", ref: null, ch: false },
              { n: "s", v: "'30042'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`values` получает значение `[]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [
              { n: "n", v: "30042", ref: null, ch: false },
              { n: "s", v: "'30042'", ref: null, ch: false },
              { n: "values", v: "[]", ref: 0, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[]", ch: true } },
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт первое значение: `i` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [
              { n: "n", v: "30042", ref: null, ch: false },
              { n: "s", v: "'30042'", ref: null, ch: false },
              { n: "values", v: "[]", ref: 0, ch: false },
              { n: "i", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `s[i:i + 3]` → `'300'`, и `part` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [
              { n: "n", v: "30042", ref: null, ch: false },
              { n: "s", v: "'30042'", ref: null, ch: false },
              { n: "values", v: "[]", ref: 0, ch: false },
              { n: "i", v: "0", ref: null, ch: false },
              { n: "part", v: "'300'", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "`values.append(int(part))` меняет сам список, к которому ведёт `values`; новый не создаётся.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [
              { n: "n", v: "30042", ref: null, ch: false },
              { n: "s", v: "'30042'", ref: null, ch: false },
              { n: "values", v: "[300]", ref: 0, ch: true },
              { n: "i", v: "0", ref: null, ch: false },
              { n: "part", v: "'300'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[300]", ch: true } },
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт следующее значение: `i` = `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [
              { n: "n", v: "30042", ref: null, ch: false },
              { n: "s", v: "'30042'", ref: null, ch: false },
              { n: "values", v: "[300]", ref: 0, ch: false },
              { n: "i", v: "1", ref: null, ch: true },
              { n: "part", v: "'300'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[300]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `s[i:i + 3]` → `'004'`, и `part` получает это значение. Прежнее значение `'300'` больше не связано с `part`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [
              { n: "n", v: "30042", ref: null, ch: false },
              { n: "s", v: "'30042'", ref: null, ch: false },
              { n: "values", v: "[300]", ref: 0, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "part", v: "'004'", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[300]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "`values.append(int(part))` меняет сам список, к которому ведёт `values`; новый не создаётся.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [
              { n: "n", v: "30042", ref: null, ch: false },
              { n: "s", v: "'30042'", ref: null, ch: false },
              { n: "values", v: "[300, 4]", ref: 0, ch: true },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "part", v: "'004'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[300, 4]", ch: true } },
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт следующее значение: `i` = `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [
              { n: "n", v: "30042", ref: null, ch: false },
              { n: "s", v: "'30042'", ref: null, ch: false },
              { n: "values", v: "[300, 4]", ref: 0, ch: false },
              { n: "i", v: "2", ref: null, ch: true },
              { n: "part", v: "'004'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[300, 4]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `s[i:i + 3]` → `'042'`, и `part` получает это значение. Прежнее значение `'004'` больше не связано с `part`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [
              { n: "n", v: "30042", ref: null, ch: false },
              { n: "s", v: "'30042'", ref: null, ch: false },
              { n: "values", v: "[300, 4]", ref: 0, ch: false },
              { n: "i", v: "2", ref: null, ch: false },
              { n: "part", v: "'042'", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[300, 4]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "`values.append(int(part))` меняет сам список, к которому ведёт `values`; новый не создаётся.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [
              { n: "n", v: "30042", ref: null, ch: false },
              { n: "s", v: "'30042'", ref: null, ch: false },
              { n: "values", v: "[300, 4, 42]", ref: 0, ch: true },
              { n: "i", v: "2", ref: null, ch: false },
              { n: "part", v: "'042'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[300, 4, 42]", ch: true } },
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
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [
              { n: "n", v: "30042", ref: null, ch: false },
              { n: "s", v: "'30042'", ref: null, ch: false },
              { n: "values", v: "[300, 4, 42]", ref: 0, ch: false },
              { n: "i", v: "2", ref: null, ch: false },
              { n: "part", v: "'042'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[300, 4, 42]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "Функция возвращает `296` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов transform_windows(30042)",
            names: [
              { n: "n", v: "30042", ref: null, ch: false },
              { n: "s", v: "'30042'", ref: null, ch: false },
              { n: "values", v: "[300, 4, 42]", ref: 0, ch: false },
              { n: "i", v: "2", ref: null, ch: false },
              { n: "part", v: "'042'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[300, 4, 42]", ch: false } },
        out: "",
      },
      {
        line: 12,
        text: "На экран выводится «296».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "transform_windows", v: "функция", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "296\n",
      },
    ],
  },
  runBest: {
    kind: "run",
    code: "best_n = 0\nbest_r = 1000\nfor n in range(2, 6):\n    r = 2 * n\n    if n % 2 == 0:\n        r = 8 * n + 7\n    if r > 8 and r < best_r:\n        best_n = n\n        best_r = r\nprint(best_n, best_r)",
    fileName: "best.py",
    output: "5 10",
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
        text: "`best_n` получает значение `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "best_n", v: "0", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`best_r` получает значение `1000`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "0", ref: null, ch: false },
              { n: "best_r", v: "1000", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт первое значение: `n` = `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "0", ref: null, ch: false },
              { n: "best_r", v: "1000", ref: null, ch: false },
              { n: "n", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `2 * n` → `4`, и `r` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "0", ref: null, ch: false },
              { n: "best_r", v: "1000", ref: null, ch: false },
              { n: "n", v: "2", ref: null, ch: false },
              { n: "r", v: "4", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Проверка `n % 2 == 0` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "0", ref: null, ch: false },
              { n: "best_r", v: "1000", ref: null, ch: false },
              { n: "n", v: "2", ref: null, ch: false },
              { n: "r", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `8 * n + 7` → `23`, и `r` получает это значение. Прежнее значение `4` больше не связано с `r`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "0", ref: null, ch: false },
              { n: "best_r", v: "1000", ref: null, ch: false },
              { n: "n", v: "2", ref: null, ch: false },
              { n: "r", v: "23", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Проверка `r > 8 and r < best_r` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "0", ref: null, ch: false },
              { n: "best_r", v: "1000", ref: null, ch: false },
              { n: "n", v: "2", ref: null, ch: false },
              { n: "r", v: "23", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "`best_n` получает то же, что `n`: теперь оба имени ведут к `2`. Прежнее значение `0` больше не связано с `best_n`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: true },
              { n: "best_r", v: "1000", ref: null, ch: false },
              { n: "n", v: "2", ref: null, ch: false },
              { n: "r", v: "23", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 9,
        text: "`best_r` получает то же, что `r`: теперь оба имени ведут к `23`. Прежнее значение `1000` больше не связано с `best_r`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: true },
              { n: "n", v: "2", ref: null, ch: false },
              { n: "r", v: "23", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `n` = `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "3", ref: null, ch: true },
              { n: "r", v: "23", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `2 * n` → `6`, и `r` получает это значение. Прежнее значение `23` больше не связано с `r`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "3", ref: null, ch: false },
              { n: "r", v: "6", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Проверка `n % 2 == 0` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "3", ref: null, ch: false },
              { n: "r", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Проверка `r > 8 and r < best_r` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "3", ref: null, ch: false },
              { n: "r", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `n` = `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "4", ref: null, ch: true },
              { n: "r", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `2 * n` → `8`, и `r` получает это значение. Прежнее значение `6` больше не связано с `r`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "4", ref: null, ch: false },
              { n: "r", v: "8", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Проверка `n % 2 == 0` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "4", ref: null, ch: false },
              { n: "r", v: "8", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Python вычисляет `8 * n + 7` → `39`, и `r` получает это значение. Прежнее значение `8` больше не связано с `r`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "4", ref: null, ch: false },
              { n: "r", v: "39", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Проверка `r > 8 and r < best_r` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "4", ref: null, ch: false },
              { n: "r", v: "39", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `n` = `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "5", ref: null, ch: true },
              { n: "r", v: "39", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `2 * n` → `10`, и `r` получает это значение. Прежнее значение `39` больше не связано с `r`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "5", ref: null, ch: false },
              { n: "r", v: "10", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Проверка `n % 2 == 0` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "5", ref: null, ch: false },
              { n: "r", v: "10", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Проверка `r > 8 and r < best_r` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "2", ref: null, ch: false },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "5", ref: null, ch: false },
              { n: "r", v: "10", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "`best_n` получает то же, что `n`: теперь оба имени ведут к `5`. Прежнее значение `2` больше не связано с `best_n`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "5", ref: null, ch: true },
              { n: "best_r", v: "23", ref: null, ch: false },
              { n: "n", v: "5", ref: null, ch: false },
              { n: "r", v: "10", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 9,
        text: "`best_r` получает то же, что `r`: теперь оба имени ведут к `10`. Прежнее значение `23` больше не связано с `best_r`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "5", ref: null, ch: false },
              { n: "best_r", v: "10", ref: null, ch: true },
              { n: "n", v: "5", ref: null, ch: false },
              { n: "r", v: "10", ref: null, ch: false },
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
              { n: "best_n", v: "5", ref: null, ch: false },
              { n: "best_r", v: "10", ref: null, ch: false },
              { n: "n", v: "5", ref: null, ch: false },
              { n: "r", v: "10", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "На экран выводится «5 10».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "best_n", v: "5", ref: null, ch: false },
              { n: "best_r", v: "10", ref: null, ch: false },
              { n: "n", v: "5", ref: null, ch: false },
              { n: "r", v: "10", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "5 10\n",
      },
    ],
  },
  // %%final_task_stepper("preobrazovanie-zapisey-chisel")%%
  finalTask: {
    kind: "stepper",
    width: 660,
    height: 270,
    frames: [
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 270"><circle cx="24.0" cy="16" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><text x="24.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="600" fill="#17191e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">1</text><circle cx="92.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 30.0 16 H 84.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="92.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">2</text><circle cx="160.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 98.0 16 H 152.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="160.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">4</text><circle cx="228.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 166.0 16 H 220.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="228.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">5</text><circle cx="20" cy="72" r="3" fill="#ff6a00"/><text x="32.0" y="76.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="315.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">s = bin(n)[2:]     # запись: 38 → &#x27;100110&#x27;</text><circle cx="20" cy="91" r="3" fill="#ff6a00"/><text x="32.0" y="95.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="262.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">r = int(s, 2)      # запись → число</text><path d="M 452 58 V 262" stroke="#d9d9d4"/><text x="468.0" y="72.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">подтема 1</text><text x="468.0" y="94.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Число и его запись</text><text x="468.0" y="126.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">новое:</text><text x="468.0" y="146.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">число и запись —</text><text x="468.0" y="165.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">bin и int</text></svg>',
        caption:
          "Подтема 1, «Число и его запись»: число и запись — bin и int. Точками отмечены новые строки.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 270"><circle cx="24.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="24.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">1</text><circle cx="92.0" cy="16" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><path d="M 30.0 16 H 84.0" stroke="#ff6a00" stroke-width="1.5"/><text x="92.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="600" fill="#17191e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">2</text><circle cx="160.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 98.0 16 H 152.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="160.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">4</text><circle cx="228.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 166.0 16 H 220.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="228.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">5</text><text x="32.0" y="76.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#4d535e" text-anchor="start" textLength="315.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">s = bin(n)[2:]     # запись: 38 → &#x27;100110&#x27;</text><circle cx="20" cy="91" r="3" fill="#ff6a00"/><text x="32.0" y="95.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="105.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">if n % 2 == 0:</text><circle cx="20" cy="110" r="3" fill="#ff6a00"/><text x="32.0" y="114.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="232.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    s = s + &#x27;10&#x27;   # R = 4N + 2</text><circle cx="20" cy="129" r="3" fill="#ff6a00"/><text x="32.0" y="133.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="37.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">else:</text><circle cx="20" cy="148" r="3" fill="#ff6a00"/><text x="32.0" y="152.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="232.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    s = s + &#x27;01&#x27;   # R = 4N + 1</text><text x="32.0" y="171.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#4d535e" text-anchor="start" textLength="262.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">r = int(s, 2)      # запись → число</text><path d="M 452 58 V 262" stroke="#d9d9d4"/><text x="468.0" y="72.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">подтема 2</text><text x="468.0" y="94.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Дописывание цифр</text><text x="468.0" y="126.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">новое:</text><text x="468.0" y="146.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">две цифры справа —</text><text x="468.0" y="165.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">R растёт вчетверо</text></svg>',
        caption:
          "Подтема 2, «Дописывание цифр»: две цифры справа — R растёт вчетверо.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 270"><circle cx="24.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="24.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">1</text><circle cx="92.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><path d="M 30.0 16 H 84.0" stroke="#ff6a00" stroke-width="1.5"/><text x="92.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">2</text><circle cx="160.0" cy="16" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><path d="M 98.0 16 H 152.0" stroke="#ff6a00" stroke-width="1.5"/><text x="160.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="600" fill="#17191e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">4</text><circle cx="228.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 166.0 16 H 220.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="228.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">5</text><circle cx="20" cy="72" r="3" fill="#ff6a00"/><text x="32.0" y="76.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="172.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">for n in range(1, 200):</text><circle cx="20" cy="91" r="3" fill="#ff6a00"/><text x="32.0" y="95.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="135.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    s = bin(n)[2:]</text><circle cx="20" cy="110" r="3" fill="#ff6a00"/><text x="32.0" y="114.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="135.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    if n % 2 == 0:</text><circle cx="20" cy="129" r="3" fill="#ff6a00"/><text x="32.0" y="133.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="150.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">        s = s + &#x27;10&#x27;</text><circle cx="20" cy="148" r="3" fill="#ff6a00"/><text x="32.0" y="152.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="67.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    else:</text><circle cx="20" cy="167" r="3" fill="#ff6a00"/><text x="32.0" y="171.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="150.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">        s = s + &#x27;01&#x27;</text><circle cx="20" cy="186" r="3" fill="#ff6a00"/><text x="32.0" y="190.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="127.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    r = int(s, 2)</text><circle cx="20" cy="205" r="3" fill="#ff6a00"/><text x="32.0" y="209.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="112.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    if r &gt; 150:</text><circle cx="20" cy="224" r="3" fill="#ff6a00"/><text x="32.0" y="228.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="225.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">        print(n, r)   # 38 154</text><circle cx="20" cy="243" r="3" fill="#ff6a00"/><text x="32.0" y="247.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="97.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">        break</text><path d="M 452 58 V 262" stroke="#d9d9d4"/><text x="468.0" y="72.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">подтема 4</text><text x="468.0" y="94.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Решение перебором</text><text x="468.0" y="126.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">новое:</text><text x="468.0" y="146.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">первое N</text><text x="468.0" y="165.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">с R &gt; 150</text></svg>',
        caption: "Подтема 4, «Решение перебором»: первое N с R > 150.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 270"><circle cx="24.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="24.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">1</text><circle cx="92.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><path d="M 30.0 16 H 84.0" stroke="#ff6a00" stroke-width="1.5"/><text x="92.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">2</text><circle cx="160.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><path d="M 98.0 16 H 152.0" stroke="#ff6a00" stroke-width="1.5"/><text x="160.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">4</text><circle cx="228.0" cy="16" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><path d="M 166.0 16 H 220.0" stroke="#ff6a00" stroke-width="1.5"/><text x="228.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="600" fill="#17191e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">5</text><circle cx="20" cy="72" r="3" fill="#ff6a00"/><text x="32.0" y="76.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="240.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">151 = 100101|11   хвост 11 — нет</text><circle cx="20" cy="91" r="3" fill="#ff6a00"/><text x="32.0" y="95.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="240.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">152 = 100110|00   хвост 00 — нет</text><circle cx="20" cy="110" r="3" fill="#ff6a00"/><text x="32.0" y="114.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="330.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">153 = 100110|01   38 чётное, а 01 — нечётным</text><circle cx="20" cy="129" r="3" fill="#ff6a00"/><text x="32.0" y="133.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="337.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">154 = 100110|10   38 чётное, дописано 10 — да</text><circle cx="20" cy="148" r="3" fill="#ff6a00"/><text x="32.0" y="152.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="67.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">ответ: 38</text><path d="M 452 58 V 262" stroke="#d9d9d4"/><text x="468.0" y="72.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">подтема 5</text><text x="468.0" y="94.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Решение от результата</text><text x="468.0" y="126.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">новое:</text><text x="468.0" y="146.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">перебор R:</text><text x="468.0" y="165.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">хвост и остаток</text></svg>',
        caption:
          "Подтема 5, «Решение от результата»: перебор R: хвост и остаток. Ответ задачи темы — 38.",
      },
    ],
  },
  // %%final_cycle("preobrazovanie-zapisey-chisel")%%
  finalCycle: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 184"><rect x="11.0" y="16.0" width="114.8" height="104.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="68.4" y="44.0" font-family="inherit" font-size="13.5" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Запись</text><text x="68.4" y="68.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">запись числа</text><text x="68.4" y="86.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">в системе</text><text x="68.4" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="59.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">подтема 1</text><rect x="141.8" y="16.0" width="114.8" height="104.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="199.2" y="44.0" font-family="inherit" font-size="13.5" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Действия</text><text x="199.2" y="68.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">каждое —</text><text x="199.2" y="86.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">строка кода</text><text x="199.2" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="79.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">подтемы 2, 3</text><line x1="127.8" y1="68.0" x2="130.8" y2="68.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 139.8 68.0 L 130.8 72.5 L 130.8 63.5 Z" fill="#4d535e"/><rect x="272.6" y="16.0" width="114.8" height="104.0" rx="8" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="330.0" y="44.0" font-family="inherit" font-size="13.5" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">Пример</text><text x="330.0" y="68.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">сверить</text><text x="330.0" y="86.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">с условием</text><text x="330.0" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="79.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">подтемы 2, 3</text><line x1="258.6" y1="68.0" x2="261.6" y2="68.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 270.6 68.0 L 261.6 72.5 L 261.6 63.5 Z" fill="#4d535e"/><rect x="403.4" y="16.0" width="114.8" height="104.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="460.8" y="44.0" font-family="inherit" font-size="13.5" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Поиск</text><text x="460.8" y="68.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">перебор</text><text x="460.8" y="86.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">или от R</text><text x="460.8" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="79.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">подтемы 4, 5</text><line x1="389.4" y1="68.0" x2="392.4" y2="68.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 401.4 68.0 L 392.4 72.5 L 392.4 63.5 Z" fill="#4d535e"/><rect x="534.2" y="16.0" width="114.8" height="104.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="591.6" y="44.0" font-family="inherit" font-size="13.5" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Ответ</text><text x="591.6" y="68.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">N или R —</text><text x="591.6" y="86.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">что спросили</text><text x="591.6" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="59.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">подтема 4</text><line x1="520.2" y1="68.0" x2="523.2" y2="68.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 532.2 68.0 L 523.2 72.5 L 523.2 63.5 Z" fill="#4d535e"/><path d="M 330.0 122.0 V 150 H 199.2 V 134.0" fill="none" stroke="#4d535e" stroke-width="1.5"/><line x1="199.2" y1="136.0" x2="199.2" y2="131.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 199.2 122.0 L 203.7 131.0 L 194.7 131.0 Z" fill="#4d535e"/><text x="264.6" y="174.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">не сошлось — исправь действие</text></svg>',
    width: 660,
    height: 184,
    alt: "Порядок решения: Запись, Действия, Пример, Поиск, Ответ",
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
