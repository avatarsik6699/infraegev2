import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExternalLink } from "~/shared/components/external-link";
import { Image } from "~/shared/components/image";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { render } from "./render";

describe("ExternalLink", () => {
  it("stays in the current tab by default", () => {
    render(<ExternalLink href="https://example.com">Справка</ExternalLink>);
    const link = screen.getByRole("link", { name: "Справка" });
    expect(link.getAttribute("target")).toBeNull();
    expect(link.getAttribute("rel")).toBeNull();
  });

  it("announces and secures an explicitly new tab", () => {
    render(
      <ExternalLink href="https://example.com" newTab>
        Справка
      </ExternalLink>,
    );
    const link = screen.getByRole("link", {
      name: "Справка (откроется в новой вкладке)",
    });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});

describe("Image", () => {
  it("applies loading defaults to informative images", () => {
    render(<Image src="/diagram.png" alt="Диаграмма" />);
    const image = screen.getByRole("img", { name: "Диаграмма" });
    expect(image.getAttribute("loading")).toBe("lazy");
    expect(image.getAttribute("decoding")).toBe("async");
  });

  it("removes decorative images from the accessibility tree", () => {
    const result = render(<Image src="/texture.png" decorative />);
    const image = result.container.querySelector("img");
    expect(image?.getAttribute("alt")).toBe("");
    expect(image?.getAttribute("aria-hidden")).toBe("true");
  });

  it("forwards an explicit fallback source", () => {
    render(
      <Image src="/missing.png" fallbackSrc="/fallback.png" alt="Диаграмма" />,
    );
    const image = screen.getByRole("img", { name: "Диаграмма" });
    fireEvent.error(image);
    expect(image.getAttribute("src")).toBe("/fallback.png");
  });
});

describe("Typography and PageContainer", () => {
  it("preserves semantic heading and main landmarks", () => {
    render(
      <PageContainer>
        <Typography.Title order={2}>Практика</Typography.Title>
        <Typography.Text>Решите задачу</Typography.Text>
      </PageContainer>,
    );
    expect(screen.getByRole("main")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      "Практика",
    );
    expect(screen.getByText("Решите задачу").tagName).toBe("P");
  });
});
