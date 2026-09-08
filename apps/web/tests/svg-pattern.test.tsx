import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SvgPattern } from "~/shared/components/svg-pattern";
import { render } from "./render";

const fade = {
  from: { x: 0, y: 20 },
  to: { x: 120, y: 20 },
  stops: [
    { offset: 0, opacity: 0 },
    { offset: 0.25, opacity: 1 },
    { offset: 1, opacity: 0 },
  ],
} as const;

describe("SvgPattern", () => {
  it("clips a declarative field through a directional fade mask", () => {
    const result = render(
      <svg>
        <SvgPattern.Field
          bounds={{ x: 10, y: 20, width: 120, height: 80 }}
          fade={fade}
          name="notation"
        >
          <text>pattern</text>
        </SvgPattern.Field>
      </svg>,
    );

    const field = result.container.querySelector('[data-svg-pattern="field"]');
    const mask = result.container.querySelector("mask");
    const gradient = result.container.querySelector("linearGradient");
    const stops = [...result.container.querySelectorAll("stop")];

    expect(field?.getAttribute("data-pattern-name")).toBe("notation");
    expect(field?.getAttribute("mask")).toBe(
      `url(#${mask?.getAttribute("id") ?? ""})`,
    );
    expect(mask?.getAttribute("maskUnits")).toBe("userSpaceOnUse");
    expect(mask?.getAttribute("x")).toBe("10");
    expect(mask?.getAttribute("width")).toBe("120");
    expect(gradient?.getAttribute("gradientUnits")).toBe("userSpaceOnUse");
    expect(gradient?.getAttribute("x1")).toBe("0");
    expect(gradient?.getAttribute("x2")).toBe("120");
    expect(stops.map((stop) => stop.getAttribute("stop-opacity"))).toEqual([
      "0",
      "1",
      "0",
    ]);
  });

  it("keeps field mask resources unique in SSR markup", () => {
    const markup = renderToString(
      <svg>
        <SvgPattern.Field
          bounds={{ x: 0, y: 0, width: 120, height: 80 }}
          fade={fade}
        >
          <path d="M0 0h20" />
        </SvgPattern.Field>
        <SvgPattern.Field
          bounds={{ x: 0, y: 100, width: 120, height: 80 }}
          fade={fade}
        >
          <path d="M0 100h20" />
        </SvgPattern.Field>
      </svg>,
    );
    const maskIds = [...markup.matchAll(/id="(svg-pattern-mask-[^"]+)"/g)].map(
      (match) => match[1],
    );

    expect(maskIds).toHaveLength(2);
    expect(new Set(maskIds).size).toBe(2);
    expect(markup).toContain(`mask="url(#${maskIds[0]})"`);
    expect(markup).toContain(`mask="url(#${maskIds[1]})"`);
  });

  it("renders authored primary and echo strokes through SvgDrawing", () => {
    const result = render(
      <svg>
        <SvgPattern.Strokes
          transform="translate(10 12)"
          strokes={[
            {
              id: "branch",
              d: "M0 0c10 2 20-2 30 0",
              strokeWidth: 1.2,
              echoes: [
                {
                  id: "branch-echo",
                  d: "M1 1c9 1 19-2 28 0",
                  strokeWidth: 0.4,
                  opacity: 0.2,
                },
              ],
            },
          ]}
        />
      </svg>,
    );

    const strokes = result.container.querySelector(
      '[data-svg-pattern="strokes"]',
    );
    const lines = result.container.querySelectorAll(
      '[data-svg-drawing="line"]',
    );

    expect(strokes?.getAttribute("transform")).toBe("translate(10 12)");
    expect(lines).toHaveLength(2);
    expect(lines[0]?.getAttribute("stroke-width")).toBe("1.2");
    expect(lines[1]?.getAttribute("opacity")).toBe("0.2");
    expect(lines[1]?.getAttribute("vector-effect")).toBe("non-scaling-stroke");
  });

  it("renders a reusable preset from declarative strokes, labels and nodes", () => {
    const result = render(
      <svg>
        <SvgPattern.Preset
          bounds={{ x: 0, y: 0, width: 120, height: 80 }}
          labels={[{ id: "value", text: "1010", x: 12, y: 18 }]}
          name="binary"
          nodes={[{ id: "bit", cx: 24, cy: 42, r: 2 }]}
          strokes={[{ id: "cell", d: "M0 24H48V56H0Z", strokeWidth: 0.8 }]}
          transform="translate(8 6)"
        />
      </svg>,
    );

    const preset = result.container.querySelector(
      '[data-svg-pattern="preset"]',
    );

    expect(preset?.getAttribute("transform")).toBe("translate(8 6)");
    expect(
      result.container.querySelector('[data-pattern-label="value"]')
        ?.textContent,
    ).toBe("1010");
    expect(
      result.container
        .querySelector('[data-pattern-node="bit"]')
        ?.getAttribute("r"),
    ).toBe("2");
    expect(
      result.container.querySelectorAll('[data-svg-drawing="line"]'),
    ).toHaveLength(1);
  });

  it("does not allocate mask resources for a solid field", () => {
    const result = render(
      <svg>
        <SvgPattern.Field bounds={{ x: 0, y: 0, width: 10, height: 10 }}>
          <circle cx="5" cy="5" r="2" />
        </SvgPattern.Field>
      </svg>,
    );

    expect(result.container.querySelector("mask")).toBeNull();
    expect(result.container.querySelector("linearGradient")).toBeNull();
    expect(
      result.container
        .querySelector('[data-svg-pattern="field"]')
        ?.getAttribute("mask"),
    ).toBeNull();
  });
  it("keeps grid resources isolated across multiple SSR instances", () => {
    const markup = renderToString(
      <svg>
        <SvgPattern.Grid
          bounds={{ x: 0, y: 0, width: "100%", height: "100%" }}
          cell={{ width: 84, height: 84 }}
          transform="skewY(-18)"
          node={{ radius: 1.5 }}
        />
        <SvgPattern.Grid
          bounds={{ x: 0, y: 0, width: 640, height: 360 }}
          cell={{ width: 64, height: 64 }}
          fade={fade}
        />
      </svg>,
    );
    const document = new DOMParser().parseFromString(markup, "text/html");
    const ids = [...document.querySelectorAll("[id]")].map(
      (element) => element.id,
    );
    expect(ids.length).toBe(4);
    expect(new Set(ids).size).toBe(ids.length);
    for (const match of markup.matchAll(/url\(#([^)]*)\)/g)) {
      expect(document.getElementById(match[1])).not.toBeNull();
    }
    expect(
      document.querySelector("pattern")?.getAttribute("patternTransform"),
    ).toBe("skewY(-18)");
    expect(document.querySelector("pattern circle")?.getAttribute("r")).toBe(
      "1.5",
    );
    expect(document.querySelector('rect[width="100%"]')).not.toBeNull();
  });
});
