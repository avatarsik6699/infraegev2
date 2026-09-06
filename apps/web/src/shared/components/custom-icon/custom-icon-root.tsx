import type { CustomIconTypes } from "./custom-icon.types";

export const CustomIconRoot: React.FC<CustomIconTypes.RootProps> = ({
  children,
  label,
  ...props
}) => (
  <svg
    {...props}
    aria-hidden={label ? undefined : true}
    aria-label={label}
    data-custom-icon="root"
    focusable="false"
    preserveAspectRatio="xMidYMid meet"
    role={label ? "img" : undefined}
  >
    {label ? <title>{label}</title> : null}
    {children}
  </svg>
);
