export namespace StatusSceneTypes {
  export type Props = {
    title: string;
    description?: string;
    headingOrder?: 1 | 2 | 3 | 4;
    children?: React.ReactNode;
  } & (
    | { kind: "code"; code: "404" | "502" | "503" | "504" }
    | { kind: "error" | "pending"; code?: never }
  );
}
