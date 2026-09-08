import { useRef, useState } from "react";
import { Button } from "~/shared/components/button";
import { Field } from "~/shared/components/field";
import {
  SurfaceMaterial,
  SurfaceGlint,
} from "~/shared/components/surface-decoration";
import { Typography } from "~/shared/components/typography";
import { useElementActivity } from "~/shared/lib/element-activity";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import styles from "./visual-language-specimen.module.css";

export const VisualLanguageForm: React.FC = () => {
  const ref = useRef<HTMLFormElement>(null);
  const active = useElementActivity(ref);
  const enhanced = useIsEnhanced();
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  return (
    <form
      ref={ref}
      className={styles.form}
      data-visual-example="form"
      onSubmit={(event) => {
        event.preventDefault();
        setResult(answer.trim() === "4" ? "correct" : "incorrect");
      }}
    >
      <SurfaceMaterial />
      <SurfaceGlint
        kind="soft"
        active={active}
        playback="loop"
        className={styles.learningGlint}
      />
      <div className={styles.reading}>
        <Typography.Title order={4}>Проверьте результат</Typography.Title>
        <Field
          label="Что выведет print(count)?"
          description="Демонстрация формы на стенде. Ответ не сохраняется."
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setResult(null);
          }}
          error={
            result === "incorrect"
              ? "Прибавьте 1 к исходному значению 3."
              : undefined
          }
        />
        <Button type="submit" disabled={!enhanced || !answer.trim()}>
          Проверить пример
        </Button>
        <Typography.Text role="status">
          {result === "correct" ? "Верно: программа выведет 4." : null}
          {!enhanced
            ? "Проверка примера доступна с JavaScript; программа выведет 4."
            : null}
        </Typography.Text>
      </div>
    </form>
  );
};
