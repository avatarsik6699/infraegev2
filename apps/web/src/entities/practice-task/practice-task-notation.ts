/**
 * Bank statements keep a little TeX from their sources: `10^{30}`, `C_{12}`,
 * `n\%10` (Change 185, F7). The bank is operator data, so the notation is
 * read in presentation only: a script becomes a superscript or subscript, an
 * escaped percent the plain sign. Code is never read this way.
 */
export type PracticeTaskNotationSegment = {
  kind: "text" | "sup" | "sub";
  text: string;
};

const markup = /\\%|\^\{([^{}]*)\}|_\{([^{}]*)\}/g;

const superscripts: Readonly<Record<string, string>> = {
  ...Object.fromEntries([..."0123456789"].map((d, i) => [d, "⁰¹²³⁴⁵⁶⁷⁸⁹"[i]])),
  "+": "⁺",
  "-": "⁻",
  "(": "⁽",
  ")": "⁾",
  n: "ⁿ",
  i: "ⁱ",
};

const subscripts: Readonly<Record<string, string>> = {
  ...Object.fromEntries([..."0123456789"].map((d, i) => [d, "₀₁₂₃₄₅₆₇₈₉"[i]])),
  "+": "₊",
  "-": "₋",
  "(": "₍",
  ")": "₎",
};

function scripted(
  text: string,
  map: Readonly<Record<string, string>>,
  marker: string,
): string {
  const chars = [...text];
  return chars.every((char) => char in map)
    ? chars.map((char) => map[char]).join("")
    : `${marker}(${text})`;
}

export const practiceTaskNotation = {
  // `search` ignores lastIndex: `test` on the shared global pattern would
  // move it, and `matchAll` copies it.
  has(text: string): boolean {
    return text.search(markup) !== -1;
  },

  /** Text, superscript and subscript runs for rendering. */
  segments(text: string): PracticeTaskNotationSegment[] {
    const result: PracticeTaskNotationSegment[] = [];
    let plain = "";
    let last = 0;
    for (const match of text.matchAll(markup)) {
      plain += text.slice(last, match.index);
      last = match.index + match[0].length;
      if (match[0] === "\\%") {
        plain += "%";
        continue;
      }
      if (plain) result.push({ kind: "text", text: plain });
      plain = "";
      result.push(
        match[1] === undefined
          ? { kind: "sub", text: match[2] ?? "" }
          : { kind: "sup", text: match[1] },
      );
    }
    plain += text.slice(last);
    if (plain) result.push({ kind: "text", text: plain });
    return result;
  },

  /** One plain line (catalog previews): Unicode scripts where they exist. */
  plain(text: string): string {
    return text.replace(markup, (whole, sup?: string, sub?: string) => {
      if (whole === "\\%") return "%";
      return sup === undefined
        ? scripted(sub ?? "", subscripts, "_")
        : scripted(sup, superscripts, "^");
    });
  },
};
