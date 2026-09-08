import type { ReactNode } from "react";
import type { SvgDrawingTypes } from "~/shared/components/svg-drawing";

export namespace SvgPatternTypes {
  export type Bounds = {
    x: number;
    y: number;
    width: number | `${number}%`;
    height: number | `${number}%`;
  };

  export type FieldProps = {
    bounds: Bounds;
    children: ReactNode;
    className?: string;
    fade?: SvgDrawingTypes.Fade;
    name?: string;
    opacity?: number;
  };

  export type GridProps = Omit<FieldProps, "children"> & {
    cell: { width: number; height: number };
    transform?: string;
    lineClassName?: string;
    node?: { radius: number; className?: string };
  };

  export type StrokeEcho = Omit<SvgDrawingTypes.LineProps, "fade"> & {
    id: string;
  };

  export type Stroke = SvgDrawingTypes.LineProps & {
    id: string;
    echoes?: readonly StrokeEcho[];
  };

  export type StrokesProps = {
    strokes: readonly Stroke[];
    className?: string;
    transform?: string;
  };

  export type Label = {
    id: string;
    text: string;
    x: number;
    y: number;
    className?: string;
    opacity?: number;
    textAnchor?: "start" | "middle" | "end";
  };

  export type Node = {
    id: string;
    cx: number;
    cy: number;
    r: number;
    className?: string;
    opacity?: number;
  };

  export type PresetProps = Omit<FieldProps, "children"> & {
    contentClassName?: string;
    labels?: readonly Label[];
    nodes?: readonly Node[];
    strokes?: readonly Stroke[];
    transform?: string;
  };
}
