import type { PracticeTaskTypes } from "./practice-task.types";

type Block = PracticeTaskTypes.ContentBlock;

/** The rest of a lead text once the title is removed, or undefined if it does not open with it. */
const restAfterTitle = (text: string, title: string): string | undefined => {
  const lead = text.trimStart();
  if (lead.trim() === title) return "";
  // Only a whole sentence counts: «Найдите X.» before «Затем…», never half a phrase.
  if (!/[.?!:]$/u.test(title) || !lead.startsWith(title)) return undefined;
  const rest = lead.slice(title.length);
  return /^\s/u.test(rest) ? rest.trimStart() : undefined;
};

const stripLead = (block: Block, title: string): Block | null | undefined => {
  if (block.type === "text") {
    const rest = restAfterTitle(block.text, title);
    if (rest === undefined) return undefined;
    return rest ? { ...block, text: rest } : null;
  }
  if (block.type === "rich-text") {
    const [first, ...spans] = block.spans;
    if (first?.kind !== "text") return undefined;
    const rest = restAfterTitle(first.text, title);
    if (rest === undefined) return undefined;
    const kept = rest ? [{ ...first, text: rest }, ...spans] : spans;
    return kept.length > 0 ? { ...block, spans: kept } : null;
  }
  return undefined;
};

/**
 * Change 186 F12: the statement without a lead sentence that only repeats the
 * task title, which every view already shows above it.
 */
const withoutTitle = (
  statement: readonly Block[],
  title: string,
): readonly Block[] => {
  const [first, ...rest] = statement;
  const name = title.trim();
  if (!first || !name) return statement;
  const lead = stripLead(first, name);
  if (lead === undefined) return statement;
  return lead ? [lead, ...rest] : rest;
};

export const practiceTaskStatement = { withoutTitle };
