import { existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const IMAGE_MAX_BYTES = 2 * 1024 * 1024;
const ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024;
const ATTACHMENT_MIME_TYPES = new Map([
  [".txt", "text/plain"],
  [".csv", "text/csv"],
  [".json", "application/json"],
  [".py", "text/x-python"],
  [".zip", "application/zip"],
]);

export function validateTaskContentAssets({
  file,
  taskId,
  field,
  blocks,
  publicRoot,
}) {
  const errors = [];
  const expectedPrefix = `/content/tasks/${taskId}/`;
  for (const [index, block] of (blocks ?? []).entries()) {
    const blockField = `${field}[${index}]`;
    if (block?.type === "image" || block?.type === "diagram") {
      validateImage({
        errors,
        file,
        expectedPrefix,
        field: blockField,
        data: block.data ?? {},
        publicRoot,
        isDiagram: block.type === "diagram",
      });
    }
    if (block?.type === "attachment") {
      validateAttachment({
        errors,
        file,
        expectedPrefix,
        field: blockField,
        data: block.data ?? {},
        publicRoot,
      });
    }
  }
  return errors;
}

function validateImage(args) {
  if (
    !isSafeOwnedSource(
      args.data.src,
      args.expectedPrefix,
      /\.(png|webp|avif)$/i,
    )
  ) {
    args.errors.push(
      `${args.file}: ${args.field}.data.src must be a local PNG/WebP/AVIF under "${args.expectedPrefix}" without traversal, query or hash`,
    );
    return;
  }
  checkPositiveDimension(args, "width", args.data.width);
  checkPositiveDimension(args, "height", args.data.height);
  if (!nonEmptyString(args.data.alt) || !nonEmptyString(args.data.caption)) {
    args.errors.push(
      `${args.file}: ${args.field} needs non-empty alt and caption`,
    );
  }
  if (
    args.isDiagram &&
    (!nonEmptyString(args.data.purpose) ||
      !nonEmptyString(args.data.accessible_description) ||
      !Array.isArray(args.data.pointers) ||
      args.data.pointers.length === 0)
  ) {
    args.errors.push(
      `${args.file}: ${args.field} diagram needs purpose, accessible_description and pointers`,
    );
  } else if (
    args.isDiagram &&
    args.data.pointers.some(
      (pointer) =>
        !nonEmptyString(pointer?.label) ||
        !nonEmptyString(pointer?.description),
    )
  ) {
    args.errors.push(
      `${args.file}: ${args.field} diagram pointers need non-empty label and description`,
    );
  }
  checkOwnedFile(args, args.data.src, IMAGE_MAX_BYTES);
}

function validateAttachment(args) {
  if (
    !isSafeOwnedSource(
      args.data.src,
      args.expectedPrefix,
      /\.(txt|csv|json|py|zip)$/i,
    )
  ) {
    args.errors.push(
      `${args.file}: ${args.field}.data.src must be a local TXT/CSV/JSON/PY/ZIP under "${args.expectedPrefix}" without traversal, query or hash`,
    );
    return;
  }
  const extension = extname(args.data.src).toLowerCase();
  const expectedMime = ATTACHMENT_MIME_TYPES.get(extension);
  if (args.data.mime_type !== expectedMime) {
    args.errors.push(
      `${args.file}: ${args.field}.data.mime_type must be "${expectedMime}" for ${extension}`,
    );
  }
  if (
    !nonEmptyString(args.data.label) ||
    !nonEmptyString(args.data.description)
  ) {
    args.errors.push(
      `${args.file}: ${args.field} needs a non-empty label and description`,
    );
  }
  const assetPath = checkOwnedFile(args, args.data.src, ATTACHMENT_MAX_BYTES);
  if (assetPath && args.data.size_bytes !== statSync(assetPath).size) {
    args.errors.push(
      `${args.file}: ${args.field}.data.size_bytes must match the file size (${statSync(assetPath).size})`,
    );
  }
}

function isSafeOwnedSource(source, expectedPrefix, extensionPattern) {
  return (
    typeof source === "string" &&
    source.startsWith(expectedPrefix) &&
    !source.includes("..") &&
    !source.includes("?") &&
    !source.includes("#") &&
    !source.includes("\\") &&
    !source.includes("%") &&
    extensionPattern.test(source)
  );
}

function checkOwnedFile(args, source, maxBytes) {
  const assetPath = join(args.publicRoot, source.slice(1));
  if (!existsSync(assetPath)) {
    args.errors.push(
      `${args.file}: ${args.field}.data.src does not exist: ${source}`,
    );
    return null;
  }
  const size = statSync(assetPath).size;
  if (size > maxBytes) {
    args.errors.push(
      `${args.file}: ${args.field}.data.src exceeds ${maxBytes} bytes`,
    );
  }
  return assetPath;
}

function checkPositiveDimension(args, dimension, value) {
  if (Number.isInteger(value) && value > 0) return;
  args.errors.push(
    `${args.file}: ${args.field}.data.${dimension} must be a positive integer`,
  );
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
