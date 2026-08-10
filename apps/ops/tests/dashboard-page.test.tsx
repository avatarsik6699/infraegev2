// @vitest-environment jsdom

import { act, cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardPage } from "~/pages/dashboard";
import {
  fetchDashboard,
  fetchProjects,
} from "~/pages/dashboard/api/ops-client";
import { DASHBOARD_REFRESH_MS } from "~/pages/dashboard/model/use-dashboard";
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
  fetchProjectsMock.mockResolvedValue([{ id: "infraege", name: "infraege.ru" }]);
  fetchDashboardMock.mockResolvedValue(dashboardFixture);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("DashboardPage", () => {
  it("loads the first configured project and renders every dashboard section", async () => {
    render(<DashboardPage />);
    expect(await screen.findByText("Графики загружены")).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
    expect(screen.getByText("web")).toBeTruthy();
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
      vi.advanceTimersByTime(DASHBOARD_REFRESH_MS);
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
});
