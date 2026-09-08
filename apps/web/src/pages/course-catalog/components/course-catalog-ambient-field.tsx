import styles from "../course-catalog-page.module.css";

export const CourseCatalogAmbientField: React.FC = () => (
  <div className={styles.ambientField} aria-hidden="true">
    <svg
      className={styles.ambientScene}
      viewBox="0 0 1440 1400"
      fill="none"
      preserveAspectRatio="xMidYMin slice"
    >
      <defs>
        <filter id="course-staircase-ink" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3 -3 -3 0 8.4"
          />
        </filter>
        <filter id="course-artwork-paper" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -3 -3 -3 0 8.25"
          />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <pattern
          id="course-catalog-perspective-grid"
          width="110"
          height="110"
          patternUnits="userSpaceOnUse"
          patternTransform="matrix(1 -.35 1 .35 -700 300)"
        >
          <path d="M110 0H0V110" className={styles.ambientGridLine} />
        </pattern>
      </defs>
      <rect
        width="1440"
        height="1400"
        fill="url(#course-catalog-perspective-grid)"
      />
      <g className={styles.ambientNotation}>
        <text x="14" y="455">
          for i in range(n):
        </text>
        <text x="38" y="480">
          ans += i
        </text>
        <text x="1100" y="1180">
          if candidate &lt; best:
        </text>
        <text x="1124" y="1205">
          best = candidate
        </text>
      </g>
    </svg>
  </div>
);
