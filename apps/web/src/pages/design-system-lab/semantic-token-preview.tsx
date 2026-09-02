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

type StaticToken = SemanticToken & { kind: StaticTokenKind };
type MotionToken = SemanticToken & { kind: MotionTokenKind };

const isMotionToken = (token: SemanticToken): token is MotionToken =>
  isMotionTokenKind(token.kind);

export const SemanticTokenPreview: React.FC<{ token: SemanticToken }> = (
  props,
) =>
  isMotionToken(props.token) ? (
    <MotionTokenPreview token={props.token} />
  ) : (
    <StaticTokenPreview token={props.token as StaticToken} />
  );

const StaticTokenPreview: React.FC<{ token: StaticToken }> = ({ token }) => {
  const configuration: StaticPreviewConfiguration =
    staticPreviewConfigurations[token.kind];
  const previewStyle: StaticPreviewStyle = {
    [configuration.styleProperty]: `var(${token.name})`,
  };

  if (token.previewTextColor) {
    previewStyle.color = `var(${token.previewTextColor})`;
  }

  return (
    <span
      className={configuration.className}
      data-token-kind={token.kind}
      data-token-preview={token.name}
      style={previewStyle}
    >
      {configuration.sample ?? token.label}
    </span>
  );
};

const MotionTokenPreview: React.FC<{ token: MotionToken }> = ({ token }) => {
  const tokenValue = `var(${token.name})`;
  const motionStyle =
    token.kind === "motion-duration"
      ? { transitionDuration: tokenValue, transitionTimingFunction: "linear" }
      : { transitionDuration: "700ms", transitionTimingFunction: tokenValue };

  return (
    <button
      className={styles.tokenMotionPreview}
      type="button"
      aria-label={`${token.purpose}: наведите или сфокусируйте`}
      data-token-motion={token.name}
    >
      <span className={styles.tokenMotionTrack} aria-hidden="true">
        <span
          className={styles.tokenMotionDot}
          data-token-kind={token.kind}
          data-token-preview={token.name}
          style={motionStyle}
        />
      </span>
      <span>{token.label}</span>
    </button>
  );
};
