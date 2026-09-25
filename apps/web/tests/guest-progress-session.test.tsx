import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CourseCatalogProgress } from "~/pages/course-catalog/components/course-catalog-progress";
import { CourseOverviewProgress } from "~/pages/course-overview/components/course-overview-progress";
import { TopicCatalogProgress } from "~/pages/topic-catalog/components/topic-catalog-progress";

const sessionFixture = vi.hoisted(() => ({
  status: "loading" as "loading" | "ready" | "error",
}));

vi.mock("~/features/account", () => ({
  useAccountSession: () => ({
    account: null,
    csrfToken: null,
    status: sessionFixture.status,
  }),
}));

vi.mock(
  "@tanstack/react-router",
  async (
    importOriginal: () => Promise<typeof import("@tanstack/react-router")>,
  ) => {
    const actual = await importOriginal();
    return {
      ...actual,
      useRouterState: () => "/courses/python",
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

describe("guest progress session boundary", () => {
  it("uses one locked zero-progress invitation for every catalog consumer", () => {
    sessionFixture.status = "ready";
    const courseOverview = render(
      <CourseOverviewProgress
        guestTotal={5}
        progress={{ status: "ready", solved: 3, total: 5, mastered: false }}
      />,
    );
    expect(screen.getByText("0 из 5")).not.toBeNull();
    expect(
      screen
        .getByRole("link", {
          name: "Прогресс: 0 из 5. Войти, чтобы сохранять прогресс",
        })
        .getAttribute("href"),
    ).toBe("/sign-in?returnTo=/courses/python");
    courseOverview.unmount();

    const courseCatalog = render(
      <CourseCatalogProgress
        progress={{ status: "ready", mastered: 3, total: 5 }}
        title="Python"
        total={5}
      />,
    );
    expect(screen.getByText("Освоено 0 из 5 уроков")).not.toBeNull();
    expect(screen.getAllByText("Войти, чтобы сохранять прогресс")).toHaveLength(
      1,
    );
    courseCatalog.unmount();

    render(
      <TopicCatalogProgress
        loadState="ready"
        progress={{ solved: 3, total: 5 }}
        title="Рекурсия"
      />,
    );
    expect(screen.getByText("Решено 0 из 5")).not.toBeNull();
    expect(screen.getAllByText("Войти, чтобы сохранять прогресс")).toHaveLength(
      1,
    );
  });

  it.each(["loading", "error"] as const)(
    "does not turn unresolved %s session into a guest zero",
    (status) => {
      sessionFixture.status = status;
      const courseOverview = render(
        <CourseOverviewProgress
          guestTotal={5}
          progress={{ status: "ready", solved: 3, total: 5, mastered: false }}
        />,
      );
      expect(screen.getByText("3 из 5")).not.toBeNull();
      expect(screen.queryByRole("link", { name: "Войти" })).toBeNull();
      courseOverview.unmount();

      const courseCatalog = render(
        <CourseCatalogProgress
          progress={{ status: "ready", mastered: 3, total: 5 }}
          title="Python"
          total={5}
        />,
      );
      expect(screen.getByText("Освоено 3 из 5 уроков")).not.toBeNull();
      expect(
        screen.queryByRole("link", { name: "Войти, чтобы сохранять" }),
      ).toBeNull();
      courseCatalog.unmount();

      render(
        <TopicCatalogProgress
          loadState="ready"
          progress={{ solved: 3, total: 5 }}
          title="Рекурсия"
        />,
      );
      expect(screen.getByText("Решено 3 из 5")).not.toBeNull();
      expect(
        screen.queryByRole("link", { name: "Войти, чтобы сохранять" }),
      ).toBeNull();
    },
  );
});
