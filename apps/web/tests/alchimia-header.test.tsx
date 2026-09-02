import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AlchimiaHeader } from "~/widgets/alchimia-header";

describe("AlchimiaHeader", () => {
  it("renders a compact non-link identity on the home surface", () => {
    const { container } = render(<AlchimiaHeader home />);

    expect(container.querySelector("[data-alchimia-header]")).not.toBeNull();
    expect(container.querySelector("[data-alchimia-mark]")).not.toBeNull();
    expect(screen.getByText("ALCHIMIA", { exact: true })).not.toBeNull();
    expect(screen.getByText("ЕГЭ информатика", { exact: true })).not.toBeNull();
    expect(screen.getByLabelText("ALCHIMIA — ЕГЭ информатика")).not.toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
