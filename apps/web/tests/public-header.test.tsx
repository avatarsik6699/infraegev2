import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PublicHeader } from "~/widgets/public-header";
import { PublicFooter } from "~/widgets/public-footer";

const accountSession = vi.hoisted(() => ({
  account: null as {
    email: string | null;
    id: string;
    methods: [];
  } | null,
  csrfToken: null as string | null,
  refresh: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  status: "ready" as "loading" | "ready" | "error",
}));

vi.mock("~/features/account", () => ({
  useAccountSession: () => accountSession,
}));

vi.mock(
  "@tanstack/react-router",
  async (importOriginal: <T>() => Promise<T>) => {
    const actual =
      await importOriginal<typeof import("@tanstack/react-router")>();
    return {
      ...actual,
      createLink:
        (Component: React.ComponentType<React.ComponentProps<"a">>) =>
        ({
          children,
          params,
          to,
          ...props
        }: React.ComponentProps<"a"> & {
          to: string;
          params?: { courseSlug?: string };
        }) => (
          <Component
            href={
              params?.courseSlug
                ? to.replace("$courseSlug", params.courseSlug)
                : to
            }
            {...props}
          >
            {children}
          </Component>
        ),
      Link: ({
        children,
        params,
        to,
        ...props
      }: React.ComponentProps<"a"> & {
        to: string;
        params?: { courseSlug?: string };
      }) => (
        <a
          href={
            params?.courseSlug
              ? to.replace("$courseSlug", params.courseSlug)
              : to
          }
          {...props}
        >
          {children}
        </a>
      ),
    };
  },
);

