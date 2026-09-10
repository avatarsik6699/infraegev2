import { RotateCw } from "lucide-react";
import { useState } from "react";
import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { EmptyState } from "~/shared/components/empty-state";
import { StatusScene } from "~/shared/components/status-scene";
import { Typography } from "~/shared/components/typography";

const visualLanguageStates = [
  {
    id: "404",
    title: "Такой страницы нет",
    description: "Проверьте адрес или вернитесь на главную.",
  },
  {
    id: "error",
    title: "Не удалось загрузить страницу",
    description: "Попробуйте ещё раз или вернитесь на главную.",
  },
  {
    id: "502",
    title: "Ошибка обмена с сервером",
    description: "Не удалось получить корректный ответ. Попробуйте ещё раз",
  },
  {
    id: "503",
    title: "Сервис временно недоступен",
    description: "Попробуйте открыть страницу немного позже",
  },
  {
    id: "504",
    title: "Сервер не успел ответить",
    description:
      "Ответ занял слишком много времени. Попробуйте обновить страницу",
  },
] as const;

export const VisualLanguageStates: React.FC = () => {
  const [selected, setSelected] = useState("404");
  const [retried, setRetried] = useState(false);
  const state =
    visualLanguageStates.find((item) => item.id === selected) ??
    visualLanguageStates[0];
  return (
    <section
      aria-labelledby="auxiliary-states-heading"
      id="system-auxiliary-states"
    >
      <Typography.Title order={4} id="auxiliary-states-heading">
        Вспомогательные состояния
      </Typography.Title>
      <div role="group" aria-label="Образец состояния">
        {visualLanguageStates.map((item) => (
          <Button
            key={item.id}
            hierarchy="quiet"
            aria-pressed={selected === item.id}
            onClick={() => {
              setSelected(item.id);
              setRetried(false);
            }}
          >
            {item.id === "error" ? item.title : item.id}
          </Button>
        ))}
      </div>
      <StatusScene
        title={state.title}
        description={state.description}
        {...(state.id !== "error"
          ? { kind: "code" as const, code: state.id }
          : { kind: "error" as const })}
        headingOrder={4}
      >
        {state.id !== "404" ? (
          <Button
            hierarchy="quiet"
            iconStart={<RotateCw aria-hidden="true" size={18} />}
            onClick={() => setRetried(true)}
          >
            {state.id === "error" ? "Повторить" : "Обновить страницу"}
          </Button>
        ) : null}
        <ActionLink hierarchy="drawn" icon="back" to="/">
          На главную
        </ActionLink>
      </StatusScene>
      {retried ? (
        <Typography.Text role="status">
          В образце повтор выполнен. Реальную загрузку повторяет маршрутизатор.
        </Typography.Text>
      ) : null}
      <EmptyState
        headingOrder={4}
        title="В этом уроке нет практических заданий"
        description="Можно продолжить чтение урока."
      />
    </section>
  );
};
