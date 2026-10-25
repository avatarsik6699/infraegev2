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

/** Shared word forms, so every page declines the same nouns the same way. */
export const russianForms = {
  lesson: ["урок", "урока", "уроков"],
  task: ["задание", "задания", "заданий"],
} as const satisfies Record<string, RussianForms>;

export const russianCount = {
  /** «3 полные порции», «5 полных порций», «21 клетка». */
  of(count: number, forms: RussianForms): string {
    return `${String(count)} ${russianCount.noun(count, forms)}`;
  },
  /** The word alone, for a number set apart: «27» over «уроков в курсе». */
  noun(count: number, forms: RussianForms): string {
    const index: Partial<Record<Intl.LDMLPluralRule, number>> = {
      one: 0,
      few: 1,
    };
    return forms[index[taskPluralRules.select(count)] ?? 2];
  },
  lessons(count: number): string {
    return russianCount.of(count, russianForms.lesson);
  },
  tasks(count: number): string {
    return `${String(count)} ${taskForms[taskPluralRules.select(count)]}`;
  },
  subtopics(count: number): string {
    return `${String(count)} ${subtopicForms[taskPluralRules.select(count)]}`;
  },
  /**
   * « + 3 дополнительных» after a main count (Change 185, F8): the main number
   * is what progress counts, the additional lessons or tasks follow apart.
   * Empty when there are none.
   */
  additional(count: number, of: "lessons" | "tasks"): string {
    if (count === 0) return "";
    return ` + ${russianCount.of(count, of === "lessons" ? ["дополнительный", "дополнительных", "дополнительных"] : ["дополнительная", "дополнительные", "дополнительных"])}`;
  },
};
