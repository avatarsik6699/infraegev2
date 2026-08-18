import { Input as BaseInput } from "@base-ui/react/input";
import { cssUtils } from "~/shared/lib/css-utils";
import type { InputTypes } from "./input.types";
import styles from "./input.module.css";

export const Input: React.FC<InputTypes.Props> = ({
  invalid = false,
  className,
  ...inputProps
}) => (
  <BaseInput
    {...inputProps}
    aria-invalid={invalid || undefined}
    className={cssUtils.cx(styles.root, className)}
    // Base UI 1.7.0 merges an empty client-side style object in Field.Control.
    // The pinned version emits no style attribute during SSR, so keep this
    // benign vendor-only attribute difference inside the local boundary.
    suppressHydrationWarning
  />
);
