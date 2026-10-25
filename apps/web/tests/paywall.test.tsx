import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AccessTypes } from "~/entities/access";
import { billingFormat, type BillingTypes } from "~/entities/billing";
import { divisorsAndMasksLesson } from "~/entities/lesson/content/divisors-and-masks.lesson";
import {
  LockedTasks,
  PaywallGate,
  paywallCopy,
  paywallUnlocks,
} from "~/features/paywall";
import {
  legalBlocks,
  offerVersions,
} from "~/pages/legal/model/legal-documents";
import { freeScope, taskRanges } from "~/pages/pricing/model/free-scope";

vi.mock("~/shared/components/action-link", () => ({
  ActionLink: (props: {
    children?: React.ReactNode;
    to: string;
    search?: Record<string, string>;
  }) => (
    <a href={`${props.to}?${new URLSearchParams(props.search).toString()}`}>
      {props.children}
    </a>
  ),
}));

const offer: BillingTypes.Offer = {
  billing: true,
  paywall: true,
  offerVersion: "2026-10-17",
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
      monthlyEquivalentKopecks: 24575,
      monthsPriceKopecks: 596167,
    },
  ],
};

const ready = (
  signedIn: boolean,
): Extract<AccessTypes.State, { status: "ready" }> => ({
  status: "ready",
  paywall: true,
  signedIn,
  granted: false,
  until: null,
  restriction: null,
});

afterEach(cleanup);

describe("paywall (Change 192)", () => {
  it("counts what a partly paid topic opens from its own content", () => {
    const unlocks = paywallUnlocks.topic(divisorsAndMasksLesson, 23);
    expect(unlocks.lessons.length).toBeGreaterThan(0);
    expect(unlocks.tasks).toBe(23);
    expect(unlocks.practice).toBe(Boolean(divisorsAndMasksLesson.paidPractice));
    expect(unlocks.questions).toBeGreaterThan(0);
  });

  it("asks a guest for an account first and returns there", () => {
    render(
      <PaywallGate
        access={ready(false)}
        offer={offer}
        unlocks={paywallUnlocks.topic(divisorsAndMasksLesson, 3)}
        {...paywallCopy.topic([25])}
        headingOrder={2}
        from="/ege/25/maski"
      />,
    );
    const gate = screen.getByRole("region", {
      name: "Создайте аккаунт, чтобы продолжить",
    });
    expect(gate.classList).toContain("paywall");
    expect(
      within(gate)
        .getByRole("link", { name: "Создать аккаунт" })
        .getAttribute("href"),
    ).toBe("/register?returnTo=%2Fege%2F25%2Fmaski");
    expect(within(gate).queryByText(/₽/u)).toBeNull();
  });

  it("names the year price only with «при оплате за год»", () => {
    render(
      <PaywallGate
        access={ready(true)}
        offer={offer}
        unlocks={{
          lessons: [{ title: "Маски чисел" }],
          questions: 18,
          tasks: 23,
          practice: true,
        }}
        {...paywallCopy.topic([25])}
        headingOrder={2}
        from="/ege/25/maski"
      />,
    );
    const gate = screen.getByRole("region", {
      name: "Откройте доступ к сложным задачам",
    });
    expect(gate.textContent).toContain("сложных вариантов задания 25");
    expect(gate.textContent).toContain(
      `от ${billingFormat.rub(24575)} в месяцпри оплате за год`,
    );
    expect(gate.textContent).toContain("18 вопросов для самопроверки");
    expect(gate.textContent).toContain(
      "23 задачи с проверкой ответа и итоговая практика по теме",
    );
    expect(gate.textContent).not.toMatch(/подписк/u);
    expect(
      within(gate)
        .getByRole("link", { name: "Получить полный доступ" })
        .getAttribute("href"),
    ).toBe("/pricing?from=%2Fege%2F25%2Fmaski");
  });

  it("explains a suspension with the appeal contact and sells nothing", () => {
    render(
      <PaywallGate
        access={{
          ...ready(true),
          restriction: {
            kind: "suspension",
            reason: "доступ передан другим людям",
            until: "2027-10-01T09:00:00Z",
            contact: "kodumka@mail.ru",
          },
        }}
        offer={offer}
        unlocks={{ lessons: [], questions: 0, tasks: 0, practice: false }}
        {...paywallCopy.topic([25])}
        headingOrder={2}
        from="/ege/25/maski"
      />,
    );
    const notice = screen.getByRole("region", {
      name: "Платный доступ приостановлен",
    });
    expect(notice.textContent).toContain("До 1 октября 2027 г.");
    expect(notice.textContent).toContain("доступ передан другим людям");
    expect(
      within(notice).getByRole("link", { name: "kodumka@mail.ru" }),
    ).toBeTruthy();
    expect(screen.queryByText("Получить полный доступ")).toBeNull();
  });

  it("shows a locked task without its statement", () => {
    render(
      <LockedTasks
        start={4}
        from="/ege/25/praktika"
        tasks={[
          {
            id: "t1",
            title: "Минимальное число после границы",
            difficulty: 3,
            difficultyLabel: "Трудная",
            skills: ["маски чисел"],
            examNumbers: [25],
            theoryLinks: [],
            countsTowardMastery: true,
          },
        ]}
      />,
    );
    const list = screen.getByRole("list", { name: "Задачи с полным доступом" });
    const card = list.querySelector("[data-locked-task='t1']");
    if (!card) throw new Error("locked task card missing");
    expect(card.textContent).toContain("Задача 4");
    expect(card.textContent).toContain("Условие и проверка ответа");
  });
});

describe("pricing and legal helpers (Change 192)", () => {
  it("writes free task numbers as ranges", () => {
    expect(taskRanges([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 16])).toBe(
      "1–11, 14 и 16",
    );
    expect(taskRanges([5])).toBe("5");
  });

  it("reads the free scope from the published content", () => {
    const scope = freeScope();
    expect(scope.freeTopicCount).toBeGreaterThan(0);
    expect(scope.freeCourses.map((course) => course.title)).toContain("Python");
  });

  it("formats rubles and the year saving honestly", () => {
    expect(billingFormat.rub(299000)).toBe("2 990 ₽");
    expect(billingFormat.savingPercent(offer.plans[1]!)).toBe(49);
  });

  it("renders the offer from content/legal, newest edition first", () => {
    expect(offerVersions[0]?.version).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
    const blocks = legalBlocks(offerVersions[0]?.text ?? "");
    expect(blocks[0]?.kind).toBe("title");
    expect(blocks.some((block) => block.text.startsWith("10. Реквизиты"))).toBe(
      true,
    );
    // Change 198: personal access, three devices and the graded, appealable measures
    const text = offerVersions[0]?.text ?? "";
    expect(text).toContain("не более чем на трёх устройствах");
    expect(text).toContain("6. Ограничение доступа при нарушении");
    expect(offerVersions.map((offer) => offer.version)).toContain("2026-10-17");
  });
});
