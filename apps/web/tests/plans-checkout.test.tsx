import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AccessTypes } from "~/entities/access";
import type { BillingTypes } from "~/entities/billing";
import { AccountAccess } from "~/pages/account/components/account-access";
import { CheckoutPage } from "~/pages/checkout/checkout-page";
import { PricingPage } from "~/pages/pricing/pricing-page";

const session = vi.hoisted(() => ({
  account: null as {
    id: string;
    email: string | null;
    methods: { provider: string; subject_hint: null }[];
    recent_auth_until: string;
  } | null,
  csrfToken: "csrf",
  status: "ready" as const,
  refresh: () => Promise.resolve(),
}));

vi.mock("~/features/account", () => ({ useAccountSession: () => session }));
vi.mock("~/widgets/public-header", () => ({ PublicHeader: () => null }));
vi.mock("~/widgets/public-footer", () => ({ PublicFooter: () => null }));
vi.mock("~/shared/components/mascot-scene", () => ({
  MascotScene: () => null,
}));
vi.mock("~/shared/components/action-link", () => ({
  ActionLink: (props: { children?: React.ReactNode; to: string }) => (
    <a href={props.to}>{props.children}</a>
  ),
}));
vi.mock(
  "@tanstack/react-router",
  async (
    importOriginal: () => Promise<typeof import("@tanstack/react-router")>,
  ) => ({
    ...(await importOriginal()),
    useRouterState: () => "/subscribe?plan=month",
  }),
);
vi.mock("~/entities/billing", async (importOriginal) => {
  const actual = await importOriginal<typeof import("~/entities/billing")>();
  return {
    ...actual,
    billingApi: { ...actual.billingApi, payments: () => Promise.resolve([]) },
  };
});

const offer: BillingTypes.Offer = {
  billing: true,
  paywall: true,
  offerVersion: "2026-10-26",
  plans: [
    {
      id: "month",
      title: "Месяц",
      priceKopecks: 49000,
      days: 30,
      monthlyEquivalentKopecks: 49000,
      monthsPriceKopecks: 49000,
    },
    {
      id: "year",
      title: "Год",
      priceKopecks: 299000,
      days: 365,
      monthlyEquivalentKopecks: 24917,
      monthsPriceKopecks: 588000,
    },
  ],
};

const guestAccess: AccessTypes.State = {
  status: "ready",
  paywall: true,
  signedIn: false,
  granted: false,
  until: null,
  restriction: null,
};

afterEach(cleanup);

describe("plans and checkout (Change 228)", () => {
  it("states each plan's standing in its subtitle, not as a badge", () => {
    const { container } = render(
      <PricingPage offer={offer} access={guestAccess} />,
    );
    const year = within(
      container.querySelector<HTMLElement>('[data-plan="year"]')!,
    );
    expect(screen.getByText("Ваш план сейчас ·")).toBeTruthy();
    expect(screen.getByText("Для начала ·")).toBeTruthy();
    expect(year.getByText("Выгоднее ·")).toBeTruthy();
    expect(year.getByText("≈ 249 ₽ в месяц")).toBeTruthy();
    // no crossed-out twelve months, no saving percent, no note about them
    expect(container.querySelector("s")).toBeNull();
    expect(container.textContent).not.toMatch(/−\d+%|Зачёркнута|5 880/u);
    expect(screen.queryByRole("link", { name: "Условия возврата" })).toBeNull();
  });

  it("says whose access it is and where the receipt goes", () => {
    session.account = {
      id: "a",
      email: null,
      methods: [
        { provider: "vk", subject_hint: null },
        { provider: "yandex", subject_hint: null },
      ],
      recent_auth_until: "2999-01-01T00:00:00Z",
    };
    const { container, unmount } = render(
      <CheckoutPage offer={offer} access={guestAccess} plan="month" />,
    );
    const block = container.querySelector("[data-checkout-account]");
    expect(block?.textContent).toContain(
      "Доступ откроется для вашего аккаунта",
    );
    expect(block?.textContent).toContain(
      "Войти в него можно: VK ID и Яндекс ID.",
    );
    expect(block?.textContent).toContain(
      "Чек придёт на почту, которую вы укажете на странице оплаты.",
    );
    // the same neutral initial as the header avatar
    expect(block?.querySelector("[data-profile-avatar]")?.textContent).toBe(
      "П",
    );
    unmount();

    session.account = {
      id: "b",
      email: "member@example.test",
      methods: [
        { provider: "email", subject_hint: null },
        { provider: "vk", subject_hint: null },
      ],
      recent_auth_until: "2999-01-01T00:00:00Z",
    };
    const member = render(
      <CheckoutPage offer={offer} access={guestAccess} plan="year" />,
    );
    const own = member.container.querySelector("[data-checkout-account]");
    expect(own?.textContent).toContain(
      "Доступ откроется для аккаунта member@example.test",
    );
    expect(own?.textContent).toContain("почта и пароль и VK ID");
    expect(own?.textContent).toContain("Чек придёт на этот адрес.");
    expect(own?.querySelector("[data-profile-avatar]")?.textContent).toBe("M");
  });

  it("keeps the refund rules out of the access tab", () => {
    render(<AccountAccess access={{ ...guestAccess, signedIn: true }} />);
    expect(screen.queryByText(/по правилам возврата/u)).toBeNull();
  });
});
