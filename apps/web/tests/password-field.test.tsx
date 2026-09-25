import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PasswordField } from "~/shared/components/password-field";

describe("PasswordField", () => {
  it("reveals and hides a password through an accessible toggle", () => {
    render(<PasswordField label="Пароль" name="password" required />);

    const input = screen.getByLabelText("Пароль");
    const toggle = screen.getByRole("button", { name: "Показать пароль" });
    expect(input.getAttribute("type")).toBe("password");
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    expect(toggle.getAttribute("data-surface")).toBe("bare");
    expect(toggle.querySelector("svg")).not.toBeNull();

    fireEvent.click(toggle);

    expect(input.getAttribute("type")).toBe("text");
    expect(
      screen
        .getByRole("button", { name: "Скрыть пароль" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      screen
        .getByRole("button", { name: "Скрыть пароль" })
        .querySelector("svg"),
    ).not.toBeNull();
  });
});
