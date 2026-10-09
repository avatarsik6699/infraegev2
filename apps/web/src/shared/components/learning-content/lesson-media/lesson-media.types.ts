/** Media written by `scripts/lesson_design/export_media.py` (Change 171). */
export namespace LessonMediaTypes {
  export type Diagram = {
    kind: "diagram";
    /** Repository-generated SVG markup, rendered inline in the page font. */
    svg: string;
    width: number;
    height: number;
    /** Short name of the picture for screen readers; the idea is the caption. */
    alt: string;
  };

  export type StepperFrame = { svg: string; caption: string };

  export type Stepper = {
    kind: "stepper";
    width: number;
    height: number;
    frames: readonly [StepperFrame, ...StepperFrame[]];
  };

  export type Generated = Diagram | Stepper;
}