describe("PublicHeader", () => {
  it.each([
    ["loading", null, "Проверяем вход"],
    ["error", null, "Не удалось проверить вход"],
  ] as const)(
    "does not show the guest action while the session is %s",
    (status, account, label) => {
      accountSession.status = status;
      accountSession.account = account;
      render(<PublicHeader />);

      expect(screen.getByText(label)).not.toBeNull();
      expect(screen.queryByRole("link", { name: "Войти" })).toBeNull();
    },
  );

  it("shows signed-in progress navigation and an email initial", () => {
    accountSession.status = "ready";
    accountSession.account = {
      email: "vlad@example.com",
      id: "account-1",
      methods: [],
    };
    render(<PublicHeader />);

    expect(
      screen.getByRole("link", { name: "Мой прогресс" }).getAttribute("href"),
    ).toBe("/account");
    expect(
      screen.getByRole("link", { name: "Открыть профиль" }).textContent,
    ).toBe("V");
    expect(screen.queryByRole("link", { name: "Войти" })).toBeNull();
  });

  it("uses a neutral initial for a provider-only account", () => {
    accountSession.status = "ready";
    accountSession.account = { email: null, id: "account-1", methods: [] };
    render(<PublicHeader />);

    expect(
      screen.getByRole("link", { name: "Открыть профиль" }).textContent,
    ).toBe("П");
  });

  it("renders the infraege identity and honest home navigation", () => {
    accountSession.status = "ready";
    accountSession.account = null;
    const { container } = render(<PublicHeader home />);

    expect(container.querySelector("[data-public-header]")).not.toBeNull();
    expect(container.querySelector("[data-infraege-mark]")).not.toBeNull();
    expect(screen.getByText("infraege", { exact: true })).not.toBeNull();
    expect(
      screen.getByText("подготовка к ЕГЭ по информатике", { exact: true }),
    ).not.toBeNull();
    expect(screen.getByText("просто", { exact: true })).not.toBeNull();
    expect(screen.getByText("понятно", { exact: true })).not.toBeNull();
    expect(screen.getByText("бесплатно", { exact: true })).not.toBeNull();
    expect(
      container.querySelectorAll("[data-infraege-benefits] i"),
    ).toHaveLength(2);
    expect(screen.queryByText("beta", { exact: true })).toBeNull();
    expect(screen.queryByText("v1.0.0", { exact: true })).toBeNull();
    expect(screen.getByLabelText("infraege — ЕГЭ информатика")).not.toBeNull();
    expect(
      screen.getAllByRole("link", { name: "Темы" })[0].getAttribute("href"),
    ).toBe("/ege/");
    expect(
      screen
        .getAllByRole("link", { name: "Мини-курсы" })[0]
        .getAttribute("href"),
    ).toBe("/courses/");
    expect(
      screen
        .getAllByRole("link", { name: "Мини-курсы" })[0]
        .getAttribute("data-hierarchy"),
    ).toBe("text");
    expect(
      screen
        .getAllByRole("link", { name: "Мини-курсы" })[0]
        .querySelector("[data-action-underline]"),
    ).toBeNull();
    expect(screen.queryByText("скоро", { exact: true })).toBeNull();
    expect(container.querySelectorAll('[aria-disabled="true"]')).toHaveLength(
      0,
    );
    expect(
      screen.getAllByRole("link", { name: "Практика" })[0].getAttribute("href"),
    ).toBe("/practice");
    expect(screen.getAllByRole("link", { name: "Войти" })).toHaveLength(1);
    const signInLink = screen.getByRole("link", { name: "Войти" });
    expect(signInLink.getAttribute("data-hierarchy")).toBe("text");
    expect(signInLink.querySelector("svg.lucide-log-in")).not.toBeNull();
    expect(signInLink.querySelector("svg.lucide-arrow-right")).toBeNull();
    expect(signInLink.querySelector("[data-action-underline]")).toBeNull();
    expect(screen.queryByText("Регистрация", { exact: true })).toBeNull();
    expect(screen.queryByRole("link", { name: "Регистрация" })).toBeNull();
  });

  it("keeps only useful navigation in the simplified footer", () => {
    const { container } = render(<PublicFooter />);
    const footer = container.querySelector("footer");

    expect(footer).not.toBeNull();
    expect(footer?.textContent).not.toContain("infraege");
    expect(
      screen
        .getByRole("link", { name: "Обработка данных" })
        .getAttribute("data-hierarchy"),
    ).toBe("text");
    expect(
      screen
        .getByRole("link", { name: "Обработка данных" })
        .querySelector("[data-action-underline]"),
    ).toBeNull();
    const telegramLink = screen.getByRole("link", { name: /Telegram-канал/ });
    expect(telegramLink.getAttribute("data-hierarchy")).toBe("text");
    expect(telegramLink.querySelector("[data-link-underline]")).toBeNull();
    expect(
      telegramLink.querySelector("svg.lucide-arrow-up-right"),
    ).not.toBeNull();
  });

  it("keeps the explicitly compact identity linked to home", () => {
    render(<PublicHeader expanded={false} />);

    expect(
      screen
        .getByRole("link", {
          name: "infraege — ЕГЭ информатика, на главную",
        })
        .getAttribute("href"),
    ).toBe("/");
    expect(
      screen.queryByRole("navigation", { name: "Разделы сайта" }),
    ).toBeNull();
    expect(screen.queryByText("просто", { exact: true })).toBeNull();
  });

  it("keeps expanded navigation on a public section index", () => {
    const { container } = render(<PublicHeader activeSection="topics" />);

    expect(
      screen
        .getByRole("link", {
          name: "infraege — ЕГЭ информатика, на главную",
        })
        .getAttribute("href"),
    ).toBe("/");
    expect(
      screen.getAllByRole("navigation", { name: "Разделы сайта" }),
    ).toHaveLength(2);
    expect(screen.getByText("просто", { exact: true })).not.toBeNull();
    expect(
      screen
        .getAllByRole("link", { name: "Темы" })[0]
        .getAttribute("data-current"),
    ).toBe("true");
    expect(
      container
        .querySelector("[data-public-header]")
        ?.getAttribute("data-expanded"),
    ).toBe("true");
  });
});

describe("repeated footer specimens", () => {
  it("isolates each Telegram paint resource when a footer appears in the lab", () => {
    const { container } = render(
      <>
        <PublicFooter />
        <PublicFooter />
      </>,
    );
    const gradients = [
      ...container.querySelectorAll('linearGradient[id*="telegram"]'),
    ];
    expect(gradients).toHaveLength(2);
    expect(new Set(gradients.map((gradient) => gradient.id)).size).toBe(2);
    for (const gradient of gradients) {
      expect(
        gradient.closest("svg")?.querySelector("circle")?.getAttribute("fill"),
      ).toBe(`url(#${gradient.id})`);
    }
  });
});
