export namespace CodeBlockTypes {
  export type Props = {
    code: string;
    language: "python" | "text";
    label: string;
    showLineNumbers?: boolean;
    className?: string;
  };
}
