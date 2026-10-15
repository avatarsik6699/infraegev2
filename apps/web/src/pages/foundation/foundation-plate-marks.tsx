/**
 * Change 185: a few small pen marks (crosses and rings) spread over a home
 * topic card's picture plate, like the floaters around the mascot scenes.
 * Decorative; the plate crops them to its own shape.
 */
export const FoundationPlateMarks: React.FC<{ className?: string }> = (
  props,
) => (
  <svg
    className={props.className}
    viewBox="0 0 300 140"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M22 22v10M17 27h10" />
    <circle cx="276" cy="24" r="4" />
    <path d="M258 112v8M254 116h8" />
    <circle cx="38" cy="114" r="3.2" />
    <path d="M150 12v6M147 15h6" />
  </svg>
);
