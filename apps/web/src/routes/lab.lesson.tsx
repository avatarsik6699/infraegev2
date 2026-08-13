import { createFileRoute } from "@tanstack/react-router";
import { LessonDesignLab } from "~/pages/lesson-design-lab";

export const Route = createFileRoute("/lab/lesson")({
  head: () => ({
    meta: [
      { title: "Двоичный поиск — дизайн-lab infraege" },
      { name: "robots", content: "noindex,nofollow" },
      {
        name: "description",
        content: "Синтетический урок для проверки дизайн-системы infraege.",
      },
    ],
  }),
  component: LessonDesignLab,
});
