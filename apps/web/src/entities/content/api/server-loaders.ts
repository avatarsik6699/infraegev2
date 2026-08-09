/**
 * Server-only content access (docs/SPEC.md §3/§5.1). Filesystem imports and `createServerFn`
 * calls are co-located in this one file deliberately, matching TanStack Start's documented
 * pattern — the compiler strips a `createServerFn` handler's body from the client bundle per
 * file; splitting the fs code into a separately-imported module defeated that stripping and
 * broke the client build ("node:fs has been externalized for browser compatibility").
 */
import { createServerFn } from "@tanstack/react-start";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  ContentNotFoundError,
  type ResolvedContentLink,
} from "../lib/content-link";
import type { Course, Task, Topic } from "../model/types";

// content/ lives at the repo root, not inside apps/web — this is a monorepo, not a single-package
// project. `__CONTENT_ROOT__` is baked in at build time by vite.config.ts (see its comment) since
// this module's own location moves once bundled into .output/server/, which would break a runtime-
// relative path computed from `import.meta.dirname` here. Content only changes through a deploy
// (docs/SPEC.md §2.2), so no runtime invalidation is needed.
declare const __CONTENT_ROOT__: string;
const CONTENT_ROOT = __CONTENT_ROOT__;

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

export const loadTopic = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }): Promise<Topic> => {
    const path = join(CONTENT_ROOT, "topics", `${id}.json`);
    try {
      return readJson<Topic>(path);
    } catch {
      throw new ContentNotFoundError(`Topic not found: ${id}`);
    }
  });

export const loadTask = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }): Promise<Task> => {
    const path = join(CONTENT_ROOT, "tasks", `${id}.json`);
    try {
      return readJson<Task>(path);
    } catch {
      throw new ContentNotFoundError(`Task not found: ${id}`);
    }
  });

export const loadCourse = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }): Promise<Course> => {
    const path = join(CONTENT_ROOT, "courses", `${id}.json`);
    try {
      return readJson<Course>(path);
    } catch {
      throw new ContentNotFoundError(`Course not found: ${id}`);
    }
  });

export const listPublishedTopics = createServerFn({ method: "GET" }).handler(
  async (): Promise<Topic[]> => {
    const dir = join(CONTENT_ROOT, "topics");
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => readJson<Topic>(join(dir, f)))
      .filter((topic) => topic.status === "published");
  },
);

/**
 * `prerequisites`/`related_topics`/`unlocks_topics` store a bare `topic_id | course_lesson_id`
 * (docs/SPEC.md §3) — resolving it to a route requires knowing which kind it is (a topic needs its
 * `task_numbers[0]` to build `/theory/zadanie-{n}-{slug}`; a lesson needs its `course_id`).
 */
export const resolveContentLink = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }): Promise<ResolvedContentLink | null> => {
    const topicPath = join(CONTENT_ROOT, "topics", `${id}.json`);
    if (existsSync(topicPath)) {
      const topic = readJson<Topic>(topicPath);
      return {
        id,
        title: topic.title,
        href: `/theory/zadanie-${topic.task_numbers[0]}-${topic.id}`,
      };
    }

    const coursesDir = join(CONTENT_ROOT, "courses");
    for (const file of readdirSync(coursesDir).filter((f) =>
      f.endsWith(".json"),
    )) {
      const course = readJson<Course>(join(coursesDir, file));
      const lesson = course.lessons.find((l) => l.id === id);
      if (lesson) {
        return {
          id,
          title: lesson.title,
          href: `/course/${course.id}/${lesson.id}`,
        };
      }
    }

    return null;
  });
