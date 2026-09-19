import type { PracticeTaskTypes } from "~/entities/practice-task";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";

export const PracticeCodeVariants: React.FC<{
  variants: readonly PracticeTaskTypes.CodeVariant[];
}> = (props) => {
  const python = props.variants.find(
    (variant) => variant.language === "python",
  );
  if (!python)
    return (
      <Typography.Text>
        Версия этого фрагмента на Python пока недоступна.
      </Typography.Text>
    );
  return <CodeBlock code={python.code} language="python" label="Python" />;
};
