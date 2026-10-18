export namespace PracticeTaskTypes {
  /** `href` points at another page that owns the section (topic subtopic pages). */
  export type TheoryLink = { hash: string; label: string; href?: string };

  export type AttachmentMimeType =
    | "text/plain"
    | "text/csv"
    | "application/json"
    | "text/x-python"
    | "application/zip"
    | "application/pdf"
    | "application/vnd.ms-excel"
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
    /** Change 191: the start of one question of a multi-part (19–21) task. */
    | { type: "part-heading"; text: string }
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

  /** Change 191: one independently checked question of a 19–21 task. */
  export type AnswerPart = {
    key: string;
    label: string;
    answerInstruction: string;
  };

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
    /** `false` for advanced-subtopic tasks: solved and saved as usual, but
     *  outside the lesson's mastery total (SPEC §1.4). Missing means counted. */
    countsTowardMastery?: boolean;
    answerParts?: readonly AnswerPart[];
  };

  /** Change 192: a paid task the visitor cannot open — its title and skills
   *  only; the API never sends the statement (SPEC §6.1). */
  export type LockedTask = {
    id: string;
    title: string;
    difficulty: number;
    difficultyLabel: string;
    skills: readonly string[];
    examNumbers: readonly number[];
    theoryLinks: readonly TheoryLink[];
    countsTowardMastery: boolean;
  };

  export type LocalTask = Task & {
    answers: readonly string[];
    explanation: string;
  };

  export type CheckResult = {
    correct: boolean;
    explanation: string;
    saved?: boolean;
    /** Per-part results of a multi-part task; unanswered parts are absent. */
    parts?: Readonly<Record<string, boolean>>;
  };
  /** One answer, or the answers of a multi-part task by part key. */
  export type Answer = string | Readonly<Record<string, string>>;
  export type Checker = (
    taskId: string,
    answer: Answer,
    solutionRevision: number,
  ) => Promise<CheckResult>;
}
