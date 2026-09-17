import type { PracticeTaskTypes } from "~/entities/practice-task";
import { practiceTasks } from "./design-system-lab.constants";

const base = practiceTasks[0];
export const practiceUxFixtures: Record<string, PracticeTaskTypes.LocalTask> = {
  formula: {
    ...base,
    id: "lab-practice-formula",
    title: "Короткое условие с формулой",
    answerInstruction: "Введите одно целое число. В этом примере ответ — 4.",
    explanationKind: "worked_solution",
    statement: [
      {
        type: "rich-text",
        spans: [
          { kind: "text", text: "Дано " },
          { kind: "formula", text: "F(n) = 2n" },
          { kind: "text", text: ". Найдите F(2)." },
        ],
      },
    ],
    answers: ["4"],
    hint: [{ type: "text", text: "Подставьте 2 вместо n." }],
    solution: [
      {
        type: "rich-text",
        spans: [{ kind: "formula", text: "F(2) = 2 × 2 = 4" }],
      },
    ],
    theoryLinks: [{ hash: "/ege/16-rekursiya", label: "Рекурсия" }],
  },
  code: {
    ...base,
    id: "lab-practice-code",
    title: "Один алгоритм на двух языках",
    answerInstruction: "Введите число. Правильный ответ — 0.",
    explanationKind: "method",
    statement: [
      {
        type: "text",
        text: "При каком значении n функция перестаёт вызывать себя?",
      },
      {
        type: "code-variants",
        variants: [
          {
            label: "Pascal",
            language: "text",
            code: "procedure countdown(n: integer);\nbegin\n  if n > 0 then countdown(n - 1);\nend;",
          },
          {
            label: "Python",
            language: "python",
            code: "def countdown(n):\n    if n > 0:\n        countdown(n - 1)",
          },
        ],
      },
    ],
  },
  long: {
    ...base,
    id: "lab-practice-long",
    title: "Длинное условие и файл",
    answerInstruction:
      "Введите количество значений. В демонстрационном примере ответ — 0.",
    explanationKind: "unclassified",
    statement: [
      {
        type: "text",
        text: "Исполнитель последовательно читает значения из текстового файла. Для каждого значения он запускает рекурсивную функцию, которая уменьшает аргумент на единицу до достижения базового случая. Считайте только исходные значения, при которых рекурсивного вызова не происходит.",
      },
      {
        type: "text",
        text: "Перед решением определите условие остановки. Затем сопоставьте его с исходными данными. Открыть файл можно отдельно: переход к данным не должен мешать чтению условия и вводу ответа. Это учебный макет для оценки длинного условия, а не задача из каталога.",
      },
      {
        type: "attachment",
        src: "/content/tasks/python-files-aggregate/numbers.txt",
        label: "numbers.txt",
        description: "Исходные числа",
        mimeType: "text/plain",
        sizeBytes: 16,
      },
    ],
  },
};
