import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AccountProfile } from "~/pages/account/account-profile";
import type { AccountProfileTypes } from "~/pages/account/account-profile.types";

type Method = { provider: string; subject_hint: null };

const fixture = vi.hoisted(() => ({
  session: {
    account: null as {
      id: string;
      email: string | null;
      methods: Method[];
      recent_auth_until: string;
    } | null,
    csrfToken: "csrf" as string | null,
    status: "ready" as const,
    refresh: vi.fn<() => Promise<void>>(),
  },
  api: {
    linkProvider: vi.fn<() => Promise<string>>(),
    unlinkProvider: vi.fn<() => Promise<void>>(),
    reauthenticateProvider: vi.fn<() => Promise<string>>(),
    reauthenticate: vi.fn<() => Promise<void>>(),
    deleteAccount: vi.fn<() => Promise<void>>(),
    logout: vi.fn<() => Promise<void>>(),
    sessions: vi.fn<() => Promise<[]>>(),
    addEmailMethod: vi.fn<() => Promise<void>>(),
  },
  navigate: vi.fn<() => Promise<void>>(),
  leave: vi.fn<(url: string) => void>(),
}));

vi.mock("~/features/account", () => ({
  useAccountSession: () => fixture.session,
  accountApi: fixture.api,
}));
vi.mock("~/shared/lib/auth-provider-navigation", () => ({
  authProviderNavigation: { leave: fixture.leave },
}));
vi.mock("~/pages/account/components/account-overview", () => ({
  AccountOverview: () => null,
}));
vi.mock(
  "@tanstack/react-router",
  async (
    importOriginal: () => Promise<typeof import("@tanstack/react-router")>,
  ) => ({
    ...(await importOriginal()),
    useNavigate: () => fixture.navigate,
    createLink:
      (Component: React.ComponentType<React.ComponentProps<"a">>) =>
      ({
        children,
        to,
        ...props
      }: React.ComponentProps<"a"> & { to: string }) => (
        <Component href={to} {...props}>
          {children}
        </Component>
      ),
  }),
);

const FUTURE = "2999-01-01T00:00:00Z";
const PAST = "2000-01-01T00:00:00Z";

function signedIn(providers: string[], recentAuthUntil: string) {
  fixture.session.account = {
    id: "account-1",
    email: providers.includes("email") ? "member@example.test" : null,
    methods: providers.map((provider) => ({ provider, subject_hint: null })),
    recent_auth_until: recentAuthUntil,
  };
}

function profile(props: Partial<AccountProfileTypes.Props> = {}) {
  return render(
    <AccountProfile
      practiceSummary={null}
      topicSummary={null}
      enabledProviders={["vk", "yandex"]}
      tab="settings"
      {...props}
    />,
  );
}

describe("sign-in confirmation (Change 227)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fixture.session.refresh.mockResolvedValue(undefined);
    fixture.api.sessions.mockResolvedValue([]);
    fixture.api.linkProvider.mockResolvedValue(
      "/api/auth/fake-provider/yandex",
    );
    fixture.api.reauthenticateProvider.mockResolvedValue(
      "/api/auth/fake-provider/vk",
    );
    fixture.navigate.mockResolvedValue(undefined);
  });

  it("asks only when the ten minutes have passed, never with a standing button", async () => {
    signedIn(["vk"], FUTURE);
    const { unmount } = profile();
    expect(
      screen.queryByRole("button", { name: "Подтвердить вход" }),
    ).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Добавить" }));
    await waitFor(() => expect(fixture.api.linkProvider).toHaveBeenCalled());
    expect(fixture.leave).toHaveBeenCalledWith(
      "/api/auth/fake-provider/yandex",
    );
    unmount();

    signedIn(["vk"], PAST);
    profile();
    fireEvent.click(screen.getByRole("button", { name: "Добавить" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.textContent).toContain("Подтвердите, что это вы");
    expect(dialog.textContent).toContain(
      "Чтобы добавить Яндекс ID, войдите ещё раз через VK ID.",
    );
    expect(fixture.api.linkProvider).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "VK ID" }));
    await waitFor(() =>
      expect(fixture.api.reauthenticateProvider).toHaveBeenCalledWith(
        "vk",
        "csrf",
        "link:yandex",
      ),
    );
    expect(fixture.leave).toHaveBeenLastCalledWith(
      "/api/auth/fake-provider/vk",
    );
  });

  it("confirms with the password in place and reopens the removal", async () => {
    signedIn(["email", "vk"], PAST);
    fixture.api.reauthenticate.mockImplementation(() => {
      signedIn(["email", "vk"], FUTURE);
      return Promise.resolve();
    });
    profile();
    fireEvent.click(screen.getByRole("button", { name: "Отвязать VK ID" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.textContent).toContain(
      "введите пароль или войдите через VK ID",
    );
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "correct horse battery" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Подтвердить" }));
    await waitFor(() =>
      expect(fixture.api.reauthenticate).toHaveBeenCalledWith(
        "correct horse battery",
        "csrf",
      ),
    );
    const removal = await screen.findByRole("alertdialog");
    expect(removal.textContent).toContain("Отвязать VK ID?");
  });

  it("resumes the action a provider confirmed and cleans the address", async () => {
    signedIn(["vk", "yandex"], FUTURE);
    profile({ resume: "unlink:yandex" });
    const removal = await screen.findByRole("alertdialog");
    expect(removal.textContent).toContain("Отвязать Яндекс ID?");
    expect(fixture.navigate).toHaveBeenCalledWith({
      to: "/account",
      search: { tab: "settings" },
      replace: true,
    });
  });

  it("explains a return that changed nothing", () => {
    signedIn(["vk"], FUTURE);
    profile({ authError: "already_linked" });
    expect(screen.getByRole("alert").textContent).toBe(
      "К аккаунту уже привязан другой аккаунт этого сервиса. Чтобы заменить его, сначала отвяжите прежний.",
    );
  });

  it("warns that deletion ends paid access and refunds the unused days", async () => {
    signedIn(["vk"], FUTURE);
    profile({
      billing: {
        access: {
          status: "ready",
          paywall: true,
          signedIn: true,
          granted: true,
          until: "2026-11-25T10:00:00Z",
          restriction: null,
        } as never,
      },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Удалить аккаунт и прогресс" }),
    );
    const dialog = await screen.findByRole("alertdialog");
    expect(dialog.textContent).toContain("Оплаченный доступ до");
    expect(dialog.textContent).toContain(
      "деньги за неиспользованные полные дни вернутся на карту",
    );
  });
});
