import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PublicHeader } from "~/widgets/public-header";

describe("PublicHeader", () => {
  it("renders the complete ALCHIMIA release identity on the home surface", () => {
    const { container } = render(<PublicHeader home />);

    expect(container.querySelector("[data-public-header]")).not.toBeNull();
    expect(container.querySelector("[data-alchimia-mark]")).not.toBeNull();
    expect(screen.getByText("ALCHIMIA", { exact: true })).not.toBeNull();
    expect(screen.getByText("ЕГЭ информатика", { exact: true })).not.toBeNull();
    expect(screen.getByText("beta", { exact: true })).not.toBeNull();
    expect(screen.getByLabelText("Версия 1.0.0")).not.toBeNull();
    expect(screen.getByLabelText("ALCHIMIA — ЕГЭ информатика")).not.toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
