import { createLink } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { forwardRef } from "react";
import { DrawnLinkUnderline } from "~/shared/components/link-decoration";
import { SvgDrawing } from "~/shared/components/svg-drawing";
import { cssUtils } from "~/shared/lib/css-utils";
import type { ActionLinkTypes } from "./action-link.types";
import styles from "./action-link.module.css";

const arrowFade = {
  from: { x: 1, y: 0 },
  to: { x: 31, y: 0 },
  stops: [
    { offset: 0, opacity: 0 },
    { offset: 0.28, opacity: 0.78 },
    { offset: 1, opacity: 1 },
  ],
} as const;

const DrawnArrow: React.FC = () => (
  <svg
    className={styles.drawnArrow}
    viewBox="0 0 34 22"
    aria-hidden="true"
    data-action-arrow
  >
    <SvgDrawing.Arrow
      shaft={{
        kind: "tapered",
        d: "M1 10.7c9-.3 19-.5 29-1.1l.1 1.2c-10 .7-20 .9-29.1 1.1Z",
        fade: arrowFade,
      }}
      head={{
        d: "M24.5 3.4c3.1 2.4 5.8 4.9 7.9 7.1-2.3 2.8-4.8 5.5-7.6 8",
        strokeWidth: 1.65,
      }}
    />
  </svg>
);

type ActionLinkDecorationProps = Pick<
  ActionLinkTypes.RootProps,
  "hierarchy" | "icon"
>;

const LeadingIcon: React.FC<ActionLinkDecorationProps> = ({
  hierarchy,
  icon,
}) => {
  if (icon !== "back") return null;
  if (hierarchy === "drawn") return <DrawnArrow />;

  return (
    <ArrowLeft
      className={cssUtils.cx(styles.icon, styles.backIcon)}
      aria-hidden="true"
      strokeWidth={1.8}
    />
  );
};

const TrailingIcon: React.FC<ActionLinkDecorationProps> = ({
  hierarchy,
  icon,
}) => {
  if (icon !== "forward") return null;
  if (hierarchy === "drawn") return <DrawnArrow />;

  return (
    <ArrowRight
      className={cssUtils.cx(styles.icon, styles.forwardIcon)}
      aria-hidden="true"
      strokeWidth={1.8}
    />
  );
};

const LinkLabel: React.FC<
  Pick<ActionLinkTypes.RootProps, "children" | "hierarchy">
> = ({ children, hierarchy }) => (
  <span className={styles.label}>
    {children}
    {hierarchy === "drawn" ? <DrawnLinkUnderline /> : null}
  </span>
);

const hierarchyClasses = {
  drawn: styles.drawn,
  quiet: styles.quiet,
  secondary: styles.secondary,
  text: styles.text,
} as const;

const ActionLinkRoot = forwardRef<HTMLAnchorElement, ActionLinkTypes.RootProps>(
  function ActionLinkRoot(
    { hierarchy = "secondary", children, className, ariaLabel, icon, ...props },
    ref,
  ) {
    return (
      <a
        {...props}
        ref={ref}
        aria-label={ariaLabel}
        data-hierarchy={hierarchy}
        data-icon={icon}
        className={cssUtils.cx(
          styles.root,
          hierarchyClasses[hierarchy],
          className,
        )}
      >
        <LeadingIcon hierarchy={hierarchy} icon={icon} />
        <LinkLabel hierarchy={hierarchy}>{children}</LinkLabel>
        <TrailingIcon hierarchy={hierarchy} icon={icon} />
      </a>
    );
  },
);

const CreatedActionLink = createLink(ActionLinkRoot);

export const ActionLink =
  CreatedActionLink as unknown as React.FC<ActionLinkTypes.Props>;
