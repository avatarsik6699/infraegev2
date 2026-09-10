import styles from "./status-scene.module.css";

export const StatusScenePattern: React.FC = () => (
  <div className={styles.patternField} aria-hidden="true">
    <svg
      viewBox="0 0 1400 800"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M-90 220a210 210 0 0 1 420 0M-60 220a180 180 0 0 1 360 0M1120 530a210 210 0 0 1 420 0M1150 530a180 180 0 0 1 360 0" />
        <path d="M72 116h16m-8-8v16M1250 160h24m-12-12v24M1180 680h16m-8-8v16M280 630h16m-8-8v16" />
        <path d="M1080 96h160m-140-5v10m30-10v10m30-10v10m30-10v10m30-10v10M84 510v90m-5-70h10m-10 25h10m-10 25h10" />
        <path d="m1330 280 5 14 14 5-14 5-5 14-5-14-14-5 14-5Z" />
      </g>
      <g fill="currentColor">
        <circle cx="230" cy="320" r="2" />
        <circle cx="246" cy="320" r="2" />
        <circle cx="262" cy="320" r="2" />
        <circle cx="1150" cy="370" r="2" />
        <circle cx="1166" cy="370" r="2" />
        <circle cx="1182" cy="370" r="2" />
        <circle cx="320" cy="110" r="2" />
        <circle cx="1040" cy="630" r="2" />
      </g>
    </svg>
  </div>
);
