/**
 * Declarative CSS Module class composition — the single place class-name strings get assembled
 * instead of ad hoc template strings or `.filter(Boolean).join(" ")` at each call site. Shape and
 * usage mirror the `classnames`/`clsx` convention: falsy values are dropped, arrays are flattened,
 * and a `{ className: condition }` map applies each key whose condition is truthy.
 */

type ClassValue =
  | string
  | null
  | undefined
  | false
  | Record<string, boolean | null | undefined>
  | ClassValue[];

function resolve(value: ClassValue, out: string[]): void {
  if (!value) return;
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) resolve(item, out);
    return;
  }
  for (const key in value) {
    if (value[key]) out.push(key);
  }
}

/** Joins class names, dropping falsy values. Accepts strings, arrays and `{ className: boolean }` maps. */
function cx(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const value of values) resolve(value, out);
  return out.join(" ");
}

export const cssUtils = { cx };
