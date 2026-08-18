import { createFileRoute } from "@tanstack/react-router";
import { DesignSystemLab } from "~/pages/design-system-lab";

export const Route = createFileRoute("/lab/design-system")({
  head: () => ({
    meta: [
      { title: "Дизайн-система — стенд infraege" },
      { name: "robots", content: "noindex,nofollow" },
      {
        name: "description",
        content:
          "Приватный стенд текущей дизайн-системы: токены, типографика и переиспользуемые компоненты уроков.",
      },
    ],
  }),
  component: DesignSystemLab,
});
