import styles from "./design-system-lab.module.css";

export type SemanticToken = {
  kind:
    | "background"
    | "focus-color"
    | "focus-shadow"
    | "font-size"
    | "measure"
    | "motion-duration"
    | "motion-easing"
    | "radius"
    | "rule"
    | "shadow"
    | "text";
  label: string;
  name: `--${string}`;
  purpose: string;
  previewTextColor?: `--${string}`;
};

type MotionTokenKind = Extract<
  SemanticToken["kind"],
  "motion-duration" | "motion-easing"
>;

type StaticTokenKind = Exclude<SemanticToken["kind"], MotionTokenKind>;

type StaticPreviewStyleProperty =
  | "backgroundColor"
  | "borderRadius"
  | "borderTopColor"
  | "boxShadow"
  | "color"
  | "fontSize"
  | "maxWidth"
  | "outlineColor";

type StaticPreviewConfiguration = {
  className: string;
  sample?: string;
  styleProperty: StaticPreviewStyleProperty;
};

type StaticPreviewStyle = Partial<Record<StaticPreviewStyleProperty, string>>;

const staticPreviewConfigurations = {
  background: {
    className: styles.tokenBackgroundPreview,
    styleProperty: "backgroundColor",
  },
  "focus-color": {
    className: styles.tokenFocusPreview,
    styleProperty: "outlineColor",
  },
  "focus-shadow": {
    className: styles.tokenFocusShadowPreview,
    styleProperty: "boxShadow",
  },
  "font-size": {
    className: styles.tokenFontSizePreview,
    sample: "Aa",
    styleProperty: "fontSize",
  },
  measure: {
    className: styles.tokenMeasurePreview,
    styleProperty: "maxWidth",
  },
  radius: {
    className: styles.tokenRadiusPreview,
    styleProperty: "borderRadius",
  },
  rule: {
    className: styles.tokenRulePreview,
    styleProperty: "borderTopColor",
  },
  shadow: {
    className: styles.tokenShadowPreview,
    styleProperty: "boxShadow",
  },
  text: {
    className: styles.tokenTextPreview,
    styleProperty: "color",
  },
} as const satisfies Record<StaticTokenKind, StaticPreviewConfiguration>;

const motionTokenKinds: ReadonlySet<SemanticToken["kind"]> = new Set([
  "motion-duration",
  "motion-easing",
]);

const isMotionTokenKind = (
  kind: SemanticToken["kind"],
): kind is MotionTokenKind => motionTokenKinds.has(kind);

export const SemanticTokenPreview: React.FC<{ token: SemanticToken }> = (
  props,
) => {
  const tokenValue = `var(${props.token.name})`;
  const dataProps = {
    "data-token-kind": props.token.kind,
    "data-token-preview": props.token.name,
  };

  if (!isMotionTokenKind(props.token.kind)) {
    const configuration: StaticPreviewConfiguration =
      staticPreviewConfigurations[props.token.kind];
    const previewStyle: StaticPreviewStyle = {
      [configuration.styleProperty]: tokenValue,
    };

    if (props.token.previewTextColor) {
      previewStyle.color = `var(${props.token.previewTextColor})`;
    }

    return (
      <span
        {...dataProps}
        className={configuration.className}
        style={previewStyle}
      >
        {configuration.sample ?? props.token.label}
      </span>
    );
  }

  const motionStyle =
    props.token.kind === "motion-duration"
      ? { transitionDuration: tokenValue, transitionTimingFunction: "linear" }
      : { transitionDuration: "700ms", transitionTimingFunction: tokenValue };

  return (
    <button
      className={styles.tokenMotionPreview}
      type="button"
      aria-label={`${props.token.purpose}: наведите или сфокусируйте`}
      data-token-motion={props.token.name}
    >
      <span className={styles.tokenMotionTrack} aria-hidden="true">
        <span
          {...dataProps}
          className={styles.tokenMotionDot}
          style={motionStyle}
        />
      </span>
      <span>{props.token.label}</span>
    </button>
  );
};
