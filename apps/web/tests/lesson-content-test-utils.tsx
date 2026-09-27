import { renderToStaticMarkup } from "react-dom/server";
import { expect } from "vitest";

export function renderAuthoredLessonContent(
  content: readonly React.ReactNode[],
) {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(
    <div>
      {content.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>,
  );
  return container;
}

export function codeFromBlock(container: HTMLElement, label: string) {
  const block = [...container.querySelectorAll('[role="group"]')].find(
    (element) => element.getAttribute("aria-label") === label,
  );
  expect(block, `Code block: ${label}`).toBeDefined();
  const lines = [...block!.querySelectorAll("pre > code > span")];
  expect(lines.length, `Code lines: ${label}`).toBeGreaterThan(0);
  return lines
    .map(
      (line) =>
        line.lastElementChild?.textContent?.replace(/\u00a0/gu, "") ?? "",
    )
    .join("\n");
}
