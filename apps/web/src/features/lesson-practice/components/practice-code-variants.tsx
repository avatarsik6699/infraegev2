import { useState } from "react";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import {
  TabsRoot,
  TabsList,
  TabsTab,
  TabsPanel,
} from "~/shared/components/tabs";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";

export const PracticeCodeVariants: React.FC<{
  variants: readonly PracticeTaskTypes.CodeVariant[];
}> = (props) => {
  const [selected, setSelected] = useState(
    props.variants.find((variant) => variant.language === "python")?.label ??
      props.variants[0]?.label ??
      "",
  );
  const enhanced = useIsEnhanced();
  return (
    <TabsRoot value={selected} onValueChange={setSelected}>
      <TabsList label="Язык алгоритма" hidden={!enhanced}>
        {props.variants.map((variant) => (
          <TabsTab key={variant.label} value={variant.label}>
            {variant.label}
          </TabsTab>
        ))}
      </TabsList>
      {props.variants.map((variant) => (
        <TabsPanel key={variant.label} value={variant.label}>
          {!enhanced && (
            <Typography.Text variant="caption">{variant.label}</Typography.Text>
          )}
          <CodeBlock
            code={variant.code}
            language={variant.language}
            label={variant.label}
          />
        </TabsPanel>
      ))}
    </TabsRoot>
  );
};
