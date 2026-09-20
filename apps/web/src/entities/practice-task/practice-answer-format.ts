const labels: Readonly<Record<string, string>> = {
  "Запишите целое число в десятичной системе счисления.": "Целое число",
  "Введите ответ по условию задачи. Порядок значений важен.": "По условию",
};

export const practiceAnswerFormat = {
  label(instruction?: string) {
    // Do not infer an answer's shape from private checker values.
    return instruction ? (labels[instruction] ?? instruction) : "По условию";
  },
};
