const taskForms: Record<Intl.LDMLPluralRule, string> = {
  zero: "задач",
  one: "задача",
  two: "задачи",
  few: "задачи",
  many: "задач",
  other: "задач",
};

const subtopicForms: Record<Intl.LDMLPluralRule, string> = {
  zero: "подтем",
  one: "подтема",
  two: "подтемы",
  few: "подтемы",
  many: "подтем",
  other: "подтем",
};

const taskPluralRules = new Intl.PluralRules("ru-RU");

/** Word forms for 1, 2–4 and 5 of something: «клетка», «клетки», «клеток». */
export type RussianForms = readonly [one: string, few: string, many: string];

export const russianCount = {
  /** «3 полные порции», «5 полных порций», «21 клетка». */
  of(count: number, forms: RussianForms): string {
    const index: Partial<Record<Intl.LDMLPluralRule, number>> = {
      one: 0,
      few: 1,
    };
    const word = forms[index[taskPluralRules.select(count)] ?? 2];
    return `${String(count)} ${word}`;
  },
  tasks(count: number): string {
    return `${String(count)} ${taskForms[taskPluralRules.select(count)]}`;
  },
  subtopics(count: number): string {
    return `${String(count)} ${subtopicForms[taskPluralRules.select(count)]}`;
  },
};
