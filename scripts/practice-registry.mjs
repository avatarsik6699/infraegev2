// Release-owned material IDs and section anchors. Generated output is never authored separately.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { lessonPublications } from "../apps/web/src/shared/config/lesson-publication.mjs";
import { courseLessonPublications } from "../apps/web/src/entities/course/content/course-publication.mjs";

const materials = [];
for (const [kind, publications] of [
  ["lesson", lessonPublications],
  ["course", courseLessonPublications],
]) {
  for (const publication of publications) {
    const source = readFileSync(
      new URL(
        `../apps/web/src/entities/${kind}/content/${publication.id}.lesson.tsx`,
        import.meta.url,
      ),
      "utf8",
    );
    // Current authored shape is literal id immediately before literal navLabel. A shape change
    // fails closed and requires updating this extractor; checkpoints are not section anchors.
    const sections = [
      ...source.matchAll(/\bid:\s*"([a-z0-9-]+)",\s*navLabel:\s*"/g),
    ].map((match) => match[1]);
    if (
      !sections.length ||
      sections.length !== [...source.matchAll(/\bnavLabel\s*:/g)].length
    ) {
      throw new Error(`Unsupported concept shape: ${publication.id}`);
    }
    materials.push({ id: publication.id, sections });
  }
}
materials.sort((a, b) => a.id.localeCompare(b.id, "en"));
const output = JSON.stringify({ format: 1, materials }, null, 2) + "\n";
const target = fileURLToPath(
  new URL("../apps/api/practice-registry.json", import.meta.url),
);
if (process.argv.includes("--check")) {
  if (
    JSON.stringify(JSON.parse(readFileSync(target, "utf8"))) !==
    JSON.stringify(JSON.parse(output))
  )
    throw new Error(
      "Practice registry drift; run node scripts/practice-registry.mjs",
    );
} else {
  writeFileSync(target, output);
}
