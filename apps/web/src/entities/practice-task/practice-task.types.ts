export namespace PracticeTaskTypes {
  export type TheoryLink = { hash: string; label: string };

  export type AttachmentMimeType =
    | "text/plain"
    | "text/csv"
    | "application/json"
    | "text/x-python"
    | "application/zip"
    | "application/pdf"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "application/vnd.oasis.opendocument.spreadsheet"
    | "application/vnd.oasis.opendocument.text";

  export type InlineSpan = { kind: "text" | "code" | "formula"; text: string };
  export type CodeVariant = {
    label: string;
    language: "python" | "text";
    code: string;
  };

  export type ContentBlock =
    | { type: "rich-text"; spans: readonly InlineSpan[] }
    | { type: "code-variants"; variants: readonly CodeVariant[] }
    | { type: "text"; text: string }
    | {
        type: "list";
        style: "ordered" | "unordered";
        items: readonly string[];
      }
    | {
        type: "code";
        code: string;
        language: "python" | "text";
        caption?: string;
      }
    | {
        type: "table";
        headers: readonly string[];
        rows: readonly (readonly string[])[];
        caption?: string;
      }
    | {
        type: "image";
        src: string;
        alt: string;
        caption: string;
        width: number;
        height: number;
      }
    | {
        type: "diagram";
        src: string;
        alt: string;
        caption: string;
        width: number;
        height: number;
        purpose: string;
        accessibleDescription: string;
        pointers: readonly { label: string; description: string }[];
      }
    | {
        type: "attachment";
        src: string;
        label: string;
        description: string;
        mimeType: AttachmentMimeType;
        sizeBytes: number;
      }
    | { type: "callout"; tone: "idea" | "warning"; text: string }
    | { type: "steps"; prompt: string; steps: readonly string[] };

  export type Task = {
    id: string;
    solutionRevision: number;
    difficulty: number;
    difficultyLabel: string;
    answerInstruction?: string;
    explanationKind?: "unclassified" | "method" | "worked_solution";
    title: string;
    statement: readonly ContentBlock[];
    hint: readonly ContentBlock[];
    theoryLinks: readonly TheoryLink[];
    solution: readonly ContentBlock[];
  };

  export type LocalTask = Task & {
    answers: readonly string[];
    explanation: string;
  };

  export type CheckResult = {
    correct: boolean;
    explanation: string;
    saved?: boolean;
  };
  export type Checker = (
    taskId: string,
    answer: string,
    solutionRevision: number,
  ) => Promise<CheckResult>;
}
