import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { SearchField } from "~/shared/components/search-field";

const props = {
  label: "Поиск",
  name: "q",
  placeholder: "Найти",
  submitLabel: "Искать",
  clearLabel: "Очистить",
};
it("preserves uncontrolled default value and explicit form submission for practice", () => {
  const submit = vi.fn((event: { preventDefault: () => void }) =>
    event.preventDefault(),
  );
  render(
    <form onSubmit={submit}>
      <SearchField {...props} defaultValue="старый" />
    </form>,
  );
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "новый" },
  });
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Искать" }));
  expect(submit).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Очистить" }));
  expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
  expect(screen.getByRole("searchbox")).toBe(document.activeElement);
  expect(submit).toHaveBeenCalledTimes(1);
});
it("reports controlled edits and clearing and accepts parent resets", () => {
  const change = vi.fn();
  const view = render(
    <SearchField {...props} value="16" onValueChange={change} />,
  );
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "05" } });
  expect(change).toHaveBeenLastCalledWith("05");
  view.rerender(<SearchField {...props} value="05" onValueChange={change} />);
  fireEvent.click(screen.getByRole("button", { name: "Очистить" }));
  expect(change).toHaveBeenLastCalledWith("");
  view.rerender(<SearchField {...props} value="" onValueChange={change} />);
  expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
  expect(screen.queryByRole("button", { name: "Очистить" })).toBeNull();
});

it("Change 191: lists suggestions with marked matches and opens the chosen one", async () => {
  const select = vi.fn();
  const submit = vi.fn((event: { preventDefault: () => void }) =>
    event.preventDefault(),
  );
  render(
    <form onSubmit={submit}>
      <SearchField
        {...props}
        value="цифр"
        suggestions={{
          active: true,
          loading: false,
          items: [
            {
              id: "task-1",
              title: "Сумма цифр",
              titleHighlights: [[6, 10]],
              meta: "№ 5",
              snippet: "Найдите сумму цифр числа.",
              snippetHighlights: [[14, 18]],
            },
          ],
          total: 12,
          listLabel: "Подходящие задачи",
          emptyLabel: "Ничего не нашлось",
          loadingLabel: "Ищем…",
          showAllLabel: (total) => `Показать все: ${String(total)}`,
          onSelect: select,
        }}
      />
    </form>,
  );
  const input = screen.getByRole("combobox", { name: "Поиск" });
  fireEvent.click(input);
  fireEvent.keyDown(input, { key: "ArrowDown" });
  const option = await screen.findByRole("option");
  expect(option.querySelectorAll("mark")).toHaveLength(2);
  expect(screen.getByText("Показать все: 12")).toBeTruthy();
  fireEvent.click(option);
  expect(select).toHaveBeenCalledWith("task-1");
  expect(submit).not.toHaveBeenCalled();
});
