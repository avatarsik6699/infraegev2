const taskForms: Record<Intl.LDMLPluralRule, string> = {
  zero: "задач",
  one: "задача",
  two: "задачи",
  few: "задачи",
  many: "задач",
  other: "задач",
};

const taskPluralRules = new Intl.PluralRules("ru-RU");

export const russianCount = {
  tasks(count: number): string {
    return `${String(count)} ${taskForms[taskPluralRules.select(count)]}`;
  },
};
