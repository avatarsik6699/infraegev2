// a minus stays with what it subtracts: a browser may break after «-»
const MINUS = /(-[\p{L}\p{N}$.!:]+)/u;

/**
 * A formula as one flowing line (Change 184 F13): it breaks only after an
 * argument separator «;», never inside a reference, a name or a quoted text.
 */
export function breakable(text: string, key: string | number): React.ReactNode {
  return text.split(/(?<=;)/u).map((piece, k) => {
    const id = `${String(key)}-${String(k)}`;
    const parts = piece.split(MINUS).map((part, m) =>
      m % 2 ? (
        <span key={`${id}-${String(m)}`} style={{ whiteSpace: "nowrap" }}>
          {part}
        </span>
      ) : (
        part
      ),
    );
    return k ? [<wbr key={id} />, ...parts] : parts;
  });
}
