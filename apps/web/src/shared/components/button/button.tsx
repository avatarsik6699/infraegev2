import { Button as BaseButton } from "@base-ui/react/button";
import { cssUtils } from "~/shared/lib/css-utils";
import type { ButtonTypes } from "./button.types";
import styles from "./button.module.css";

export const Button: React.FC<ButtonTypes.Props> = ({
  hierarchy = "primary",
  density = "default",
  loading = false,
  iconStart,
  iconEnd,
  fullWidth = false,
  children,
  className,
  disabled,
  ...buttonProps
}) => {
  return (
    <BaseButton
      {...buttonProps}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-hierarchy={hierarchy}
      data-density={density}
      data-full-width={fullWidth || undefined}
      className={cssUtils.cx(styles.root, className)}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        iconStart
      )}
      <span className={styles.label}>{children}</span>
      {iconEnd}
    </BaseButton>
  );
};
