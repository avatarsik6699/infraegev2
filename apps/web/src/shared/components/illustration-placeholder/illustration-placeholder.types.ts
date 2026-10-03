export namespace IllustrationPlaceholderTypes {
  /** `soft`: filled neutral plate (rows, cards); `outline`: white plate with a dashed edge (page heads). */
  export type Tone = "soft" | "outline";

  export type Props = {
    tone?: Tone;
    className?: string;
  };
}
