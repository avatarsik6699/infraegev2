import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { validateTaskContentAssets } from "../lib/task-content-assets.mjs";

function fixture() {
  const publicRoot = mkdtempSync(join(tmpdir(), "infraege-task-assets-"));
  const taskRoot = join(publicRoot, "content", "tasks", "task-1");
  mkdirSync(taskRoot, { recursive: true });
  writeFileSync(join(taskRoot, "data.txt"), "2\n5\n3\n");
  writeFileSync(join(taskRoot, "diagram.png"), Buffer.from([0x89, 0x50]));
  return { publicRoot };
}

test("accepts task-owned image and attachment metadata", () => {
  const { publicRoot } = fixture();
  const errors = validateTaskContentAssets({
    file: "task-1.json",
    taskId: "task-1",
    field: "statement",
    publicRoot,
    blocks: [
      {
        type: "diagram",
        data: {
          src: "/content/tasks/task-1/diagram.png",
          alt: "Схема",
          caption: "Подпись",
          width: 640,
          height: 360,
          purpose: "Показать связь",
          accessible_description: "Первый шаг ведёт ко второму",
          pointers: [{ label: "Шаг", description: "Начало" }],
        },
      },
      {
        type: "attachment",
        data: {
          src: "/content/tasks/task-1/data.txt",
          label: "data.txt",
          description: "Данные",
          mime_type: "text/plain",
          size_bytes: 6,
        },
      },
    ],
  });

  assert.deepEqual(errors, []);
});

test("rejects unsafe paths, invalid metadata and size drift", () => {
  const { publicRoot } = fixture();
  const errors = validateTaskContentAssets({
    file: "task-1.json",
    taskId: "task-1",
    field: "hint",
    publicRoot,
    blocks: [
      {
        type: "image",
        data: {
          src: "/content/tasks/other/diagram.png?raw=1",
          alt: "Схема",
          caption: "Подпись",
          width: 640,
          height: 360,
        },
      },
      {
        type: "image",
        data: {
          src: "/content/tasks/task-1/diagram.png",
          alt: "",
          caption: "",
          width: 0,
          height: 0,
        },
      },
      {
        type: "attachment",
        data: {
          src: "/content/tasks/task-1/data.txt",
          label: "",
          description: "",
          mime_type: "application/json",
          size_bytes: 99,
        },
      },
      {
        type: "diagram",
        data: {
          src: "/content/tasks/task-1/diagram.png",
          alt: "Схема",
          caption: "Подпись",
          width: 640,
          height: 360,
          purpose: "Показать связь",
          accessible_description: "Описание",
          pointers: [{ label: "", description: "" }],
        },
      },
    ],
  });

  assert.equal(errors.length, 8);
  assert.match(errors.join("\n"), /without traversal, query or hash/);
  assert.match(errors.join("\n"), /mime_type/);
  assert.match(errors.join("\n"), /positive integer/);
  assert.match(errors.join("\n"), /non-empty alt and caption/);
  assert.match(errors.join("\n"), /non-empty label and description/);
  assert.match(errors.join("\n"), /size_bytes must match/);
  assert.match(errors.join("\n"), /diagram pointers need non-empty/);
});
