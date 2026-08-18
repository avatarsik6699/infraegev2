export namespace CalloutTypes {
  export type Tone = "idea" | "warning";
  export type Density = "default" | "dense";

  export type Props = {
    tone: Tone;
    title: string;
    density?: Density;
    children: React.ReactNode;
  };
}
