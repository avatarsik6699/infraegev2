// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardPage } from "~/pages/dashboard";
import {
  fetchDashboard,
  fetchProjects,
} from "~/pages/dashboard/api/ops-client";
import { DEFAULT_DASHBOARD_REFRESH_MS } from "~/pages/dashboard/model/use-dashboard";
import { formatContainerMemory } from "~/pages/dashboard/components/operations-tables";
import { dashboardFixture } from "./fixtures";
import { render } from "./render";

vi.mock("~/pages/dashboard/api/ops-client", () => ({
  fetchProjects: vi.fn(),
  fetchDashboard: vi.fn(),
}));

vi.mock("~/pages/dashboard/components/telemetry-charts", () => ({
  default: () => <div>Графики загружены</div>,
}));

const fetchProjectsMock = vi.mocked(fetchProjects);
const fetchDashboardMock = vi.mocked(fetchDashboard);

beforeEach(() => {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: "visible",
  });
  fetchProjectsMock.mockResolvedValue([
    { id: "infraege", name: "infraege.ru" },
  ]);
  fetchDashboardMock.mockResolvedValue(dashboardFixture);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("DashboardPage", () => {
  it("formats Beszel container memory in binary units", () => {
    expect(formatContainerMemory(208.04)).toBe("208.04 MiB");
    expect(formatContainerMemory(1280)).toBe("1.25 GiB");
  });

  it("loads the first configured project and renders every dashboard section", async () => {
    render(<DashboardPage />);
    expect(await screen.findByText("Графики загружены")).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
    expect(screen.getByText("LIVE 30M")).toBeTruthy();
    expect(screen.getByText("web")).toBeTruthy();
    expect(screen.getByText("208.04 MiB")).toBeTruthy();
    expect(screen.getByText("topic_view")).toBeTruthy();
    expect(screen.getByText("request failed")).toBeTruthy();
    expect(screen.getByText("192.0.2.1")).toBeTruthy();
    expect(fetchDashboardMock).toHaveBeenCalledWith(
      "infraege",
      "24h",
      expect.any(AbortSignal),
    );
  });

  it("shows a terminal project configuration error instead of an endless loader", async () => {
    fetchProjectsMock.mockRejectedValue(new Error("offline"));
    render(<DashboardPage />);
    expect(
      await screen.findByText("Конфигурация проектов недоступна"),
    ).toBeTruthy();
    expect(screen.queryByLabelText("Загрузка данных")).toBeNull();
  });

  it("requests a fresh snapshot when the range changes", async () => {
    render(<DashboardPage />);
    await screen.findByText("Графики загружены");
    fireEvent.click(screen.getByText("7d"));
    await waitFor(() =>
      expect(fetchDashboardMock).toHaveBeenLastCalledWith(
        "infraege",
        "7d",
        expect.any(AbortSignal),
      ),
    );
  });

  it("keeps the last snapshot visible when a background refresh fails", async () => {
    vi.useFakeTimers();
    fetchDashboardMock
      .mockResolvedValueOnce(dashboardFixture)
      .mockRejectedValueOnce(new Error("offline"));
    render(<DashboardPage />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByText("request failed")).toBeTruthy();
    await act(async () => {
      vi.advanceTimersByTime(DEFAULT_DASHBOARD_REFRESH_MS);
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(
      screen.getByText(
        "Не удалось обновить dashboard — показан последний успешный срез",
      ),
    ).toBeTruthy();
    expect(screen.getByText("request failed")).toBeTruthy();
  });

  it("supports paused polling and an explicit manual refresh", async () => {
    vi.useFakeTimers();
    render(<DashboardPage />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(fetchDashboardMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("PAUSE"));
    await act(async () => {
      vi.advanceTimersByTime(60_000);
      await Promise.resolve();
    });
    expect(fetchDashboardMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Обновить сейчас" }));
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(fetchDashboardMock).toHaveBeenCalledTimes(2);
  });

  it("pauses in a hidden tab and refreshes immediately when it becomes visible", async () => {
    vi.useFakeTimers();
    render(<DashboardPage />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });

    await act(async () => {
      vi.advanceTimersByTime(DEFAULT_DASHBOARD_REFRESH_MS);
      await Promise.resolve();
    });
    expect(fetchDashboardMock).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(fetchDashboardMock).toHaveBeenCalledTimes(2);
  });

  it("does not overlap refreshes when a request is still running", async () => {
    vi.useFakeTimers();
    let release!: (value: typeof dashboardFixture) => void;
    fetchDashboardMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          release = resolve;
        }),
    );
    render(<DashboardPage />);

    await act(async () => {
      vi.advanceTimersByTime(DEFAULT_DASHBOARD_REFRESH_MS);
      await Promise.resolve();
    });
    expect(fetchDashboardMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      release(dashboardFixture);
      await Promise.resolve();
    });
  });
});
