import type { ContentBlockType, WorkedExampleBlockData } from "~/content/types";

const HEADING: Record<string, string> = {
  worked_example: "Разобранный пример",
  completion_exercise: "Закончи решение",
  productive_failure_prompt: "Попробуй сам, пока не зная теории",
};

/** worked_example / completion_exercise / productive_failure_prompt share one shape (docs/SPEC.md
 * §3) — they differ only in pedagogical framing (learning-science-principles.md §1.1/§5), not
 * structure, so one component renders all three with a type-specific heading. */
export function WorkedExampleBlock({
  type,
  data,
}: {
  type: ContentBlockType;
  data: WorkedExampleBlockData;
}) {
  return (
    <section data-block-type={type}>
      <h3>{HEADING[type] ?? "Пример"}</h3>
      <p>{data.prompt}</p>
      {type === "worked_example" ? (
        <ol>
          {data.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      ) : (
        // completion_exercise / productive_failure_prompt: the steps are the model solution,
        // revealed only after an attempt — not shown up front (Kapur productive-failure framing).
        <details>
          <summary>Показать разбор</summary>
          <ol>
            {data.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </details>
      )}
    </section>
  );
}
