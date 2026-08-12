import {
  CodeHighlight,
  CodeHighlightAdapterProvider,
  createHighlightJsAdapter,
} from "@mantine/code-highlight";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("python", python);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerAliases("jsx", { languageName: "javascript" });
hljs.registerAliases("tsx", { languageName: "typescript" });
hljs.registerAliases("html", { languageName: "xml" });

const highlightJsAdapter = createHighlightJsAdapter(hljs);

type Props = {
  code: string;
  language: string;
};

const HighlightedCode: React.FC<Props> = (props) => (
  <CodeHighlightAdapterProvider adapter={highlightJsAdapter}>
    <CodeHighlight
      code={props.code}
      language={props.language}
      copyLabel="Копировать код"
      copiedLabel="Скопировано"
      withCopyButton
    />
  </CodeHighlightAdapterProvider>
);

export default HighlightedCode;
