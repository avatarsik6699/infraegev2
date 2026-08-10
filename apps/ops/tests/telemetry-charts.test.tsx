// @vitest-environment jsdom

import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TelemetryCharts from "~/pages/dashboard/components/telemetry-charts";
import { dashboardFixture } from "./fixtures";
import { render } from "./render";

vi.mock("@mantine/charts", () => ({
  LineChart: (props: { "aria-label": string }) => (
    <div role="img" aria-label={props["aria-label"]} />
  ),
  AreaChart: (props: { "aria-label": string }) => (
    <div role="img" aria-label={props["aria-label"]} />
  ),
}));

afterEach(cleanup);

describe("TelemetryCharts", () => {
  it("provides text summaries alongside keyboard-accessible charts", () => {
    render(<TelemetryCharts data={dashboardFixture} />);
    expect(
      screen.getByText("Последний срез: CPU 12%, RAM 34%, load 0.50."),
    ).toBeTruthy();
    expect(
      screen.getByText("Последний срез: 50 просмотров и 42 сессий."),
    ).toBeTruthy();
    expect(screen.getByRole("img", { name: "График нагрузки CPU и RAM" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "График просмотров и сессий" })).toBeTruthy();
  });
});
