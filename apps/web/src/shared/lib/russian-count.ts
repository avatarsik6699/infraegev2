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

export const russianCount = {
  tasks(count: number): string {
    return `${String(count)} ${taskForms[taskPluralRules.select(count)]}`;
  },
  subtopics(count: number): string {
    return `${String(count)} ${subtopicForms[taskPluralRules.select(count)]}`;
  },
};
