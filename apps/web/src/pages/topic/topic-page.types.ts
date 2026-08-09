import type { ResolvedContentLink, Task, Topic } from "~/entities/content";

export namespace TopicPageTypes {
  export type Props = {
    topic: Topic;
    tasks: Task[];
    prerequisites: ResolvedContentLink[];
    related: ResolvedContentLink[];
  };
}
