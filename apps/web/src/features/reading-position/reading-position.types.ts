import type { RefObject } from "react";

export namespace ReadingPositionTypes {
  export type Props = {
    targetRef: RefObject<HTMLElement | null>;
  };
}
