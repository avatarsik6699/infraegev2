import python from "@speed-highlight/core/languages/py.js";
import todo from "@speed-highlight/core/languages/todo.js";
import { tokenizeWith, type ShjToken } from "@speed-highlight/core/tokenize";

export type CodeBlockTokenChunk = {
  text: string;
  token?: ShjToken;
};

export type CodeBlockTokenLine = CodeBlockTokenChunk[];

function appendChunk(
  lines: CodeBlockTokenLine[],
  text: string,
  token?: ShjToken,
) {
  const parts = text.split("\n");

  parts.forEach((part, index) => {
    if (part) {
      lines.at(-1)?.push({ text: part, token });
    }

    if (index < parts.length - 1) {
      lines.push([]);
    }
  });
}

function create(code: string, language: "python" | "text") {
  const lines: CodeBlockTokenLine[] = [[]];

  if (language === "text") {
    appendChunk(lines, code);
    return lines;
  }

  tokenizeWith(code, "py", (text, token) => appendChunk(lines, text, token), {
    languages: { py: python, todo },
  });

  return lines;
}

export const codeBlockTokens = { create } as const;
