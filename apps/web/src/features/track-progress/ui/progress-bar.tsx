type Props = { ratio: number };

export const ProgressBar: React.FC<Props> = (props) => {
  const percent = Math.round(props.ratio * 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          background: "var(--color-muted)",
          height: "0.5rem",
          borderRadius: "0.25rem",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            background: "var(--color-accent)",
            height: "100%",
            borderRadius: "0.25rem",
          }}
        />
      </div>
      <span>{percent}%</span>
    </div>
  );
};
