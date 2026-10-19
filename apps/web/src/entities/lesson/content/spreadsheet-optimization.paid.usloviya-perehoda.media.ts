// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  sheet11: {
    kind: "sheet",
    sheets: [
      {
        name: "Чётность",
        cols: [1, 3],
        rows: [1, 17],
        inputs: {
          A1: "3",
          B1: "5",
          C1: "8",
          A2: "4",
          B2: "7",
          C2: "2",
          A3: "6",
          B3: "1",
          C3: "9",
          B5: '=ЕСЛИ(ОСТАТ(A1;2)=ОСТАТ(B1;2);A13;"X")',
          C5: '=ЕСЛИ(ОСТАТ(B1;2)=ОСТАТ(C1;2);B13;"X")',
          B6: '=ЕСЛИ(ОСТАТ(A2;2)=ОСТАТ(B2;2);A14;"X")',
          C6: '=ЕСЛИ(ОСТАТ(B2;2)=ОСТАТ(C2;2);B14;"X")',
          B7: '=ЕСЛИ(ОСТАТ(A3;2)=ОСТАТ(B3;2);A15;"X")',
          C7: '=ЕСЛИ(ОСТАТ(B3;2)=ОСТАТ(C3;2);B15;"X")',
          A10: '=ЕСЛИ(ОСТАТ(A1;2)<>ОСТАТ(A2;2);A13;"X")',
          B10: '=ЕСЛИ(ОСТАТ(B1;2)<>ОСТАТ(B2;2);B13;"X")',
          C10: '=ЕСЛИ(ОСТАТ(C1;2)<>ОСТАТ(C2;2);C13;"X")',
          A11: '=ЕСЛИ(ОСТАТ(A2;2)<>ОСТАТ(A3;2);A14;"X")',
          B11: '=ЕСЛИ(ОСТАТ(B2;2)<>ОСТАТ(B3;2);B14;"X")',
          C11: '=ЕСЛИ(ОСТАТ(C2;2)<>ОСТАТ(C3;2);C14;"X")',
          A13: "=A1",
          B13: '=ЕСЛИ(СЧЁТ(B5)=0;"X";B1+B5)',
          C13: '=ЕСЛИ(СЧЁТ(C5)=0;"X";C1+C5)',
          A14: '=ЕСЛИ(СЧЁТ(A10)=0;"X";A2+A10)',
          B14: '=ЕСЛИ(СЧЁТ(B6;B10;A13)=0;"X";B2+МАКС(B6;B10;A13))',
          C14: '=ЕСЛИ(СЧЁТ(C6;C10;B13)=0;"X";C2+МАКС(C6;C10;B13))',
          A15: '=ЕСЛИ(СЧЁТ(A11)=0;"X";A3+A11)',
          B15: '=ЕСЛИ(СЧЁТ(B7;B11;A14)=0;"X";B3+МАКС(B7;B11;A14))',
          C15: '=ЕСЛИ(СЧЁТ(C7;C11;B14)=0;"X";C3+МАКС(C7;C11;B14))',
          A17: '=СЧЁТЕСЛИ(A13:C15;"X")',
        },
        formats: {},
        filtered: [],
        hidden: [],
        edit: ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"],
        formulas: [
          {
            cell: "A10",
            formula: '=ЕСЛИ(ОСТАТ(A1;2)<>ОСТАТ(A2;2);A13;"X")',
            until: "C11",
          },
          { cell: "A13", formula: "=A1" },
          {
            cell: "A14",
            formula: '=ЕСЛИ(СЧЁТ(A10)=0;"X";A2+A10)',
            until: "A15",
          },
          { cell: "A17", formula: '=СЧЁТЕСЛИ(A13:C15;"X")' },
          {
            cell: "B5",
            formula: '=ЕСЛИ(ОСТАТ(A1;2)=ОСТАТ(B1;2);A13;"X")',
            until: "C7",
          },
          { cell: "B13", formula: '=ЕСЛИ(СЧЁТ(B5)=0;"X";B1+B5)', until: "C13" },
          {
            cell: "B14",
            formula: '=ЕСЛИ(СЧЁТ(B6;B10;A13)=0;"X";B2+МАКС(B6;B10;A13))',
            until: "C15",
          },
        ],
      },
    ],
    select: ["Чётность", "C15"],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
