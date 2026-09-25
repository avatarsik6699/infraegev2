import { expect, type Page } from "@playwright/test";

const member = {
  id: "test-account-one",
  email: "member@example.test",
  methods: [{ provider: "email", subject_hint: null }],
};

export class AccountPage {
  constructor(private readonly page: Page) {}

  async expectGuestSignIn(): Promise<void> {
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.page.goto("/sign-in");
    await expect(this.page.locator("[data-public-header]")).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Вернуться к обучению" }),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("heading", { name: "Войти" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("textbox", { name: "Электронная почта" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("textbox", { name: "Пароль" }),
    ).toBeVisible();
    for (const provider of ["VK ID", "Яндекс ID", "Telegram"]) {
      await expect(
        this.page.getByRole("button", { name: provider, exact: true }),
      ).toBeDisabled();
    }
    await this.expectEnhancedForm();
    const password = this.page.getByRole("textbox", { name: "Пароль" });
    await expect(password).toHaveAttribute("type", "password");
    await this.page.getByRole("button", { name: "Показать пароль" }).focus();
    await this.page.keyboard.press("Enter");
    await expect(password).toHaveAttribute("type", "text");
    await expect(
      this.page.getByRole("button", { name: "Скрыть пароль" }),
    ).toBeVisible();
    await this.page.getByRole("button", { name: "Скрыть пароль" }).click();
    await expect(password).toHaveAttribute("type", "password");
    await expect(this.page.locator('script[src*="track.js"]')).toHaveCount(0);
    const width = await this.page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(width.content).toBeLessThanOrEqual(width.viewport);
  }

  async expectAuthSpacingAndRefreshCooldown(): Promise<void> {
    const hydrationErrors: string[] = [];
    this.page.on("console", (message) => {
      if (message.type() === "error" && message.text().includes("hydrated"))
        hydrationErrors.push(message.text());
    });
    await this.page.setViewportSize({ width: 1440, height: 900 });
    await this.page.goto("/register");
    await this.expectEnhancedForm();
    expect(hydrationErrors).toEqual([]);
    const header = await this.page.locator("header").first().boundingBox();
    const heading = await this.page
      .getByRole("heading", { name: "Создать аккаунт" })
      .boundingBox();
    expect(header).not.toBeNull();
    expect(heading).not.toBeNull();
    expect(
      (heading?.y ?? 0) - ((header?.y ?? 0) + (header?.height ?? 0)),
    ).toBeGreaterThan(32);
    await expect(
      this.page.getByText("Для отправки формы нужен JavaScript."),
    ).toBeHidden();
    const consent = this.page.getByRole("checkbox", {
      name: /Даю согласие на обработку персональных данных/,
    });
    await expect(consent).not.toBeChecked();
    await expect(
      this.page.getByRole("link", {
        name: "согласие на обработку персональных данных",
      }),
    ).toHaveAttribute("href", "/consent");

    let requests = 0;
    await this.page.route(
      "**/api/auth/password-reset/request",
      async (route) => {
        requests += 1;
        await route.fulfill({ status: 202, json: {} });
      },
    );
    await this.page.goto("/password-reset");
    await this.expectEnhancedForm();
    await this.page
      .getByRole("textbox", { name: "Электронная почта" })
      .fill("learner@example.test");
    await this.page.getByRole("button", { name: "Отправить ссылку" }).click();
    await expect(
      this.page.getByRole("heading", {
        name: "Проверьте письмо для восстановления",
      }),
    ).toBeVisible();
    expect(requests).toBe(1);
    await this.page.reload();
    await this.expectEnhancedForm();
    await expect(
      this.page.getByRole("button", { name: /Повторить через \d+ с/ }),
    ).toBeDisabled();
    expect(requests).toBe(1);
  }

  async expectVerificationLink(): Promise<void> {
    let submittedToken = "";
    await this.page.route("**/api/auth/verify-email", async (route) => {
      const body = route.request().postDataJSON() as { token: string };
      submittedToken = body.token;
      await route.fulfill({ status: 204 });
    });
    await this.page.goto(
      "/verify-email?token=abcdefghijklmnopqrstuvwxyz012345",
    );
    await expect(this.page.locator("main").getByRole("status")).toContainText(
      "Почта подтверждена",
    );
    expect(submittedToken).toBe("abcdefghijklmnopqrstuvwxyz012345");
    await expect(this.page.locator('script[src*="track.js"]')).toHaveCount(0);
  }

  async expectTokenlessVerificationReturnsToRegistration(): Promise<void> {
    await this.page.goto("/verify-email");
    await expect(this.page).toHaveURL("/register");
    await expect(
      this.page.getByRole("heading", { name: "Создать аккаунт" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Отправить письмо" }),
    ).toHaveCount(0);
  }

  async expectRecoverableEmailJourneys(): Promise<void> {
    let registrations = 0;
    await this.page.route("**/api/auth/register", (route) => {
      registrations += 1;
      return route.fulfill({ status: 202, json: {} });
    });
    await this.page.goto("/register");
    await this.expectEnhancedForm();
    await this.page
      .getByRole("textbox", { name: "Электронная почта" })
      .fill("learner@example.test");
    await this.page
      .getByRole("textbox", { name: "Пароль" })
      .fill("correct horse battery");
    await this.page.getByRole("button", { name: "Создать аккаунт" }).click();
    await expect(
      this.page.getByRole("heading", { name: "Создать аккаунт" }),
    ).toBeVisible();
    expect(registrations).toBe(0);
    await this.page.getByRole("checkbox", { name: /Даю согласие/ }).check();
    await this.page.getByRole("button", { name: "Создать аккаунт" }).click();
    await expect(
      this.page.getByRole("heading", {
        name: "Проверьте письмо для подтверждения",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", {
        name: "Отправить ещё раз через 60 с",
      }),
    ).toBeDisabled();
    await expect(
      this.page.getByRole("button", { name: "Указать другой адрес" }),
    ).toBeVisible();

    await this.page.route("**/api/auth/verify-email", (route) =>
      route.fulfill({ status: 400, json: { detail: "invalid" } }),
    );
    await this.page.goto("/verify-email?token=invalid-token");
    await expect(this.page.getByRole("alert")).toContainText(
      "Ссылка недействительна или устарела",
    );
    await expect(
      this.page.getByRole("link", { name: "Начать регистрацию заново" }),
    ).toBeVisible();

    await this.page.route("**/api/auth/password-reset/request", (route) =>
      route.fulfill({ status: 503, json: { detail: "unavailable" } }),
    );
    await this.page.goto("/password-reset");
    await this.expectEnhancedForm();
    await this.page
      .getByRole("textbox", { name: "Электронная почта" })
      .fill("learner@example.test");
    await this.page.getByRole("button", { name: "Отправить ссылку" }).click();
    await expect(this.page.getByRole("alert")).toContainText(
      "Почта временно недоступна",
    );

    await this.page.route("**/api/auth/password-reset/confirm", (route) =>
      route.fulfill({ status: 204 }),
    );
    await this.page.goto("/password-reset?token=valid-token");
    await this.expectEnhancedForm();
    await this.page
      .getByRole("textbox", { name: "Пароль" })
      .fill("a new secure password");
    await this.page.getByRole("button", { name: "Сохранить пароль" }).click();
    await expect(this.page).toHaveURL(/\/sign-in/);
    await expect(
      this.page.getByRole("heading", { name: "Войти" }),
    ).toBeVisible();

    await this.page.unroute("**/api/auth/password-reset/confirm");
    await this.page.route("**/api/auth/password-reset/confirm", (route) =>
      route.fulfill({ status: 400, json: { detail: "expired" } }),
    );
    await this.page.goto("/password-reset?token=expired-token");
    await this.expectEnhancedForm();
    await this.page
      .getByRole("textbox", { name: "Пароль" })
      .fill("a new secure password");
    await this.page.getByRole("button", { name: "Сохранить пароль" }).click();
    await expect(this.page.getByRole("alert")).toContainText(
      "Ссылка недействительна или устарела",
    );
    await expect(
      this.page.getByRole("button", { name: "Отправить ссылку" }),
    ).toBeVisible();
    await this.page.unroute("**/api/auth/password-reset/request");
    await this.page.route("**/api/auth/password-reset/request", (route) =>
      route.fulfill({ status: 202, json: {} }),
    );
    await this.page
      .getByRole("textbox", { name: "Электронная почта" })
      .fill("learner@example.test");
    await this.page.getByRole("button", { name: "Отправить ссылку" }).click();
    await expect(
      this.page.getByRole("heading", {
        name: "Проверьте письмо для восстановления",
      }),
    ).toBeVisible();

    await this.page.route("**/api/auth/login", (route) =>
      route.fulfill({ status: 401, json: { detail: "invalid" } }),
    );
    await this.page.goto("/sign-in");
    await this.expectEnhancedForm();
    await this.page
      .getByRole("textbox", { name: "Электронная почта" })
      .fill("learner@example.test");
    await this.page
      .getByRole("textbox", { name: "Пароль" })
      .fill("wrong password");
    await this.page.getByRole("button", { name: "Войти", exact: true }).click();
    await expect(this.page.getByRole("alert")).toContainText(
      "Не удалось войти",
    );
    await expect(
      this.page.getByRole("link", { name: "Создать аккаунт" }),
    ).toBeVisible();
  }

  async expectResendCooldownAndFailures(): Promise<void> {
    await this.page.clock.install({ time: new Date("2026-09-25T09:00:00Z") });
    for (const purpose of ["verification", "recovery"] as const) {
      const endpoint =
        purpose === "verification"
          ? "**/api/auth/verification/request"
          : "**/api/auth/password-reset/request";
      let requests = 0;
      await this.page.route(endpoint, async (route) => {
        requests += 1;
        await route.fulfill(
          requests === 3
            ? { status: 503, json: { detail: "unavailable" } }
            : { status: 202, json: {} },
        );
      });
      if (purpose === "verification") {
        await this.page.route("**/api/auth/register", (route) =>
          route.fulfill({ status: 202, json: {} }),
        );
      }
      await this.page.goto(
        purpose === "verification" ? "/register" : "/password-reset",
      );
      await this.expectEnhancedForm();
      await this.page
        .getByRole("textbox", { name: "Электронная почта" })
        .fill("learner@example.test");
      if (purpose === "verification") {
        await this.page
          .getByRole("textbox", { name: "Пароль" })
          .fill("correct horse battery");
        await this.page.getByRole("checkbox", { name: /Даю согласие/ }).check();
      }
      await this.page
        .getByRole("button", {
          name:
            purpose === "verification" ? "Создать аккаунт" : "Отправить ссылку",
        })
        .click();
      await this.page.clock.runFor(1000);
      expect(requests).toBe(purpose === "verification" ? 0 : 1);
      await expect(
        this.page.getByRole("heading", {
          name:
            purpose === "verification"
              ? "Проверьте письмо для подтверждения"
              : "Проверьте письмо для восстановления",
        }),
      ).toBeVisible();
      await expect(
        this.page.getByRole("button", {
          name: /Отправить ещё раз через \d+ с/,
        }),
      ).toBeDisabled();
      await this.page.clock.runFor(60_000);
      await this.page
        .getByRole("button", { name: "Отправить ещё раз" })
        .click();
      expect(requests).toBe(purpose === "verification" ? 1 : 2);
      await expect(this.page.locator("main").getByRole("status")).toContainText(
        "Запрос отправлен",
      );
      await expect(
        this.page.getByRole("button", { name: "Отправить ещё раз через 60 с" }),
      ).toBeDisabled();
      await this.page.clock.runFor(60_000);
      await this.page
        .getByRole("button", { name: "Отправить ещё раз" })
        .click();
      if (purpose === "recovery") {
        await expect(this.page.getByRole("alert")).toContainText(
          "Почта временно недоступна",
        );
        await expect(
          this.page.getByRole("button", { name: "Отправить ещё раз" }),
        ).toBeEnabled();
        expect(requests).toBe(3);
      } else {
        expect(requests).toBe(2);
      }
      await this.page.unroute(endpoint);
      if (purpose === "verification")
        await this.page.unroute("**/api/auth/register");
    }
  }

  private async expectEnhancedForm(): Promise<void> {
    await expect(this.page.locator("form[data-enhanced='true']")).toBeVisible();
    await expect(
      this.page.getByText("Для отправки формы нужен JavaScript.", {
        exact: false,
      }),
    ).toBeHidden();
  }

  async expectProfileLogoutClearsSession(): Promise<void> {
    let loggedOut = false;
    await this.page.route("**/api/auth/session", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          account: loggedOut ? null : member,
          csrf_token: loggedOut ? null : "test-csrf",
        }),
      }),
    );
    await this.page.route("**/api/progress", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: '{"results":[]}',
      }),
    );
    await this.page.route("**/api/auth/logout", async (route) => {
      expect(route.request().headers()["x-csrf-token"]).toBe("test-csrf");
      loggedOut = true;
      await route.fulfill({ status: 204 });
    });
    await this.page.goto("/account");
    await expect(this.page.getByText("member@example.test")).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Мой прогресс" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Продолжить обучение" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Способы входа" }),
    ).toBeVisible();
    await expect(this.page.getByText("Почта и пароль")).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Подтвердить через почту" }),
    ).toHaveCount(0);
    await this.page.getByRole("button", { name: "Выйти" }).click();
    await expect(this.page).toHaveURL("/");
    await this.page.goto("/account");
    await expect(
      this.page.getByRole("link", { name: "Войти, чтобы управлять аккаунтом" }),
    ).toBeVisible();
    expect(loggedOut).toBe(true);
  }

  async expectPasswordProtectedDeletion(): Promise<void> {
    let deleted = false;
    const submittedPasswords: string[] = [];
    await this.page.route("**/api/auth/session", (route) =>
      route.fulfill({
        json: {
          account: deleted ? null : member,
          csrf_token: deleted ? null : "test-csrf",
        },
      }),
    );
    await this.page.route("**/api/progress", (route) =>
      route.fulfill({ json: { results: [] } }),
    );
    await this.page.route("**/api/auth/account", async (route) => {
      const body = route.request().postDataJSON() as {
        confirmation: string;
        password?: string;
      };
      expect(route.request().headers()["x-csrf-token"]).toBe("test-csrf");
      expect(body.confirmation).toBe("DELETE");
      submittedPasswords.push(body.password ?? "");
      if (body.password !== "correct-password") {
        await route.fulfill({ status: 403, json: { detail: "invalid" } });
        return;
      }
      deleted = true;
      await route.fulfill({ status: 204 });
    });

    await this.page.goto("/account");
    await expect(
      this.page.getByText("Для удаления аккаунта потребуется текущий пароль."),
    ).toHaveCount(0);
    await this.page
      .getByRole("button", { name: "Удалить аккаунт и прогресс" })
      .click();
    const dialog = this.page.getByRole("alertdialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Отмена" }),
    ).toHaveAttribute("data-hierarchy", "quiet");
    await expect(
      dialog.getByRole("textbox", { name: "Текущий пароль" }),
    ).toBeVisible();
    await dialog.getByRole("button", { name: "Удалить аккаунт" }).click();
    expect(submittedPasswords).toHaveLength(0);
    await dialog
      .getByRole("textbox", { name: "Текущий пароль" })
      .fill("wrong-password");
    await dialog.getByRole("button", { name: "Удалить аккаунт" }).click();
    await expect(dialog.getByRole("alert")).toContainText(
      "Не удалось подтвердить пароль",
    );
    await expect(dialog).toBeVisible();
    expect(deleted).toBe(false);
    await dialog
      .getByRole("textbox", { name: "Текущий пароль" })
      .fill("correct-password");
    await dialog.getByRole("button", { name: "Удалить аккаунт" }).click();
    await expect(this.page).toHaveURL("/");
    expect(submittedPasswords).toEqual(["wrong-password", "correct-password"]);
    expect(deleted).toBe(true);
  }

  async expectProviderDeletionWithoutPassword(): Promise<void> {
    let deleted = false;
    let attempted = false;
    await this.page.route("**/api/auth/session", (route) =>
      route.fulfill({
        json: {
          account: deleted
            ? null
            : {
                id: "provider-member",
                email: null,
                methods: [{ provider: "vk", subject_hint: null }],
              },
          csrf_token: deleted ? null : "test-csrf",
        },
      }),
    );
    await this.page.route("**/api/progress", (route) =>
      route.fulfill({ json: { results: [] } }),
    );
    await this.page.route("**/api/auth/account", async (route) => {
      const body = route.request().postDataJSON() as {
        confirmation: string;
        password?: string;
      };
      expect(body).toEqual({ confirmation: "DELETE" });
      if (!attempted) {
        attempted = true;
        await route.fulfill({
          status: 403,
          json: { detail: "recent auth required" },
        });
        return;
      }
      deleted = true;
      await route.fulfill({ status: 204 });
    });
    await this.page.goto("/account");
    await expect(
      this.page.getByRole("button", {
        name: "О повторном подтверждении входа",
      }),
    ).toBeVisible();
    await this.page
      .getByRole("button", { name: "Удалить аккаунт и прогресс" })
      .click();
    const dialog = this.page.getByRole("alertdialog");
    await expect(
      dialog.getByRole("textbox", { name: "Текущий пароль" }),
    ).toHaveCount(0);
    await dialog.getByRole("button", { name: "Удалить аккаунт" }).click();
    await expect(dialog.getByRole("alert")).toContainText(
      "Нужно повторно войти",
    );
    await expect(dialog).toBeVisible();
    expect(deleted).toBe(false);
    await dialog.getByRole("button", { name: "Удалить аккаунт" }).click();
    await expect(this.page).toHaveURL("/");
    expect(deleted).toBe(true);
  }

  async expectProviderEmailMethod(): Promise<void> {
    let pendingEmail: string | null = null;
    let verified = false;
    let submitted = 0;
    await this.page.route("**/api/auth/session", (route) =>
      route.fulfill({
        json: {
          account: {
            id: "provider-member",
            email: pendingEmail,
            methods: [
              { provider: "vk", subject_hint: null },
              ...(verified ? [{ provider: "email", subject_hint: null }] : []),
            ],
          },
          csrf_token: "test-csrf",
        },
      }),
    );
    await this.page.route("**/api/auth/account/email-method", async (route) => {
      expect(route.request().headers()["x-csrf-token"]).toBe("test-csrf");
      const body = route.request().postDataJSON() as {
        email: string;
        password: string;
      };
      expect(body).toEqual({
        email: "backup@example.test",
        password: "correct horse battery",
      });
      submitted += 1;
      pendingEmail = body.email;
      await route.fulfill({ status: 202, json: { status: "sent" } });
    });
    await this.page.goto("/account");
    await expect(
      this.page.getByRole("heading", { name: "Добавить почту и пароль" }),
    ).toBeVisible();
    await this.page
      .getByRole("textbox", { name: "Электронная почта" })
      .fill("backup@example.test");
    await this.page
      .getByRole("textbox", { name: "Новый пароль" })
      .fill("correct horse battery");
    await this.page.getByRole("button", { name: "Добавить почту" }).click();
    await expect(this.page.locator("main").getByRole("status")).toContainText(
      "Если адрес доступен",
    );
    await expect(
      this.page.getByRole("heading", { name: "Почта ожидает подтверждения" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: /Отправить повторно через/ }),
    ).toBeDisabled();
    expect(submitted).toBe(1);
    await this.page.route("**/api/auth/verify-email", async (route) => {
      verified = true;
      await route.fulfill({ status: 204 });
    });
    await this.page.goto("/verify-email?token=provider-email-token");
    await expect(this.page.locator("main").getByRole("status")).toContainText(
      "Почта подтверждена",
    );
    await this.page.getByRole("link", { name: "Вернуться к аккаунту" }).click();
    await expect(this.page.getByText("Почта и пароль")).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Почта ожидает подтверждения" }),
    ).toHaveCount(0);
  }

  async expectProviderUnlinkConfirmation(): Promise<void> {
    let attempts = 0;
    await this.page.route("**/api/auth/session", (route) =>
      route.fulfill({
        json: {
          account: {
            id: "provider-member",
            email: null,
            methods: [
              { provider: "vk", subject_hint: null },
              { provider: "yandex", subject_hint: null },
            ],
          },
          csrf_token: "test-csrf",
        },
      }),
    );
    await this.page.route("**/api/auth/providers/vk", async (route) => {
      attempts += 1;
      await route.fulfill({
        status: 403,
        json: { detail: "recent auth required" },
      });
    });
    await this.page.goto("/account");
    await this.page.getByRole("button", { name: "Отвязать VK ID" }).click();
    const dialog = this.page.getByRole("alertdialog");
    await expect(dialog).toContainText("После отвязки");
    expect(attempts).toBe(0);
    await dialog.getByRole("button", { name: "Отвязать способ входа" }).click();
    await expect(dialog.getByRole("alert")).toContainText(
      "Нужно повторно подтвердить вход",
    );
    await expect(dialog).toBeVisible();
    expect(attempts).toBe(1);
    await dialog.getByRole("button", { name: "Отмена" }).click();
    await expect(dialog).toHaveCount(0);
  }

  async expectEmailReauthenticationAfterUnlinkRefusal(): Promise<void> {
    await this.page.route("**/api/auth/session", (route) =>
      route.fulfill({
        json: {
          account: {
            ...member,
            methods: [
              { provider: "email", subject_hint: null },
              { provider: "vk", subject_hint: null },
            ],
          },
          csrf_token: "test-csrf",
        },
      }),
    );
    await this.page.route("**/api/progress", (route) =>
      route.fulfill({ json: { results: [] } }),
    );
    await this.page.route("**/api/auth/providers/vk", (route) =>
      route.fulfill({ status: 403, json: { detail: "recent auth required" } }),
    );
    await this.page.goto("/account");
    await expect(
      this.page.getByRole("link", { name: "Войти повторно" }),
    ).toHaveCount(0);
    await this.page.getByRole("button", { name: "Отвязать VK ID" }).click();
    const dialog = this.page.getByRole("alertdialog");
    await dialog.getByRole("button", { name: "Отвязать способ входа" }).click();
    await expect(dialog.getByRole("alert")).toContainText(
      "Нужно повторно подтвердить вход",
    );
    await dialog.getByRole("button", { name: "Отмена" }).click();
    await expect(
      this.page.getByRole("link", { name: "Войти повторно" }),
    ).toHaveAttribute("href", /\/sign-in.*returnTo/);
  }

  async expectProgressClearsOnLogout(): Promise<void> {
    let loggedOut = false;
    await this.page.route("**/api/auth/session", (route) =>
      route.fulfill({
        json: {
          account: loggedOut ? null : member,
          csrf_token: loggedOut ? null : "test-csrf",
        },
      }),
    );
    await this.page.route("**/api/progress", (route) =>
      route.fulfill({
        json: {
          results: loggedOut
            ? []
            : [
                {
                  context_kind: "topic_lesson",
                  context_id: "rekursiya",
                  task_id: "r1",
                  solution_revision: 1,
                },
              ],
        },
      }),
    );
    await this.page.route("**/api/topics/practice-summary", (route) =>
      route.fulfill({
        json: {
          topics: [
            { id: "rekursiya", tasks: [{ id: "r1", solution_revision: 1 }] },
          ],
        },
      }),
    );
    await this.page.route("**/api/auth/logout", async (route) => {
      loggedOut = true;
      await route.fulfill({ status: 204 });
    });
    await this.page.goto("/ege");
    await expect(this.page.getByText("Решено 1 из 1")).toBeVisible();
    await this.page
      .locator('[data-public-header] a[href="/account"]')
      .first()
      .click();
    await expect(this.page.getByText("member@example.test")).toBeVisible();
    await this.page.getByRole("button", { name: "Выйти" }).click();
    await expect(this.page).toHaveURL("/");
    await this.page
      .getByRole("link", { name: "Темы", exact: true })
      .first()
      .click();
    await expect(this.page.getByText("Решено 0 из 1")).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Войти, чтобы сохранять" }).first(),
    ).toBeVisible();
    await expect(this.page.getByText("Решено 1 из 1")).toHaveCount(0);
  }

  async expectNoJavaScriptSignIn(): Promise<void> {
    await this.page.goto("/sign-in");
    await expect(
      this.page.getByRole("heading", { name: "Войти" }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Для отправки формы нужен JavaScript."),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "VK ID" }),
    ).toBeDisabled();
  }

  async expectNoJavaScriptCredentialFormsUsePost(): Promise<void> {
    for (const path of [
      "/sign-in",
      "/register",
      "/password-reset",
      "/password-reset?token=usable-token",
    ]) {
      await this.page.goto(path);
      await expect(this.page.locator("form")).toHaveAttribute("method", "post");
    }

    await this.page.goto("/sign-in");
    await this.page
      .getByRole("textbox", { name: "Электронная почта" })
      .fill("learner@example.test");
    await this.page
      .getByRole("textbox", { name: "Пароль" })
      .fill("not-in-the-url");
    await expect(
      this.page.getByRole("button", { name: "Войти" }),
    ).toBeDisabled();
    await expect(this.page).not.toHaveURL(/not-in-the-url/);
  }

  async expectEmailMethodFormUsesPost(): Promise<void> {
    await this.page.route("**/api/auth/session", (route) =>
      route.fulfill({
        json: {
          account: {
            id: "provider-member",
            email: null,
            methods: [{ provider: "vk", subject_hint: null }],
          },
          csrf_token: "test-csrf",
        },
      }),
    );
    await this.page.route("**/api/progress", (route) =>
      route.fulfill({ json: { results: [] } }),
    );
    await this.page.goto("/account");
    await expect(
      this.page.getByRole("heading", { name: "Добавить почту и пароль" }),
    ).toBeVisible();
    await expect(
      this.page
        .locator("section")
        .filter({ hasText: "Добавить почту и пароль" })
        .locator("form"),
    ).toHaveAttribute("method", "post");
  }

  async expectNoJavaScriptVerification(): Promise<void> {
    await this.page.goto("/verify-email?token=unusable-token");
    await expect(
      this.page.getByText("Для подтверждения почты включите JavaScript", {
        exact: false,
      }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Вернуться к регистрации" }),
    ).toBeVisible();
  }

  async expectSessionFailureIsNotGuest(): Promise<void> {
    let attempts = 0;
    await this.page.route("**/api/auth/session", (route) => {
      attempts += 1;
      return route.fulfill(
        attempts === 1
          ? { status: 503, json: { detail: "unavailable" } }
          : { status: 200, json: { account: member, csrf_token: "test-csrf" } },
      );
    });
    await this.page.goto("/account");
    await expect(this.page.getByRole("alert")).toContainText(
      "Не удалось загрузить аккаунт",
    );
    await expect(
      this.page.getByRole("link", { name: "Войти, чтобы управлять аккаунтом" }),
    ).toHaveCount(0);
    await this.page.getByRole("button", { name: "Повторить загрузку" }).click();
    await expect(this.page.getByText("member@example.test")).toBeVisible();
  }
}
