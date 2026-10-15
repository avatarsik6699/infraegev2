/**
 * Change 185 (F30): a few pen marks over a topic row — in the row's top and
 * bottom margins anywhere, and in the picture's column at any height — like
 * the floaters around the mascot scenes. Positions follow the topic id, so a
 * row keeps its marks between visits. Decorative; the row crops them.
 */
const seedOf = (id: string) =>
  [...id].reduce(
    (hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619),
    2166136261,
  );

/** mulberry32: a small seeded generator, the same marks on server and client. */
const random = (seed: number) => {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const between = (next: () => number, from: number, to: number) =>
  from + next() * (to - from);

const marksOf = (id: string) => {
  const next = random(seedOf(id));
  return Array.from({ length: 6 }, (_, index) => {
    const side = index % 3 === 0;
    let top = between(next, 12, 88);
    if (!side) top = next() < 0.5 ? between(next, 3, 8) : between(next, 92, 97);
    return {
      left: side ? between(next, 1, 15) : between(next, 4, 96),
      top,
      zone: side ? "side" : "band",
      ring: index % 2 === 1,
    };
  });
};

export const TopicCatalogMarks: React.FC<{
  topicId: string;
  className?: string;
  markClassName?: string;
}> = (props) => (
  <span className={props.className} aria-hidden="true">
    {marksOf(props.topicId).map((mark, index) => (
      <svg
        key={String(index)}
        className={props.markClassName}
        data-zone={mark.zone}
        style={{
          left: `${mark.left.toFixed(1)}%`,
          top: `${mark.top.toFixed(1)}%`,
        }}
        viewBox="-6 -6 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      >
        {mark.ring ? <circle r="3.6" /> : <path d="M0 -5v10M-5 0h10" />}
      </svg>
    ))}
  </span>
);
