import { CodeBlock } from "~/shared/components/code-block";
import { WorkedExample } from "~/shared/components/learning-content";

export const VisualLanguageLearning: React.FC = () => (
  <div data-visual-example="learning">
    <WorkedExample
      title="Как изменяется значение"
      prompt="Каждая новая строка использует значение, полученное на предыдущем шаге."
      steps={[
        "Сначала в переменной count хранится 3.",
        "Выражение count + 1 даёт 4. Это значение записывается обратно в count.",
      ]}
    >
      <CodeBlock
        code={"count = 3\ncount = count + 1\nprint(count)"}
        language="python"
        label="Изменение значения"
      />
    </WorkedExample>
  </div>
);
