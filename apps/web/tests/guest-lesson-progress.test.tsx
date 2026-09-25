import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GuestLessonProgress } from "~/features/lesson-progress";

vi.mock(
  "@tanstack/react-router",
  async (
    importOriginal: () => Promise<typeof import("@tanstack/react-router")>,
  ) => {
    const actual = await importOriginal();
    return {
      ...actual,
      useRouterState: () => "/ege/graphs",
      createLink:
        (Component: React.ComponentType<React.ComponentProps<"a">>) =>
        ({
          children,
          to,
          search,
          ...props
        }: React.ComponentProps<"a"> & {
          to: string;
          search?: { returnTo: string };
        }) => (
          <Component
            href={search ? `${to}?returnTo=${search.returnTo}` : to}
            {...props}
          >
            {children}
          </Component>
        ),
    };
  },
);

describe("GuestLessonProgress", () => {
  it("shows a zero-of-total scale and an accessible sign-in lock", () => {
    const view = render(
      <GuestLessonProgress
        headingId="guest-progress"
        masteryThreshold={0.8}
        total={5}
      />,
    );

    expect(screen.getByText("0 / 5")).not.toBeNull();
    expect(
      view.container
        .querySelector('[role="progressbar"]')
        ?.getAttribute("aria-valuenow"),
    ).toBe("0");
    const signIn = screen.getByRole("link", {
      name: "Прогресс: 0 из 5. Войти, чтобы сохранять прогресс",
    });
    expect(signIn.getAttribute("href")).toBe("/sign-in?returnTo=/ege/graphs");
    expect(signIn.getAttribute("title")).toBeNull();
    signIn.focus();
    fireEvent.focus(signIn);
    expect(document.activeElement).toBe(signIn);
  });
});
