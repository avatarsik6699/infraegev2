export namespace PracticeTaskTypes {
  export type TheoryLink = { hash: string; label: string };

  export type AttachmentMimeType =
    | "text/plain"
    | "text/csv"
    | "application/json"
    | "text/x-python"
    | "application/zip";

  export type ContentBlock =
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
    difficultyLabel: string;
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

  export type CheckResult = { correct: boolean; explanation: string };
  export type Checker = (
    taskId: string,
    answer: string,
  ) => Promise<CheckResult>;
}
