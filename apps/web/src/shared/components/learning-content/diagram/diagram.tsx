import { Image } from "~/shared/components/image";
import { LearningVisualFrame } from "../learning-visual-frame";
import type { DiagramTypes } from "./diagram.types";

export const Diagram: React.FC<DiagramTypes.Props> = (props) => (
  <LearningVisualFrame
    className={props.className}
    caption={props.caption}
    purpose={props.purpose}
    accessibleDescription={props.description}
  >
    <Image
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
      fit="contain"
    />
  </LearningVisualFrame>
);
