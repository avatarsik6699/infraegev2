export const formValues = {
  read(form: HTMLFormElement): Record<string, string | string[]> {
    const result: Record<string, string | string[]> = {};
    for (const [name, value] of new FormData(form)) {
      if (typeof value !== "string") continue;
      const previous = result[name];
      result[name] =
        previous === undefined
          ? value
          : [...(Array.isArray(previous) ? previous : [previous]), value];
    }
    return result;
  },
};
