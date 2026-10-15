import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CourseNavigation } from "~/widgets/course-navigation";

vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-router")>()),
  Link: ({
    to,
    params,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    to?: string;
    params?: Record<string, string>;
  }) => (
    <a
      {...rest}
      href={Object.entries(params ?? {}).reduce(
        (href, [key, value]) => href.replace(`$${key}`, value),
        to ?? "",
      )}
    />
  ),
}));

vi.mock("~/shared/lib/media-query", () => ({ useMediaQuery: () => false }));

const modules = [
  {
    id: "start",
    title: "Старт",
    lessons: [
      { id: "first", title: "Первый", routeSlug: "first" },
      { id: "second", title: "Второй", routeSlug: "second" },
    ],
  },
];

describe("course lesson rail (Change 186)", () => {
  it("names the course, links back to its overview and checks mastered lessons only", () => {
    const { container } = render(
      <CourseNavigation
        courseId="excel"
        courseRouteSlug="excel"
        courseTitle="Excel с нуля для ЕГЭ"
        courseShortTitle="Excel"
        modules={modules}
        currentLessonId="second"
        masteredLessonIds={new Set(["first"])}
      />,
    );
    expect(
      screen
        .getByRole("link", { name: "Excel с нуля для ЕГЭ" })
        .getAttribute("href"),
    ).toBe("/courses/excel");
    expect(screen.getByText("Excel · урок 1.2")).not.toBeNull();
    const first = screen.getByRole("link", { name: /Первый/ });
    const second = screen.getByRole("link", { name: /Второй/ });
    expect(first.getAttribute("data-done")).toBe("true");
    expect(first.textContent).toContain("урок освоен");
    expect(first.querySelectorAll("svg")).toHaveLength(1);
    expect(second.hasAttribute("data-done")).toBe(false);
    expect(second.querySelector("svg")).toBeNull();
    expect(container.querySelectorAll("[data-tree-folder]")).toHaveLength(1);
  });
});
