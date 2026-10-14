import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PythonTerm } from "~/entities/lesson/content/python-term";

vi.mock("~/shared/components/action-link", () => ({
  ActionLink: (props: {
    children: React.ReactNode;
    params: { courseSlug: string; lessonSlug: string };
  }) => (
    <a href={`/courses/${props.params.courseSlug}/${props.params.lessonSlug}`}>
      {props.children}
    </a>
  ),
}));

// Topic lessons explain course basics with a term popover (Changes 171, 184).
describe("PythonTerm", () => {
  it("links a Python term to the Python course lesson", () => {
    const html = renderToStaticMarkup(
      <PythonTerm term="list">списком</PythonTerm>,
    );
    expect(html).toContain("Курс Python: ");
    expect(html).toMatch(/href="\/courses\/python\/[\w-]+"/u);
  });

  it("links a spreadsheet term to the Excel course lesson", () => {
    const html = renderToStaticMarkup(
      <PythonTerm term="xl-wildcard">шаблон</PythonTerm>,
    );
    expect(html).toContain("Курс Excel: ");
    expect(html).toContain('href="/courses/excel/');
  });
});
