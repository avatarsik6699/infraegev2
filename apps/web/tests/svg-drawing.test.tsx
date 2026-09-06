import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SvgDrawing } from "~/shared/components/svg-drawing";
import { render } from "./render";

const fade = {
  from: { x: 0, y: 4 },
  to: { x: 100, y: 4 },
  stops: [
    { offset: 0, opacity: 0 },
    { offset: 0.2, opacity: 1 },
    { offset: 1, opacity: 0.4 },
  ],
} as const;

describe("SvgDrawing", () => {
  it("renders a fading non-scaling line from declarative geometry", () => {
    const result = render(
      <svg>
        <SvgDrawing.Line
          d="M0 4h100"
          fade={fade}
          strokeWidth={1.5}
          pathLength={100}
          dashArray="12 5"
        />
      </svg>,
    );

    const gradient = result.container.querySelector("linearGradient");
    const path = result.container.querySelector('[data-svg-drawing="line"]');
    const stops = [...result.container.querySelectorAll("stop")];

    expect(gradient?.getAttribute("gradientUnits")).toBe("userSpaceOnUse");
    expect(gradient?.getAttribute("x1")).toBe("0");
    expect(gradient?.getAttribute("x2")).toBe("100");
    expect(stops.map((stop) => stop.getAttribute("stop-opacity"))).toEqual([
      "0",
      "1",
      "0.4",
    ]);
    expect(path?.getAttribute("stroke")).toBe(
      `url(#${gradient?.getAttribute("id") ?? ""})`,
    );
    expect(path?.getAttribute("stroke-linecap")).toBe("round");
    expect(path?.getAttribute("stroke-linejoin")).toBe("round");
    expect(path?.getAttribute("vector-effect")).toBe("non-scaling-stroke");
    expect(path?.getAttribute("stroke-dasharray")).toBe("12 5");
    expect(path?.getAttribute("pathLength")).toBe("100");
  });

  it("keeps generated gradient resources unique in SSR markup", () => {
    const markup = renderToString(
      <svg>
        <SvgDrawing.Line d="M0 0h10" fade={fade} strokeWidth={1} />
        <SvgDrawing.Line d="M0 2h10" fade={fade} strokeWidth={1} />
      </svg>,
    );
    const ids = [...markup.matchAll(/id="(svg-drawing-line-[^"]+)"/g)].map(
      (match) => match[1],
    );

    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    expect(markup).toContain(`stroke="url(#${ids[0]})"`);
    expect(markup).toContain(`stroke="url(#${ids[1]})"`);
  });

  it("avoids gradient resources for a solid line", () => {
    const result = render(
      <svg>
        <SvgDrawing.Line d="M0 0h10" strokeWidth={2} />
      </svg>,
    );

    expect(result.container.querySelector("linearGradient")).toBeNull();
    expect(
      result.container
        .querySelector('[data-svg-drawing="line"]')
        ?.getAttribute("stroke"),
    ).toBe("currentColor");
  });

  it("composes a tapered arrow shaft, echoes and a solid head", () => {
    const result = render(
      <svg>
        <SvgDrawing.Arrow
          shaft={{
            kind: "tapered",
            d: "M0 4 80 3 80 5Z",
            fade,
          }}
          echoes={[
            {
              id: "echo",
              d: "M10 6h60",
              strokeWidth: 0.5,
              opacity: 0.3,
            },
          ]}
          head={{ d: "m72 0 8 4-8 4", strokeWidth: 1.5 }}
        />
      </svg>,
    );

    const arrow = result.container.querySelector('[data-svg-drawing="arrow"]');
    const shaft = result.container.querySelector(
      '[data-svg-drawing="tapered-line"]',
    );
    const lines = result.container.querySelectorAll(
      '[data-svg-drawing="line"]',
    );

    expect(arrow).not.toBeNull();
    expect(shaft?.getAttribute("fill")).toMatch(/^url\(#svg-drawing-/);
    expect(lines).toHaveLength(2);
    expect(lines[1]?.getAttribute("stroke")).toBe("currentColor");
  });
});
