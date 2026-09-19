import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "~/shared/components/button";
import { ExternalLink } from "~/shared/components/external-link";
import { FragmentLink } from "~/shared/components/fragment-link";
import { DownloadLink } from "~/shared/components/download-link";
import { PracticeTheory } from "~/widgets/practice-task/components/practice-theory";

vi.mock("~/shared/components/action-link", () => ({
  ActionLink: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("action semantics", () => {
  it("keeps a loading action named and prevents duplicate activation", () => {
    const click = vi.fn();
    const view = render(<Button onClick={click}>Проверить</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
    view.rerender(
      <Button onClick={click} loading>
        Проверить
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Проверить" });
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect((button as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(button);
    expect(click).toHaveBeenCalledTimes(1);
  });
  it("preserves navigation semantics, destinations and new-tab announcements", () => {
    render(
      <>
        <ExternalLink href="https://example.com" newTab>
          Источник
        </ExternalLink>
        <FragmentLink hash="answer">К ответу</FragmentLink>
        <DownloadLink href="/task.txt">Файл</DownloadLink>
      </>,
    );
    const external = screen.getByRole("link", {
      name: /Источник.*новой вкладке/,
    });
    expect(external.getAttribute("target")).toBe("_blank");
    expect(external.getAttribute("rel")).toBe("noopener noreferrer");
    expect(
      screen.getByRole("link", { name: "К ответу" }).getAttribute("href"),
    ).toBe("#answer");
    expect(
      screen.getByRole("link", { name: "Файл" }).hasAttribute("download"),
    ).toBe(true);
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("shows no theory placeholder and preserves all destinations for multiple materials", () => {
    const view = render(<PracticeTheory links={[]} />);
    expect(screen.queryByRole("navigation")).toBeNull();
    view.rerender(
      <PracticeTheory
        links={[
          { href: "/ege/5", label: "Алгоритмы" },
          { href: "/ege/16", label: "Рекурсия" },
        ]}
      />,
    );
    const disclosure = screen.getByText("Теория");
    fireEvent.click(disclosure);
    expect(
      screen.getByRole("link", { name: "Алгоритмы" }).getAttribute("href"),
    ).toBe("/ege/5");
    expect(
      screen.getByRole("link", { name: "Рекурсия" }).getAttribute("href"),
    ).toBe("/ege/16");
  });
});
