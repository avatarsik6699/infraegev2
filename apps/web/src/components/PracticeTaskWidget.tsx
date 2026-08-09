import { useState } from "react";
import { ContentBlockList } from "~/components/content-blocks/ContentBlockRenderer";
import type { Task } from "~/content/types";

interface CheckResponse {
  correct: boolean;
  explanation: Task["explanation"];
}

/**
 * Practice widget — `interaction_type: production` in priority over `recognition` (docs/SPEC.md
 * §5.2/§11.1): a free-text/number input, not a multiple-choice list, since production retrieval is
 * what the testing effect relies on (learning-science-principles.md §3.1). Progressively enhanced:
 * the statement/explanation are server-rendered; only "submit answer" needs JS.
 */
export function PracticeTaskWidget({
  task,
  onMastered,
}: {
  task: Task;
  onMastered?: () => void;
}) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      const body = (await response.json()) as CheckResponse;
      setResult(body);
      if (body.correct) onMastered?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>{task.statement}</p>
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
}
