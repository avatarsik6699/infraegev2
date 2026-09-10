import { createFileRoute } from "@tanstack/react-router";
import { LessonDesignLab } from "~/pages/lesson-design-lab";

export const Route = createFileRoute("/lab/lesson")({
  head: () => ({
    meta: [
      { title: "Образец учебной страницы — infraege" },
      { name: "robots", content: "noindex,nofollow" },
      {
        name: "description",
        content:
          "Лабораторный образец чтения, навигации и практики урока infraege.",
      },
    ],
  }),
  component: LessonDesignLab,
});
