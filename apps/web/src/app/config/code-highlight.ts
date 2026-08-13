import { createHighlightJsAdapter } from "@mantine/code-highlight";
import highlightJs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";

highlightJs.registerLanguage("python", python);

export const appCodeHighlightAdapter = createHighlightJsAdapter(highlightJs);
