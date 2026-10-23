// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%cl_eps_stepper([(0, 0), (0.8, 0), (1.6, 0), (2.3, 0.5), (5, 1), (5.7, 1.4), (6.3, 0.8), (5.6, 0.4)], [0.5, 0.9, 3])%%
  clEpsStepper_f679db: {
    kind: "stepper",
    width: 660,
    height: 212,
    frames: [
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 212"><rect x="40" y="14" width="400.0" height="177.8" fill="#fff" stroke="#d9d9d4"/><line x1="40.0" y1="14.0" x2="40.0" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−1</text><line x1="84.4" y1="14.0" x2="84.4" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="84.4" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><line x1="128.9" y1="14.0" x2="128.9" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="128.9" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><line x1="173.3" y1="14.0" x2="173.3" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="173.3" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><line x1="217.8" y1="14.0" x2="217.8" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="217.8" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><line x1="262.2" y1="14.0" x2="262.2" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="262.2" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><line x1="306.7" y1="14.0" x2="306.7" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="306.7" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><line x1="351.1" y1="14.0" x2="351.1" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="351.1" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><line x1="395.6" y1="14.0" x2="395.6" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="395.6" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><line x1="440.0" y1="14.0" x2="440.0" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="440.0" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><line x1="40.0" y1="191.8" x2="440.0" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="195.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">−1</text><line x1="40.0" y1="147.3" x2="440.0" y2="147.3" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="151.3" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">0</text><line x1="40.0" y1="102.9" x2="440.0" y2="102.9" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="106.9" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">1</text><line x1="40.0" y1="58.4" x2="440.0" y2="58.4" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="62.4" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">2</text><line x1="40.0" y1="14.0" x2="440.0" y2="14.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="18.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">3</text><circle cx="84.4" cy="147.3" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><rect x="115.5" y="142.8" width="9.0" height="9.0" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 155.6 141.9 L 160.5 150.9 L 150.6 150.9 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 186.7 119.3 L 191.6 125.1 L 186.7 131.0 L 181.7 125.1 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><circle cx="306.7" cy="102.9" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><rect x="328.8" y="125.1" width="9.0" height="9.0" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 337.8 79.7 L 342.7 88.7 L 332.8 88.7 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 364.4 105.9 L 369.4 111.8 L 364.4 117.6 L 359.5 111.8 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="460.0" y="38.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">порог ε = 0,5</text><text x="460.0" y="64.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">групп: 8</text><text x="460.0" y="88.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">размеры: 1, 1, 1, 1, 1, 1, 1, 1</text></svg>',
        caption:
          "Порог 0,5: соединены пары на расстоянии не больше 0,5, групп 8 (1, 1, 1, 1, 1, 1, 1, 1).",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 212"><rect x="40" y="14" width="400.0" height="177.8" fill="#fff" stroke="#d9d9d4"/><line x1="40.0" y1="14.0" x2="40.0" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−1</text><line x1="84.4" y1="14.0" x2="84.4" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="84.4" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><line x1="128.9" y1="14.0" x2="128.9" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="128.9" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><line x1="173.3" y1="14.0" x2="173.3" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="173.3" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><line x1="217.8" y1="14.0" x2="217.8" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="217.8" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><line x1="262.2" y1="14.0" x2="262.2" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="262.2" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><line x1="306.7" y1="14.0" x2="306.7" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="306.7" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><line x1="351.1" y1="14.0" x2="351.1" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="351.1" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><line x1="395.6" y1="14.0" x2="395.6" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="395.6" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><line x1="440.0" y1="14.0" x2="440.0" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="440.0" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><line x1="40.0" y1="191.8" x2="440.0" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="195.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">−1</text><line x1="40.0" y1="147.3" x2="440.0" y2="147.3" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="151.3" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">0</text><line x1="40.0" y1="102.9" x2="440.0" y2="102.9" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="106.9" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">1</text><line x1="40.0" y1="58.4" x2="440.0" y2="58.4" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="62.4" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">2</text><line x1="40.0" y1="14.0" x2="440.0" y2="14.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="18.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">3</text><line x1="84.4" y1="147.3" x2="120.0" y2="147.3" stroke="#ff6a00" stroke-width="1.75"/><line x1="120.0" y1="147.3" x2="155.6" y2="147.3" stroke="#ff6a00" stroke-width="1.75"/><line x1="155.6" y1="147.3" x2="186.7" y2="125.1" stroke="#ff6a00" stroke-width="1.75"/><line x1="306.7" y1="102.9" x2="337.8" y2="85.1" stroke="#ff6a00" stroke-width="1.75"/><line x1="306.7" y1="102.9" x2="333.3" y2="129.6" stroke="#ff6a00" stroke-width="1.75"/><line x1="337.8" y1="85.1" x2="364.4" y2="111.8" stroke="#ff6a00" stroke-width="1.75"/><line x1="364.4" y1="111.8" x2="333.3" y2="129.6" stroke="#ff6a00" stroke-width="1.75"/><circle cx="84.4" cy="147.3" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="120.0" cy="147.3" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="155.6" cy="147.3" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="186.7" cy="125.1" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><rect x="302.2" y="98.4" width="9.0" height="9.0" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="333.3" y="80.6" width="9.0" height="9.0" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="359.9" y="107.3" width="9.0" height="9.0" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="328.8" y="125.1" width="9.0" height="9.0" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="460.0" y="38.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">порог ε = 0,9</text><text x="460.0" y="64.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">групп: 2</text><text x="460.0" y="88.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">размеры: 4, 4</text></svg>',
        caption:
          "Порог 0,9: соединены пары на расстоянии не больше 0,9, групп 2 (4, 4).",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 212"><rect x="40" y="14" width="400.0" height="177.8" fill="#fff" stroke="#d9d9d4"/><line x1="40.0" y1="14.0" x2="40.0" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−1</text><line x1="84.4" y1="14.0" x2="84.4" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="84.4" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><line x1="128.9" y1="14.0" x2="128.9" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="128.9" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><line x1="173.3" y1="14.0" x2="173.3" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="173.3" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><line x1="217.8" y1="14.0" x2="217.8" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="217.8" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><line x1="262.2" y1="14.0" x2="262.2" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="262.2" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><line x1="306.7" y1="14.0" x2="306.7" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="306.7" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><line x1="351.1" y1="14.0" x2="351.1" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="351.1" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><line x1="395.6" y1="14.0" x2="395.6" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="395.6" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><line x1="440.0" y1="14.0" x2="440.0" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="440.0" y="207.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><line x1="40.0" y1="191.8" x2="440.0" y2="191.8" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="195.8" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">−1</text><line x1="40.0" y1="147.3" x2="440.0" y2="147.3" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="151.3" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">0</text><line x1="40.0" y1="102.9" x2="440.0" y2="102.9" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="106.9" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">1</text><line x1="40.0" y1="58.4" x2="440.0" y2="58.4" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="62.4" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">2</text><line x1="40.0" y1="14.0" x2="440.0" y2="14.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="18.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">3</text><line x1="84.4" y1="147.3" x2="120.0" y2="147.3" stroke="#ff6a00" stroke-width="1.75"/><line x1="84.4" y1="147.3" x2="155.6" y2="147.3" stroke="#ff6a00" stroke-width="1.75"/><line x1="84.4" y1="147.3" x2="186.7" y2="125.1" stroke="#ff6a00" stroke-width="1.75"/><line x1="120.0" y1="147.3" x2="155.6" y2="147.3" stroke="#ff6a00" stroke-width="1.75"/><line x1="120.0" y1="147.3" x2="186.7" y2="125.1" stroke="#ff6a00" stroke-width="1.75"/><line x1="155.6" y1="147.3" x2="186.7" y2="125.1" stroke="#ff6a00" stroke-width="1.75"/><line x1="186.7" y1="125.1" x2="306.7" y2="102.9" stroke="#ff6a00" stroke-width="1.75"/><line x1="306.7" y1="102.9" x2="337.8" y2="85.1" stroke="#ff6a00" stroke-width="1.75"/><line x1="306.7" y1="102.9" x2="364.4" y2="111.8" stroke="#ff6a00" stroke-width="1.75"/><line x1="306.7" y1="102.9" x2="333.3" y2="129.6" stroke="#ff6a00" stroke-width="1.75"/><line x1="337.8" y1="85.1" x2="364.4" y2="111.8" stroke="#ff6a00" stroke-width="1.75"/><line x1="337.8" y1="85.1" x2="333.3" y2="129.6" stroke="#ff6a00" stroke-width="1.75"/><line x1="364.4" y1="111.8" x2="333.3" y2="129.6" stroke="#ff6a00" stroke-width="1.75"/><circle cx="84.4" cy="147.3" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="120.0" cy="147.3" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="155.6" cy="147.3" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="186.7" cy="125.1" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="306.7" cy="102.9" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="337.8" cy="85.1" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="364.4" cy="111.8" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="333.3" cy="129.6" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="460.0" y="38.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">порог ε = 3</text><text x="460.0" y="64.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">групп: 1</text><text x="460.0" y="88.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">размеры: 8</text></svg>',
        caption:
          "Порог 3: соединены пары на расстоянии не больше 3, групп 1 (8).",
      },
    ],
  },
  // %%cl_split_stepper([(0, 0), (0.8, 0), (1.6, 0), (3.5, 0), (4.2, 0.4)], 0.9)%%
  clSplitStepper09: {
    kind: "stepper",
    width: 660,
    height: 300,
    frames: [
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 300"><line x1="30.0" y1="124.5" x2="410.0" y2="124.5" stroke="#d9d9d4" stroke-width="1.25"/><circle cx="64.5" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="64.5" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><circle cx="119.8" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="119.8" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><circle cx="175.1" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="175.1" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C</text><circle cx="306.4" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="306.4" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">D</text><circle cx="354.7" cy="96.9" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="354.7" y="84.9" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">E</text><text x="30.0" y="215.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">remaining</text><text x="120.0" y="215.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[A, B, C, D, E]</text><text x="30.0" y="237.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">cluster</text><text x="120.0" y="237.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[]</text><text x="30.0" y="259.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">clusters</text><text x="120.0" y="259.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[]</text><text x="426.0" y="34.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">ε = 0,9</text><text x="426.0" y="58.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">оранжевые — cluster,</text><text x="426.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">залитые — соседи найдены;</text><text x="426.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">чёрные — готовые группы</text></svg>',
        caption: "remaining — все точки, групп пока нет.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 300"><line x1="30.0" y1="124.5" x2="410.0" y2="124.5" stroke="#d9d9d4" stroke-width="1.25"/><circle cx="354.7" cy="96.9" r="62.2" fill="none" stroke="#ff6a00" stroke-dasharray="5 4"/><circle cx="64.5" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="64.5" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><circle cx="119.8" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="119.8" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><circle cx="175.1" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="175.1" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C</text><circle cx="306.4" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="306.4" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">D</text><circle cx="354.7" cy="96.9" r="6" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="354.7" y="84.9" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">E</text><text x="30.0" y="215.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">remaining</text><text x="120.0" y="215.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[A, B, C, D]</text><text x="30.0" y="237.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">cluster</text><text x="120.0" y="237.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[E]   pos = 0</text><text x="30.0" y="259.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">clusters</text><text x="120.0" y="259.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[]</text><text x="426.0" y="34.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">ε = 0,9</text><text x="426.0" y="58.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">оранжевые — cluster,</text><text x="426.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">залитые — соседи найдены;</text><text x="426.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">чёрные — готовые группы</text></svg>',
        caption:
          "pop() забирает последнюю точку E: с неё начинается новая группа.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 300"><line x1="30.0" y1="124.5" x2="410.0" y2="124.5" stroke="#d9d9d4" stroke-width="1.25"/><circle cx="306.4" cy="124.5" r="62.2" fill="none" stroke="#ff6a00" stroke-dasharray="5 4"/><circle cx="64.5" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="64.5" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><circle cx="119.8" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="119.8" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><circle cx="175.1" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="175.1" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C</text><circle cx="306.4" cy="124.5" r="6" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="306.4" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">D</text><circle cx="354.7" cy="96.9" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="354.7" y="84.9" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">E</text><text x="30.0" y="215.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">remaining</text><text x="120.0" y="215.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[A, B, C]</text><text x="30.0" y="237.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">cluster</text><text x="120.0" y="237.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[E, D]   pos = 1</text><text x="30.0" y="259.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">clusters</text><text x="120.0" y="259.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[]</text><text x="426.0" y="34.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">ε = 0,9</text><text x="426.0" y="58.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">оранжевые — cluster,</text><text x="426.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">залитые — соседи найдены;</text><text x="426.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">чёрные — готовые группы</text></svg>',
        caption: "Соседи E в пределах 0,9: D — в группу.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 300"><line x1="30.0" y1="124.5" x2="410.0" y2="124.5" stroke="#d9d9d4" stroke-width="1.25"/><circle cx="64.5" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="64.5" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><circle cx="119.8" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="119.8" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><circle cx="175.1" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="175.1" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C</text><circle cx="306.4" cy="124.5" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="306.4" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">D</text><circle cx="354.7" cy="96.9" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="354.7" y="84.9" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">E</text><text x="30.0" y="215.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">remaining</text><text x="120.0" y="215.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[A, B, C]</text><text x="30.0" y="237.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">cluster</text><text x="120.0" y="237.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[E, D]   pos = 2</text><text x="30.0" y="259.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">clusters</text><text x="120.0" y="259.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[]</text><text x="426.0" y="34.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">ε = 0,9</text><text x="426.0" y="58.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">оранжевые — cluster,</text><text x="426.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">залитые — соседи найдены;</text><text x="426.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">чёрные — готовые группы</text></svg>',
        caption: "Соседи D в пределах 0,9: новых нет.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 300"><line x1="30.0" y1="124.5" x2="410.0" y2="124.5" stroke="#d9d9d4" stroke-width="1.25"/><circle cx="64.5" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="64.5" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><circle cx="119.8" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="119.8" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><circle cx="175.1" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="175.1" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C</text><circle cx="306.4" cy="124.5" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="306.4" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">D</text><circle cx="354.7" cy="96.9" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="354.7" y="84.9" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">E</text><text x="30.0" y="215.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">remaining</text><text x="120.0" y="215.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[A, B, C]</text><text x="30.0" y="237.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">cluster</text><text x="120.0" y="237.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[]</text><text x="30.0" y="259.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">clusters</text><text x="120.0" y="259.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[[E, D]]</text><text x="426.0" y="34.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">ε = 0,9</text><text x="426.0" y="58.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">оранжевые — cluster,</text><text x="426.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">залитые — соседи найдены;</text><text x="426.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">чёрные — готовые группы</text></svg>',
        caption: "pos дошёл до конца: группа [E, D] готова.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 300"><line x1="30.0" y1="124.5" x2="410.0" y2="124.5" stroke="#d9d9d4" stroke-width="1.25"/><circle cx="175.1" cy="124.5" r="62.2" fill="none" stroke="#ff6a00" stroke-dasharray="5 4"/><circle cx="64.5" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="64.5" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><circle cx="119.8" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="119.8" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><circle cx="175.1" cy="124.5" r="6" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="175.1" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C</text><circle cx="306.4" cy="124.5" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="306.4" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">D</text><circle cx="354.7" cy="96.9" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="354.7" y="84.9" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">E</text><text x="30.0" y="215.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">remaining</text><text x="120.0" y="215.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[A, B]</text><text x="30.0" y="237.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">cluster</text><text x="120.0" y="237.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[C]   pos = 0</text><text x="30.0" y="259.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">clusters</text><text x="120.0" y="259.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[[E, D]]</text><text x="426.0" y="34.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">ε = 0,9</text><text x="426.0" y="58.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">оранжевые — cluster,</text><text x="426.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">залитые — соседи найдены;</text><text x="426.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">чёрные — готовые группы</text></svg>',
        caption:
          "pop() забирает последнюю точку C: с неё начинается новая группа.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 300"><line x1="30.0" y1="124.5" x2="410.0" y2="124.5" stroke="#d9d9d4" stroke-width="1.25"/><circle cx="119.8" cy="124.5" r="62.2" fill="none" stroke="#ff6a00" stroke-dasharray="5 4"/><circle cx="64.5" cy="124.5" r="6" fill="#fff" stroke="#4d535e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="64.5" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><circle cx="119.8" cy="124.5" r="6" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="119.8" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><circle cx="175.1" cy="124.5" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="175.1" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C</text><circle cx="306.4" cy="124.5" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="306.4" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">D</text><circle cx="354.7" cy="96.9" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="354.7" y="84.9" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">E</text><text x="30.0" y="215.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">remaining</text><text x="120.0" y="215.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[A]</text><text x="30.0" y="237.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">cluster</text><text x="120.0" y="237.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[C, B]   pos = 1</text><text x="30.0" y="259.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">clusters</text><text x="120.0" y="259.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[[E, D]]</text><text x="426.0" y="34.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">ε = 0,9</text><text x="426.0" y="58.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">оранжевые — cluster,</text><text x="426.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">залитые — соседи найдены;</text><text x="426.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">чёрные — готовые группы</text></svg>',
        caption: "Соседи C в пределах 0,9: B — в группу.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 300"><line x1="30.0" y1="124.5" x2="410.0" y2="124.5" stroke="#d9d9d4" stroke-width="1.25"/><circle cx="64.5" cy="124.5" r="62.2" fill="none" stroke="#ff6a00" stroke-dasharray="5 4"/><circle cx="64.5" cy="124.5" r="6" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="64.5" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><circle cx="119.8" cy="124.5" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="119.8" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><circle cx="175.1" cy="124.5" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="175.1" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C</text><circle cx="306.4" cy="124.5" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="306.4" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">D</text><circle cx="354.7" cy="96.9" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="354.7" y="84.9" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">E</text><text x="30.0" y="215.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">remaining</text><text x="120.0" y="215.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[]</text><text x="30.0" y="237.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">cluster</text><text x="120.0" y="237.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[C, B, A]   pos = 2</text><text x="30.0" y="259.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">clusters</text><text x="120.0" y="259.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[[E, D]]</text><text x="426.0" y="34.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">ε = 0,9</text><text x="426.0" y="58.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">оранжевые — cluster,</text><text x="426.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">залитые — соседи найдены;</text><text x="426.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">чёрные — готовые группы</text></svg>',
        caption: "Соседи B в пределах 0,9: A — в группу.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 300"><line x1="30.0" y1="124.5" x2="410.0" y2="124.5" stroke="#d9d9d4" stroke-width="1.25"/><circle cx="64.5" cy="124.5" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="64.5" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><circle cx="119.8" cy="124.5" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="119.8" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><circle cx="175.1" cy="124.5" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="175.1" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C</text><circle cx="306.4" cy="124.5" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="306.4" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">D</text><circle cx="354.7" cy="96.9" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="354.7" y="84.9" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">E</text><text x="30.0" y="215.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">remaining</text><text x="120.0" y="215.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[]</text><text x="30.0" y="237.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">cluster</text><text x="120.0" y="237.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[C, B, A]   pos = 3</text><text x="30.0" y="259.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">clusters</text><text x="120.0" y="259.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[[E, D]]</text><text x="426.0" y="34.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">ε = 0,9</text><text x="426.0" y="58.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">оранжевые — cluster,</text><text x="426.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">залитые — соседи найдены;</text><text x="426.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">чёрные — готовые группы</text></svg>',
        caption: "Соседи A в пределах 0,9: новых нет.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 300"><line x1="30.0" y1="124.5" x2="410.0" y2="124.5" stroke="#d9d9d4" stroke-width="1.25"/><circle cx="64.5" cy="124.5" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="64.5" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><circle cx="119.8" cy="124.5" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="119.8" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><circle cx="175.1" cy="124.5" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="175.1" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C</text><circle cx="306.4" cy="124.5" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="306.4" y="112.5" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">D</text><circle cx="354.7" cy="96.9" r="6" fill="#17191e" stroke="#17191e" stroke-width="2"/><text stroke="#fff" stroke-width="3" paint-order="stroke" x="354.7" y="84.9" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">E</text><text x="30.0" y="215.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">remaining</text><text x="120.0" y="215.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[]</text><text x="30.0" y="237.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">cluster</text><text x="120.0" y="237.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[]</text><text x="30.0" y="259.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">clusters</text><text x="120.0" y="259.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">[[E, D], [C, B, A]]</text><text x="426.0" y="34.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">ε = 0,9</text><text x="426.0" y="58.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">оранжевые — cluster,</text><text x="426.0" y="76.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">залитые — соседи найдены;</text><text x="426.0" y="94.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">чёрные — готовые группы</text></svg>',
        caption:
          "pos дошёл до конца: группа [C, B, A] готова. Нераспределённых точек нет.",
      },
    ],
  },
  // %%cl_scatter("27-6.txt", chains=0.5)%%
  clScatter276txt: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 412"><rect x="46" y="14" width="560.0" height="350.0" fill="#fff" stroke="#d9d9d4"/><line x1="46.0" y1="14.0" x2="46.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="46.0" y="380.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−6</text><line x1="81.0" y1="14.0" x2="81.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="116.0" y1="14.0" x2="116.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="116.0" y="380.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−4</text><line x1="151.0" y1="14.0" x2="151.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="186.0" y1="14.0" x2="186.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="186.0" y="380.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−2</text><line x1="221.0" y1="14.0" x2="221.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="256.0" y1="14.0" x2="256.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="256.0" y="380.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><line x1="291.0" y1="14.0" x2="291.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="326.0" y1="14.0" x2="326.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="326.0" y="380.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><line x1="361.0" y1="14.0" x2="361.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="396.0" y1="14.0" x2="396.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="396.0" y="380.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><line x1="431.0" y1="14.0" x2="431.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="466.0" y1="14.0" x2="466.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="466.0" y="380.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><line x1="501.0" y1="14.0" x2="501.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="536.0" y1="14.0" x2="536.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="536.0" y="380.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><line x1="571.0" y1="14.0" x2="571.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="606.0" y1="14.0" x2="606.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="606.0" y="380.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><line x1="46.0" y1="364.0" x2="606.0" y2="364.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="368.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">−4</text><line x1="46.0" y1="329.0" x2="606.0" y2="329.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="46.0" y1="294.0" x2="606.0" y2="294.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="298.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">−2</text><line x1="46.0" y1="259.0" x2="606.0" y2="259.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="46.0" y1="224.0" x2="606.0" y2="224.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="228.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">0</text><line x1="46.0" y1="189.0" x2="606.0" y2="189.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="46.0" y1="154.0" x2="606.0" y2="154.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="158.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">2</text><line x1="46.0" y1="119.0" x2="606.0" y2="119.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="46.0" y1="84.0" x2="606.0" y2="84.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="88.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">4</text><line x1="46.0" y1="49.0" x2="606.0" y2="49.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="46.0" y1="14.0" x2="606.0" y2="14.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="18.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">6</text><line x1="46.0" y1="224.0" x2="606.0" y2="224.0" stroke="#4d535e" stroke-width="1"/><line x1="256.0" y1="14.0" x2="256.0" y2="364.0" stroke="#4d535e" stroke-width="1"/><circle cx="161.1" cy="130.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="287.5" cy="82.8" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="325.2" cy="110.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="170.5" cy="105.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="270.3" cy="78.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="363.8" cy="123.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="189.5" cy="95.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="136.2" cy="160.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="324.8" cy="93.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="145.7" cy="130.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="116.8" cy="189.8" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="373.1" cy="163.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="108.7" cy="211.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="121.9" cy="168.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="244.9" cy="84.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="122.4" cy="201.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="116.8" cy="176.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="190.8" cy="106.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="387.5" cy="210.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="390.4" cy="174.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="308.0" cy="91.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="391.8" cy="197.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="228.8" cy="84.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="396.2" cy="215.8" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="142.5" cy="146.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="365.4" cy="138.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="335.9" cy="116.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="117.2" cy="196.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="216.8" cy="90.8" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="119.9" cy="204.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="218.9" cy="81.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="397.5" cy="219.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="134.1" cy="156.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="380.4" cy="147.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="161.0" cy="126.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="146.6" cy="133.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="375.8" cy="164.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="274.8" cy="90.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="120.1" cy="216.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="397.6" cy="193.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="393.8" cy="178.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="371.4" cy="156.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="360.9" cy="135.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="257.6" cy="81.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="324.6" cy="98.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="115.1" cy="180.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="365.4" cy="143.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="266.1" cy="91.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="370.7" cy="146.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="315.6" cy="104.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="123.2" cy="194.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="248.6" cy="88.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="124.7" cy="172.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="117.2" cy="221.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="362.3" cy="138.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="346.7" cy="113.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="138.4" cy="156.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="382.8" cy="171.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="348.0" cy="126.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="178.7" cy="98.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="328.7" cy="112.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="239.5" cy="87.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="202.4" cy="85.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="289.1" cy="95.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="203.4" cy="95.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="148.2" cy="139.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="137.2" cy="136.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="281.6" cy="87.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="289.5" cy="81.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="110.6" cy="206.8" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="390.4" cy="181.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="350.4" cy="130.8" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="308.9" cy="98.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="167.4" cy="114.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="376.8" cy="167.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="278.7" cy="85.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="182.4" cy="108.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="253.6" cy="87.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="173.3" cy="118.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="140.3" cy="149.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="225.6" cy="87.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="362.3" cy="128.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="125.0" cy="176.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="128.6" cy="160.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="122.3" cy="186.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="337.1" cy="104.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="158.0" cy="113.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="392.0" cy="171.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="231.6" cy="81.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="388.5" cy="164.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="199.0" cy="95.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="354.0" cy="124.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="390.4" cy="192.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="345.6" cy="118.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="166.9" cy="104.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="235.7" cy="89.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="337.5" cy="107.8" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="118.8" cy="210.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="214.1" cy="87.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="295.7" cy="88.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="194.4" cy="98.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="118.6" cy="218.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="379.1" cy="145.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="389.9" cy="207.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="251.8" cy="89.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="140.0" cy="142.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="393.4" cy="203.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="164.1" cy="125.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="300.2" cy="82.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="207.5" cy="90.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="197.6" cy="97.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="401.4" cy="222.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="344.3" cy="109.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="399.9" cy="199.8" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="404.2" cy="212.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="272.3" cy="85.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="300.7" cy="98.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="395.6" cy="187.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="379.9" cy="155.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="264.2" cy="82.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="180.8" cy="114.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="182.1" cy="97.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="322.6" cy="108.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="119.1" cy="188.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="241.3" cy="78.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="363.4" cy="148.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="212.1" cy="91.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="302.3" cy="89.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="155.0" cy="134.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="313.0" cy="92.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="122.0" cy="165.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="349.3" cy="119.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="388.9" cy="186.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="129.1" cy="146.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="166.2" cy="119.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="133.0" cy="166.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="314.6" cy="99.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="260.4" cy="91.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="221.7" cy="84.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="156.9" cy="131.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><rect x="427.6" y="300.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="513.0" y="232.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="529.9" y="171.6" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="306.0" y="272.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="420.0" y="303.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="256.7" y="178.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="274.8" y="239.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="454.9" y="301.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="479.8" y="284.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="290.5" y="270.6" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="460.4" y="289.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="474.3" y="289.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="415.9" y="304.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="370.5" y="300.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="253.5" y="173.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="399.7" y="310.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="409.8" y="303.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="248.2" y="183.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="257.9" y="206.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="340.8" y="302.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="535.7" y="180.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="260.5" y="223.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="312.1" y="283.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="283.0" y="251.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="258.4" y="192.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="526.0" y="230.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="330.1" y="291.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="265.3" y="198.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="527.8" y="185.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="461.5" y="297.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="392.6" y="300.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="261.9" y="229.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="258.0" y="188.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="266.8" y="236.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="253.0" y="211.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="483.3" y="277.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="394.3" y="304.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="508.9" y="259.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="534.4" y="193.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="525.8" y="218.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="435.0" y="305.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="271.5" y="237.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="510.4" y="234.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="347.2" y="294.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="525.5" y="202.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="525.5" y="177.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="280.7" y="256.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="305.2" y="270.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="521.0" y="232.6" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="468.3" y="286.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="337.8" y="297.6" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="520.0" y="212.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="403.6" y="315.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="514.2" y="240.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="501.5" y="268.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="529.3" y="188.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="307.2" y="286.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="413.5" y="304.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="439.4" y="305.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="425.2" y="308.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="296.3" y="274.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="269.1" y="215.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="319.9" y="285.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="302.6" y="285.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="268.2" y="231.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="533.9" y="201.6" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="349.5" y="295.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="520.4" y="224.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="353.0" y="297.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="285.4" y="263.6" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="357.5" y="299.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="250.5" y="171.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="365.7" y="307.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="261.2" y="226.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="336.7" y="293.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="526.5" y="174.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="277.5" y="240.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="378.7" y="316.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="489.9" y="267.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="447.4" y="303.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="266.3" y="201.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="374.6" y="299.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="290.4" y="262.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="317.5" y="281.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="512.2" y="256.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="526.5" y="205.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="442.2" y="299.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="467.0" y="293.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="481.5" y="279.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="503.2" y="247.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="476.4" y="288.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="451.6" y="287.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="290.1" y="253.6" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="376.9" y="308.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="494.0" y="276.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="246.5" y="187.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="329.4" y="299.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="405.7" y="307.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="389.2" y="301.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="513.9" y="250.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="360.6" y="299.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="300.4" y="265.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="432.4" y="310.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="328.0" y="287.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="501.4" y="264.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="256.9" y="196.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="448.4" y="294.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="534.2" y="197.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="273.8" y="248.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="362.9" y="301.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="385.7" y="302.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="253.9" y="215.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="527.6" y="221.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="508.0" y="262.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="273.2" y="253.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="491.3" y="280.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="319.5" y="291.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="511.3" y="243.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="493.8" y="267.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="526.0" y="209.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="46.0" y="398.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">кластер 1: 140 · кластер 2: 120</text></svg>',
    width: 660,
    height: 412,
    alt: "Точечная диаграмма файла 27-6.txt",
  },
  // %%cl_parabola([0, 1, 2, 3, 100])%%
  clParabola_ba6fc2: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 310"><line x1="50.0" y1="230.0" x2="620.0" y2="230.0" stroke="#4d535e" stroke-width="1.25"/><path d="M 50.0 175.2 L 54.8 176.3 L 59.5 177.4 L 64.2 178.5 L 69.0 179.5 L 73.8 180.5 L 78.5 181.5 L 83.2 182.4 L 88.0 183.2 L 92.8 184.1 L 97.5 184.9 L 102.2 185.6 L 107.0 186.3 L 111.8 187.0 L 116.5 187.6 L 121.2 188.2 L 126.0 188.7 L 130.8 189.2 L 135.5 189.7 L 140.2 190.1 L 145.0 190.4 L 149.8 190.8 L 154.5 191.1 L 159.2 191.3 L 164.0 191.5 L 168.8 191.7 L 173.5 191.8 L 178.2 191.9 L 183.0 192.0 L 187.8 192.0 L 192.5 191.9 L 197.2 191.8 L 202.0 191.7 L 206.8 191.6 L 211.5 191.4 L 216.2 191.1 L 221.0 190.8 L 225.7 190.5 L 230.5 190.1 L 235.2 189.7 L 240.0 189.3 L 244.8 188.8 L 249.5 188.3 L 254.2 187.7 L 259.0 187.1 L 263.8 186.4 L 268.5 185.7 L 273.2 185.0 L 278.0 184.2 L 282.8 183.4 L 287.5 182.5 L 292.2 181.6 L 297.0 180.7 L 301.8 179.7 L 306.5 178.7 L 311.2 177.6 L 316.0 176.5 L 320.8 175.3 L 325.5 174.2 L 330.2 172.9 L 335.0 171.7 L 339.8 170.3 L 344.5 169.0 L 349.2 167.6 L 354.0 166.2 L 358.8 164.7 L 363.5 163.2 L 368.2 161.6 L 373.0 160.0 L 377.8 158.3 L 382.5 156.7 L 387.2 154.9 L 392.0 153.2 L 396.8 151.4 L 401.5 149.5 L 406.2 147.6 L 411.0 145.7 L 415.7 143.7 L 420.5 141.7 L 425.2 139.7 L 430.0 137.6 L 434.8 135.4 L 439.5 133.2 L 444.2 131.0 L 449.0 128.8 L 453.8 126.5 L 458.5 124.1 L 463.2 121.7 L 468.0 119.3 L 472.7 116.9 L 477.5 114.3 L 482.2 111.8 L 487.0 109.2 L 491.8 106.6 L 496.5 103.9 L 501.2 101.2 L 506.0 98.4 L 510.8 95.6 L 515.5 92.8 L 520.2 89.9 L 525.0 87.0 L 529.8 84.1 L 534.5 81.1 L 539.2 78.0 L 544.0 74.9 L 548.8 71.8 L 553.5 68.6 L 558.2 65.4 L 563.0 62.2 L 567.8 58.9 L 572.5 55.6 L 577.2 52.2 L 582.0 48.8 L 586.8 45.3 L 591.5 41.8 L 596.2 38.3 L 601.0 34.7 L 605.8 31.1 L 610.5 27.4 L 615.2 23.7 L 620.0 20.0" fill="none" stroke="#17191e" stroke-width="1.5"/><line x1="185.8" y1="20.0" x2="185.8" y2="230.0" stroke="#ff6a00" stroke-width="1.5" stroke-dasharray="5 4"/><text x="191.8" y="34.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">средняя точка x̄ = 21,2</text><circle cx="75.9" cy="181.0" r="5" fill="#fff" stroke="#17191e" stroke-width="2"/><circle cx="81.1" cy="182.0" r="5" fill="#fff" stroke="#17191e" stroke-width="2"/><circle cx="86.3" cy="182.9" r="5" fill="#fff" stroke="#17191e" stroke-width="2"/><circle cx="91.5" cy="183.9" r="5" fill="#ff6a00" stroke="#ff6a00" stroke-width="2"/><circle cx="594.1" cy="39.9" r="5" fill="#fff" stroke="#17191e" stroke-width="2"/><text x="582.1" y="29.9" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">T(100) = 38814</text><text x="75.9" y="248.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">0  1  2  3</text><text x="594.1" y="248.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">100</text><text x="50.0" y="274.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Кандидаты слева: T(0) = 10014, T(1) = 9807, T(2) = 9610, T(3) = 9423</text><text x="50.0" y="294.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">Ниже всех — (3; 0), ближайшая к x̄ = 21,2.</text></svg>',
    width: 660,
    height: 310,
    alt: "Сумма квадратов расстояний как парабола",
  },
  // %%cl_pairs_grid(4)%%
  clPairsGrid4: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 254"><text x="56.0" y="68.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">i = 0</text><text x="93.0" y="30.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">j = 0</text><rect x="70" y="40" width="46" height="46" fill="#fff" stroke="#d9d9d4"/><text x="93.0" y="68.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="116" y="40" width="46" height="46" fill="#f3f3f1" stroke="#17191e"/><text x="139.0" y="68.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">d01</text><rect x="162" y="40" width="46" height="46" fill="#f3f3f1" stroke="#17191e"/><text x="185.0" y="68.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">d02</text><rect x="208" y="40" width="46" height="46" fill="#f3f3f1" stroke="#17191e"/><text x="231.0" y="68.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">d03</text><text x="56.0" y="114.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">i = 1</text><text x="139.0" y="30.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">j = 1</text><rect x="70" y="86" width="46" height="46" fill="#fff" stroke="#d9d9d4"/><text x="93.0" y="114.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">d01</text><rect x="116" y="86" width="46" height="46" fill="#fff" stroke="#d9d9d4"/><text x="139.0" y="114.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="162" y="86" width="46" height="46" fill="#f3f3f1" stroke="#17191e"/><text x="185.0" y="114.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">d12</text><rect x="208" y="86" width="46" height="46" fill="#f3f3f1" stroke="#17191e"/><text x="231.0" y="114.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">d13</text><text x="56.0" y="160.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">i = 2</text><text x="185.0" y="30.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">j = 2</text><rect x="70" y="132" width="46" height="46" fill="#fff" stroke="#d9d9d4"/><text x="93.0" y="160.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">d02</text><rect x="116" y="132" width="46" height="46" fill="#fff" stroke="#d9d9d4"/><text x="139.0" y="160.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">d12</text><rect x="162" y="132" width="46" height="46" fill="#fff" stroke="#d9d9d4"/><text x="185.0" y="160.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="208" y="132" width="46" height="46" fill="#f3f3f1" stroke="#17191e"/><text x="231.0" y="160.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">d23</text><text x="56.0" y="206.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">i = 3</text><text x="231.0" y="30.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">j = 3</text><rect x="70" y="178" width="46" height="46" fill="#fff" stroke="#d9d9d4"/><text x="93.0" y="206.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">d03</text><rect x="116" y="178" width="46" height="46" fill="#fff" stroke="#d9d9d4"/><text x="139.0" y="206.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">d13</text><rect x="162" y="178" width="46" height="46" fill="#fff" stroke="#d9d9d4"/><text x="185.0" y="206.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">d23</text><rect x="208" y="178" width="46" height="46" fill="#fff" stroke="#d9d9d4"/><text x="231.0" y="206.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="284.0" y="60.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Всего клеток 4 · 4 = 16.</text><text x="284.0" y="86.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Нужны только i &lt; j: 4 · 3 / 2 = 6.</text><text x="284.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">Диагональ — расстояние до себя, 0.</text><text x="284.0" y="134.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">Под диагональю — те же пары</text><text x="284.0" y="154.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">в обратном порядке.</text><text x="284.0" y="186.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Каждое d прибавляется сразу</text><text x="284.0" y="206.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">к totals[i] и totals[j].</text></svg>',
    width: 660,
    height: 254,
    alt: "Пары номеров i и j",
  },
  // run notes: "1: Функция расстояния из модуля `math`.\n4: Перебор кандидатов с досрочным отказом.\n5: Пока лучший кандидат — первая точка.\n6: Лучшей суммы ещё нет — бесконечность.\n7.1: Кандидат `(0, 0)`.\n8.1: Его сумма начинается с нуля.\n9.1: Расстояние до самой себя.\n10.1: Прибавили `0`: `total` = `0`.\n11.1: `0 ≥ inf` — нет, считаем дальше.\n9.2: Следующая точка — `(5, 0)`.\n10.2: `total` = `0 + 5 = 5`.\n11.2: `5 ≥ inf` — нет.\n9.3: Точки кончились: сумма кандидата `(0, 0)` — `5`.\n13.1: `5 < inf` — лучший результат.\n14.1: Лучшая сумма — `5`.\n15.1: Лучший кандидат — `(0, 0)`.\n7.2: Кандидат `(5, 0)`.\n8.2: Его сумма снова с нуля.\n9.4: Первая точка — `(0, 0)`.\n10.3: Уже `total` = `5` — столько же, сколько у лучшего.\n11.3: `5 ≥ 5`: сумма может только вырасти — кандидат уже не выиграет.\n12: `break`: второе расстояние не считаем.\n13.2: `5 < 5` — нет: равный результат лучшего не заменяет.\n7.3: Кандидаты кончились.\n16: Центр — `(0, 0)`.\n19.1: Вывод: `(0, 0)`."
  runCenterSumEarly: {
    kind: "run",
    code: 'from math import dist\n\n\ndef center_sum_early(cluster):\n    best_point = cluster[0]\n    best_sum = float("inf")\n    for candidate in cluster:\n        total = 0.0\n        for point in cluster:\n            total += dist(candidate, point)\n            if total >= best_sum:\n                break\n        if total < best_sum:\n            best_sum = total\n            best_point = candidate\n    return best_point\n\n\nprint(center_sum_early([(0, 0), (5, 0)]))',
    fileName: "center_sum_early.py",
    output: "(0, 0)",
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
        text: "Функция расстояния из модуля `math`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "dist", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Перебор кандидатов с досрочным отказом.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 19,
        text: "Вызывается функция `center_sum_early`. У вызова свои переменные: `cluster` = `[(0, 0), (5, 0)]`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [{ n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: true }],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: true } },
        out: "",
      },
      {
        line: 5,
        text: "Пока лучший кандидат — первая точка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Лучшей суммы ещё нет — бесконечность.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "inf", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Кандидат `(0, 0)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "inf", ref: null, ch: false },
              { n: "candidate", v: "(0, 0)", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 8,
        text: "Его сумма начинается с нуля.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "inf", ref: null, ch: false },
              { n: "candidate", v: "(0, 0)", ref: null, ch: false },
              { n: "total", v: "0.0", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "Расстояние до самой себя.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "inf", ref: null, ch: false },
              { n: "candidate", v: "(0, 0)", ref: null, ch: false },
              { n: "total", v: "0.0", ref: null, ch: false },
              { n: "point", v: "(0, 0)", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 10,
        text: "Прибавили `0`: `total` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "inf", ref: null, ch: false },
              { n: "candidate", v: "(0, 0)", ref: null, ch: false },
              { n: "total", v: "0.0", ref: null, ch: false },
              { n: "point", v: "(0, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 11,
        text: "`0 ≥ inf` — нет, считаем дальше.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "inf", ref: null, ch: false },
              { n: "candidate", v: "(0, 0)", ref: null, ch: false },
              { n: "total", v: "0.0", ref: null, ch: false },
              { n: "point", v: "(0, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "Следующая точка — `(5, 0)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "inf", ref: null, ch: false },
              { n: "candidate", v: "(0, 0)", ref: null, ch: false },
              { n: "total", v: "0.0", ref: null, ch: false },
              { n: "point", v: "(5, 0)", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 10,
        text: "`total` = `0 + 5 = 5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "inf", ref: null, ch: false },
              { n: "candidate", v: "(0, 0)", ref: null, ch: false },
              { n: "total", v: "5.0", ref: null, ch: true },
              { n: "point", v: "(5, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 11,
        text: "`5 ≥ inf` — нет.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "inf", ref: null, ch: false },
              { n: "candidate", v: "(0, 0)", ref: null, ch: false },
              { n: "total", v: "5.0", ref: null, ch: false },
              { n: "point", v: "(5, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "Точки кончились: сумма кандидата `(0, 0)` — `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "inf", ref: null, ch: false },
              { n: "candidate", v: "(0, 0)", ref: null, ch: false },
              { n: "total", v: "5.0", ref: null, ch: false },
              { n: "point", v: "(5, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 13,
        text: "`5 < inf` — лучший результат.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "inf", ref: null, ch: false },
              { n: "candidate", v: "(0, 0)", ref: null, ch: false },
              { n: "total", v: "5.0", ref: null, ch: false },
              { n: "point", v: "(5, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 14,
        text: "Лучшая сумма — `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "5.0", ref: null, ch: true },
              { n: "candidate", v: "(0, 0)", ref: null, ch: false },
              { n: "total", v: "5.0", ref: null, ch: false },
              { n: "point", v: "(5, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 15,
        text: "Лучший кандидат — `(0, 0)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "5.0", ref: null, ch: false },
              { n: "candidate", v: "(0, 0)", ref: null, ch: false },
              { n: "total", v: "5.0", ref: null, ch: false },
              { n: "point", v: "(5, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Кандидат `(5, 0)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "5.0", ref: null, ch: false },
              { n: "candidate", v: "(5, 0)", ref: null, ch: true },
              { n: "total", v: "5.0", ref: null, ch: false },
              { n: "point", v: "(5, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 8,
        text: "Его сумма снова с нуля.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "5.0", ref: null, ch: false },
              { n: "candidate", v: "(5, 0)", ref: null, ch: false },
              { n: "total", v: "0.0", ref: null, ch: true },
              { n: "point", v: "(5, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "Первая точка — `(0, 0)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "5.0", ref: null, ch: false },
              { n: "candidate", v: "(5, 0)", ref: null, ch: false },
              { n: "total", v: "0.0", ref: null, ch: false },
              { n: "point", v: "(0, 0)", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 10,
        text: "Уже `total` = `5` — столько же, сколько у лучшего.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "5.0", ref: null, ch: false },
              { n: "candidate", v: "(5, 0)", ref: null, ch: false },
              { n: "total", v: "5.0", ref: null, ch: true },
              { n: "point", v: "(0, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 11,
        text: "`5 ≥ 5`: сумма может только вырасти — кандидат уже не выиграет.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "5.0", ref: null, ch: false },
              { n: "candidate", v: "(5, 0)", ref: null, ch: false },
              { n: "total", v: "5.0", ref: null, ch: false },
              { n: "point", v: "(0, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 12,
        text: "`break`: второе расстояние не считаем.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "5.0", ref: null, ch: false },
              { n: "candidate", v: "(5, 0)", ref: null, ch: false },
              { n: "total", v: "5.0", ref: null, ch: false },
              { n: "point", v: "(0, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 13,
        text: "`5 < 5` — нет: равный результат лучшего не заменяет.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "5.0", ref: null, ch: false },
              { n: "candidate", v: "(5, 0)", ref: null, ch: false },
              { n: "total", v: "5.0", ref: null, ch: false },
              { n: "point", v: "(0, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Кандидаты кончились.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "5.0", ref: null, ch: false },
              { n: "candidate", v: "(5, 0)", ref: null, ch: false },
              { n: "total", v: "5.0", ref: null, ch: false },
              { n: "point", v: "(0, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 16,
        text: "Центр — `(0, 0)`.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов center_sum_early([(0, 0), (5, 0)])",
            names: [
              { n: "cluster", v: "[(0, 0), (5, 0)]", ref: 0, ch: false },
              { n: "best_point", v: "(0, 0)", ref: null, ch: false },
              { n: "best_sum", v: "5.0", ref: null, ch: false },
              { n: "candidate", v: "(5, 0)", ref: null, ch: false },
              { n: "total", v: "5.0", ref: null, ch: false },
              { n: "point", v: "(0, 0)", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 0), (5, 0)]", ch: false } },
        out: "",
      },
      {
        line: 19,
        text: "Вывод: `(0, 0)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "center_sum_early", v: "функция", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "(0, 0)\n",
      },
    ],
  },
  // %%cl_aim()%%
  clAim: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 323"><rect x="40" y="14" width="330.0" height="282.9" fill="#fff" stroke="#d9d9d4"/><line x1="40.0" y1="14.0" x2="40.0" y2="296.9" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="312.9" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><line x1="87.1" y1="14.0" x2="87.1" y2="296.9" stroke="#d9d9d4" stroke-width="0.6"/><text x="87.1" y="312.9" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><line x1="134.3" y1="14.0" x2="134.3" y2="296.9" stroke="#d9d9d4" stroke-width="0.6"/><text x="134.3" y="312.9" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><line x1="181.4" y1="14.0" x2="181.4" y2="296.9" stroke="#d9d9d4" stroke-width="0.6"/><text x="181.4" y="312.9" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><line x1="228.6" y1="14.0" x2="228.6" y2="296.9" stroke="#d9d9d4" stroke-width="0.6"/><text x="228.6" y="312.9" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><line x1="275.7" y1="14.0" x2="275.7" y2="296.9" stroke="#d9d9d4" stroke-width="0.6"/><text x="275.7" y="312.9" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><line x1="322.9" y1="14.0" x2="322.9" y2="296.9" stroke="#d9d9d4" stroke-width="0.6"/><text x="322.9" y="312.9" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><line x1="370.0" y1="14.0" x2="370.0" y2="296.9" stroke="#d9d9d4" stroke-width="0.6"/><text x="370.0" y="312.9" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><line x1="40.0" y1="296.9" x2="370.0" y2="296.9" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="300.9" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">0</text><line x1="40.0" y1="249.7" x2="370.0" y2="249.7" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="253.7" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">1</text><line x1="40.0" y1="202.6" x2="370.0" y2="202.6" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="206.6" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">2</text><line x1="40.0" y1="155.4" x2="370.0" y2="155.4" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="159.4" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">3</text><line x1="40.0" y1="108.3" x2="370.0" y2="108.3" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="112.3" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">4</text><line x1="40.0" y1="61.1" x2="370.0" y2="61.1" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="65.1" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">5</text><line x1="40.0" y1="14.0" x2="370.0" y2="14.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="34.0" y="18.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">6</text><line x1="40.0" y1="296.9" x2="370.0" y2="296.9" stroke="#4d535e" stroke-width="1"/><line x1="40.0" y1="14.0" x2="40.0" y2="296.9" stroke="#4d535e" stroke-width="1"/><clipPath id="cla260f07e3"><rect x="40" y="14" width="330.0" height="282.9"/></clipPath><circle clip-path="url(#cla260f07e3)" cx="87.1" cy="249.7" r="70.7" fill="none" stroke="#ff6a00" stroke-width="1.75" stroke-dasharray="6 4"/><circle clip-path="url(#cla260f07e3)" cx="134.3" cy="249.7" r="70.7" fill="none" stroke="#4d535e" stroke-width="1" stroke-dasharray="3 4"/><circle clip-path="url(#cla260f07e3)" cx="134.3" cy="202.6" r="70.7" fill="none" stroke="#4d535e" stroke-width="1" stroke-dasharray="3 4"/><circle clip-path="url(#cla260f07e3)" cx="332.3" cy="89.4" r="70.7" fill="none" stroke="#4d535e" stroke-width="1" stroke-dasharray="3 4"/><circle cx="87.1" cy="249.7" r="4.5" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.4"/><text x="95.1" y="242.7" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><circle cx="134.3" cy="249.7" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="142.3" y="242.7" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><circle cx="134.3" cy="202.6" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="142.3" y="195.6" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><circle cx="275.7" cy="108.3" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="283.7" y="101.3" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><circle cx="332.3" cy="89.4" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="340.3" y="82.4" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><circle cx="304.0" cy="32.9" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="312.0" y="25.9" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><text x="394.0" y="38.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Число — сколько других звёзд</text><text x="394.0" y="58.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">ближе 1,5 к этой звезде.</text><text x="394.0" y="92.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Больше всего — 2: у 4 звёзд.</text><text x="394.0" y="114.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Из них ближе к началу координат</text><text x="394.0" y="136.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">(1; 1) — точка наведения.</text><text x="394.0" y="170.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">Пунктир — круг радиуса 1,5.</text></svg>',
    width: 660,
    height: 323,
    alt: "Точка наведения телескопа",
  },
  // %%cl_corr()%%
  clCorr: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 490"><rect x="46" y="30" width="462.9" height="420.0" fill="#fff" stroke="#d9d9d4"/><line x1="63.1" y1="30.0" x2="63.1" y2="450.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="63.1" y="466.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><line x1="106.0" y1="30.0" x2="106.0" y2="450.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="148.9" y1="30.0" x2="148.9" y2="450.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="148.9" y="466.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><line x1="191.7" y1="30.0" x2="191.7" y2="450.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="234.6" y1="30.0" x2="234.6" y2="450.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="234.6" y="466.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><line x1="277.4" y1="30.0" x2="277.4" y2="450.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="320.3" y1="30.0" x2="320.3" y2="450.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="320.3" y="466.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">30</text><line x1="363.1" y1="30.0" x2="363.1" y2="450.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="406.0" y1="30.0" x2="406.0" y2="450.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="406.0" y="466.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">40</text><line x1="448.9" y1="30.0" x2="448.9" y2="450.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="491.7" y1="30.0" x2="491.7" y2="450.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="491.7" y="466.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">50</text><line x1="46.0" y1="432.9" x2="508.9" y2="432.9" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="436.9" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">0</text><line x1="46.0" y1="390.0" x2="508.9" y2="390.0" stroke="#d9d9d4" stroke-width="0.6"/><line x1="46.0" y1="347.1" x2="508.9" y2="347.1" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="351.1" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">10</text><line x1="46.0" y1="304.3" x2="508.9" y2="304.3" stroke="#d9d9d4" stroke-width="0.6"/><line x1="46.0" y1="261.4" x2="508.9" y2="261.4" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="265.4" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">20</text><line x1="46.0" y1="218.6" x2="508.9" y2="218.6" stroke="#d9d9d4" stroke-width="0.6"/><line x1="46.0" y1="175.7" x2="508.9" y2="175.7" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="179.7" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">30</text><line x1="46.0" y1="132.9" x2="508.9" y2="132.9" stroke="#d9d9d4" stroke-width="0.6"/><line x1="46.0" y1="90.0" x2="508.9" y2="90.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="94.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">40</text><line x1="46.0" y1="47.1" x2="508.9" y2="47.1" stroke="#d9d9d4" stroke-width="0.6"/><line x1="46.0" y1="432.9" x2="508.9" y2="432.9" stroke="#4d535e" stroke-width="1"/><line x1="63.1" y1="30.0" x2="63.1" y2="450.0" stroke="#4d535e" stroke-width="1"/><circle cx="123.3" cy="285.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="76.2" cy="365.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="96.2" cy="360.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="82.5" cy="372.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="132.2" cy="264.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="103.9" cy="330.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="141.9" cy="262.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="135.1" cy="256.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="147.5" cy="244.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="128.5" cy="288.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="147.9" cy="261.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="124.2" cy="281.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="130.3" cy="249.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="138.1" cy="251.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="114.3" cy="288.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="64.2" cy="382.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="88.9" cy="379.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="112.8" cy="290.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="139.3" cy="244.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="108.1" cy="321.8" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="95.5" cy="324.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="137.4" cy="254.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="138.9" cy="270.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="107.0" cy="327.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="133.9" cy="243.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="132.9" cy="286.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="77.4" cy="386.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="73.2" cy="377.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="87.3" cy="354.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="83.7" cy="382.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="93.1" cy="354.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="147.2" cy="242.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="126.7" cy="287.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="108.1" cy="294.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="134.3" cy="301.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="69.3" cy="393.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="119.8" cy="304.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="142.5" cy="243.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="139.5" cy="211.8" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="118.3" cy="320.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="147.8" cy="246.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="69.9" cy="388.8" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="102.1" cy="301.7" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="73.3" cy="423.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="92.3" cy="373.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="118.6" cy="301.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="96.4" cy="321.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="87.6" cy="342.2" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="121.5" cy="292.4" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="121.9" cy="277.9" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="81.1" cy="363.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="141.1" cy="272.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="100.9" cy="307.5" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="136.2" cy="257.6" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="132.6" cy="260.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="127.1" cy="235.0" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="134.8" cy="269.1" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="121.3" cy="272.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="87.4" cy="352.3" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="99.9" cy="320.8" r="2.6" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="113.3" y="20.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">r = 0,941</text><rect x="315.9" y="213.6" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="263.5" y="255.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="262.7" y="230.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="292.6" y="164.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="305.8" y="307.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="308.9" y="232.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="306.1" y="141.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="299.3" y="225.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="309.4" y="250.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="249.6" y="181.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="235.9" y="192.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="311.9" y="200.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="273.4" y="256.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="281.3" y="222.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="243.2" y="134.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="311.9" y="138.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="311.2" y="211.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="276.0" y="211.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="286.7" y="206.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="279.9" y="230.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="293.4" y="185.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="315.2" y="55.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="259.7" y="190.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="275.3" y="185.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="238.8" y="213.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="264.6" y="170.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="244.2" y="216.6" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="287.4" y="267.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="300.4" y="235.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="274.3" y="205.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="233.3" y="202.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="268.8" y="282.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="285.8" y="156.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="244.6" y="247.0" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="315.0" y="201.3" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="317.4" y="234.7" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="296.2" y="209.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="246.2" y="232.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="257.1" y="182.9" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="307.1" y="309.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="253.1" y="288.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="280.5" y="263.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="234.8" y="86.2" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="252.3" y="323.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="272.8" y="253.6" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="251.3" y="119.4" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="313.7" y="255.5" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="256.2" y="276.8" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="270.5" y="279.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="295.8" y="151.1" width="5.2" height="5.2" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="281.2" y="20.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">r = −0,016</text><path d="M 444.9 290.3 L 447.8 295.5 L 442.1 295.5 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 460.8 269.1 L 463.6 274.3 L 457.9 274.3 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 417.5 326.6 L 420.3 331.8 L 414.6 331.8 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 452.5 262.3 L 455.4 267.5 L 449.7 267.5 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 481.9 231.1 L 484.7 236.3 L 479.0 236.3 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 450.1 304.3 L 452.9 309.5 L 447.2 309.5 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 456.2 250.7 L 459.1 255.9 L 453.4 255.9 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 452.3 275.5 L 455.1 280.7 L 449.4 280.7 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 466.4 262.4 L 469.3 267.6 L 463.6 267.6 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 425.7 319.2 L 428.6 324.4 L 422.9 324.4 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 429.6 303.3 L 432.4 308.5 L 426.7 308.5 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 480.9 222.6 L 483.8 227.8 L 478.1 227.8 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 460.8 277.1 L 463.6 282.3 L 457.9 282.3 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 482.2 257.8 L 485.1 263.0 L 479.3 263.0 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 428.3 316.8 L 431.1 322.0 L 425.4 322.0 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 407.6 335.8 L 410.5 341.0 L 404.8 341.0 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 458.2 246.9 L 461.1 252.1 L 455.3 252.1 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 425.2 309.3 L 428.1 314.5 L 422.3 314.5 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 463.9 269.5 L 466.8 274.7 L 461.1 274.7 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 442.2 297.7 L 445.0 302.9 L 439.3 302.9 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 457.4 272.1 L 460.3 277.3 L 454.6 277.3 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 472.3 270.8 L 475.1 276.0 L 469.4 276.0 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 433.9 296.4 L 436.8 301.6 L 431.1 301.6 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 436.7 295.4 L 439.5 300.6 L 433.8 300.6 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 439.2 286.2 L 442.0 291.4 L 436.3 291.4 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 488.2 226.4 L 491.1 231.6 L 485.3 231.6 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 466.9 259.3 L 469.7 264.5 L 464.0 264.5 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 447.1 300.7 L 450.0 305.9 L 444.3 305.9 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 421.7 321.8 L 424.5 327.0 L 418.8 327.0 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 463.4 261.6 L 466.3 266.8 L 460.6 266.8 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 450.7 280.1 L 453.5 285.3 L 447.8 285.3 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 472.2 233.7 L 475.0 238.9 L 469.3 238.9 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 457.9 276.1 L 460.8 281.3 L 455.1 281.3 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 433.9 291.1 L 436.7 296.3 L 431.0 296.3 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 436.8 292.3 L 439.6 297.5 L 433.9 297.5 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 464.5 242.0 L 467.4 247.2 L 461.7 247.2 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 446.9 300.0 L 449.7 305.2 L 444.0 305.2 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 462.4 260.4 L 465.3 265.6 L 459.5 265.6 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 407.3 337.7 L 410.1 342.9 L 404.4 342.9 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 434.6 277.3 L 437.5 282.5 L 431.8 282.5 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 407.0 341.0 L 409.9 346.2 L 404.2 346.2 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 459.6 278.0 L 462.4 283.2 L 456.7 283.2 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 449.7 276.7 L 452.6 281.9 L 446.9 281.9 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 449.7 268.4 L 452.6 273.6 L 446.9 273.6 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 411.5 344.3 L 414.3 349.5 L 408.6 349.5 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 464.4 251.5 L 467.2 256.7 L 461.5 256.7 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 430.8 316.3 L 433.6 321.5 L 427.9 321.5 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 448.1 288.2 L 450.9 293.4 L 445.2 293.4 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 417.1 294.1 L 419.9 299.3 L 414.2 299.3 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 470.3 267.7 L 473.1 272.9 L 467.4 272.9 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 448.3 279.7 L 451.1 284.9 L 445.4 284.9 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 450.1 261.4 L 453.0 266.6 L 447.3 266.6 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 410.5 316.2 L 413.3 321.4 L 407.6 321.4 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 481.5 233.9 L 484.4 239.1 L 478.7 239.1 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 428.5 328.6 L 431.3 333.8 L 425.6 333.8 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 439.0 294.2 L 441.9 299.4 L 436.1 299.4 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 458.3 265.1 L 461.1 270.3 L 455.4 270.3 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 445.9 280.9 L 448.7 286.1 L 443.0 286.1 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 446.1 294.4 L 449.0 299.6 L 443.3 299.6 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 440.5 306.3 L 443.4 311.5 L 437.7 311.5 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 447.2 316.1 L 450.1 321.3 L 444.4 321.3 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 459.2 252.0 L 462.1 257.2 L 456.4 257.2 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 440.9 298.0 L 443.7 303.2 L 438.0 303.2 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 481.3 228.7 L 484.2 233.9 L 478.5 233.9 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 410.3 348.9 L 413.1 354.1 L 407.4 354.1 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 444.1 291.6 L 447.0 296.8 L 441.3 296.8 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 460.0 273.8 L 462.9 279.0 L 457.1 279.0 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 412.9 325.4 L 415.7 330.6 L 410.0 330.6 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 421.2 332.3 L 424.0 337.5 L 418.3 337.5 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><path d="M 423.4 311.2 L 426.3 316.4 L 420.5 316.4 Z" fill="#fff" stroke="#17191e" stroke-width="1.3"/><text x="446.3" y="20.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">r = 0,918</text><line x1="191.7" y1="30.0" x2="191.7" y2="450.0" stroke="#4d535e" stroke-width="1.25" stroke-dasharray="5 4"/><line x1="363.1" y1="30.0" x2="363.1" y2="450.0" stroke="#4d535e" stroke-width="1.25" stroke-dasharray="5 4"/><text x="46.0" y="488.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">|r| ≥ 0,9 — сильная связь: точки вытянуты вдоль прямой; r около 0 — облако без наклона</text></svg>',
    width: 660,
    height: 490,
    alt: "Эксперименты файла 27-9.txt и их корреляция",
  },
  // %%cl_iqr()%%
  clIqr: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 190"><line x1="30.0" y1="96.0" x2="630.0" y2="96.0" stroke="#4d535e" stroke-width="1.25"/><line x1="94.3" y1="92.0" x2="94.3" y2="100.0" stroke="#4d535e" stroke-width="1.25"/><text x="94.3" y="116.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><line x1="201.4" y1="92.0" x2="201.4" y2="100.0" stroke="#4d535e" stroke-width="1.25"/><text x="201.4" y="116.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><line x1="308.6" y1="92.0" x2="308.6" y2="100.0" stroke="#4d535e" stroke-width="1.25"/><text x="308.6" y="116.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><line x1="415.7" y1="92.0" x2="415.7" y2="100.0" stroke="#4d535e" stroke-width="1.25"/><text x="415.7" y="116.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><line x1="522.9" y1="92.0" x2="522.9" y2="100.0" stroke="#4d535e" stroke-width="1.25"/><text x="522.9" y="116.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">25</text><line x1="630.0" y1="92.0" x2="630.0" y2="100.0" stroke="#4d535e" stroke-width="1.25"/><text x="630.0" y="116.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">30</text><rect x="201.4" y="50" width="64.3" height="22" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="201.4" y="42.0" font-family="inherit" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Q1 = 10</text><text x="265.7" y="42.0" font-family="inherit" font-size="12" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Q3 = 13</text><line x1="105.0" y1="36.0" x2="105.0" y2="102.0" stroke="#ff6a00" stroke-width="1.5" stroke-dasharray="5 4"/><text x="105.0" y="134.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">5,5</text><line x1="362.1" y1="36.0" x2="362.1" y2="102.0" stroke="#ff6a00" stroke-width="1.5" stroke-dasharray="5 4"/><text x="362.1" y="134.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">17,5</text><line x1="47.4" y1="84.0" x2="55.4" y2="92.0" stroke="#ff6a00" stroke-width="2"/><line x1="47.4" y1="92.0" x2="55.4" y2="84.0" stroke="#ff6a00" stroke-width="2"/><circle cx="180.0" cy="88.0" r="3.2" fill="#17191e" stroke="#17191e" stroke-width="1.4"/><circle cx="201.4" cy="88.0" r="3.2" fill="#17191e" stroke="#17191e" stroke-width="1.4"/><circle cx="201.4" cy="79.0" r="3.2" fill="#17191e" stroke="#17191e" stroke-width="1.4"/><circle cx="222.9" cy="88.0" r="3.2" fill="#17191e" stroke="#17191e" stroke-width="1.4"/><circle cx="244.3" cy="88.0" r="3.2" fill="#17191e" stroke="#17191e" stroke-width="1.4"/><circle cx="244.3" cy="79.0" r="3.2" fill="#17191e" stroke="#17191e" stroke-width="1.4"/><circle cx="265.7" cy="88.0" r="3.2" fill="#17191e" stroke="#17191e" stroke-width="1.4"/><circle cx="287.1" cy="88.0" r="3.2" fill="#17191e" stroke="#17191e" stroke-width="1.4"/><line x1="604.6" y1="84.0" x2="612.6" y2="92.0" stroke="#ff6a00" stroke-width="2"/><line x1="604.6" y1="92.0" x2="612.6" y2="84.0" stroke="#ff6a00" stroke-width="2"/><text x="30.0" y="168.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">IQR = 13 − 10 = 3; границы 10 − 1,5 · 3 = 5,5 и 13 + 1,5 · 3 = 17,5; крестики — выбросы</text></svg>',
    width: 660,
    height: 190,
    alt: "Квартили и выбросы",
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
