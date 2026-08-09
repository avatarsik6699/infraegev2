import { useState } from "react";
import { ContentBlockList } from "~/entities/content-block/ui/content-block-list";
import type { Task } from "~/entities/content/model/types";
import {
  checkAnswer,
  type CheckAnswerResponse,
} from "~/features/check-answer/api/check-answer";

type Props = {
  task: Task;
  onMastered?: () => void;
};

/**
 * Practice widget — `interaction_type: production` in priority over `recognition` (docs/SPEC.md
 * §5.2/§11.1): a free-text/number input, not a multiple-choice list, since production retrieval is
 * what the testing effect relies on (learning-science-principles.md §3.1). Progressively enhanced:
 * the statement/explanation are server-rendered; only "submit answer" needs JS.
 */
export const PracticeTaskWidget: React.FC<Props> = (props) => {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<CheckAnswerResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const body = await checkAnswer(props.task.id, answer);
      setResult(body);
      if (body.correct) props.onMastered?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>{props.task.statement}</p>
      <label>
        Ответ
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={submitting}
        />
      </label>
      <button type="submit" disabled={submitting || answer.trim() === ""}>
        Проверить
      </button>

      {result && (
        <div role="status" data-correct={result.correct}>
          <p>{result.correct ? "Верно!" : "Неверно."}</p>
          {/* Feedback timing/depth per learning-science-principles.md §6: correct/incorrect is
              immediate, but the explanation is a full worked-example-style breakdown, not just
              "the right answer is X" (docs/SPEC.md §3, Task.explanation). */}
          <ContentBlockList blocks={result.explanation} />
        </div>
      )}
    </form>
  );
};
