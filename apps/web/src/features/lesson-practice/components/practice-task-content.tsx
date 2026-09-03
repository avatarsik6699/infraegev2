import { Download, FileText } from "lucide-react";
import type { ReactNode } from "react";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { Callout } from "~/shared/components/callout";
import { CodeBlock } from "~/shared/components/code-block";
import { DownloadLink } from "~/shared/components/download-link";
import { Image } from "~/shared/components/image";
import { Typography } from "~/shared/components/typography";
import styles from "../lesson-practice.module.css";
import { PracticeInlineText } from "./practice-inline-text";

type PracticeTaskContentProps = {
  blocks: readonly PracticeTaskTypes.ContentBlock[];
  context: "statement" | "hint" | "solution";
};

export const PracticeTaskContent: React.FC<PracticeTaskContentProps> = (
  props,
) => (
  <div className={styles.taskContent} data-content-context={props.context}>
    {props.blocks.map((block, index) =>
      renderContentBlock(block, `${block.type}-${index}`),
    )}
  </div>
);

function renderContentBlock(
  block: PracticeTaskTypes.ContentBlock,
  key: string,
): ReactNode {
  switch (block.type) {
    case "text":
      return (
        <Typography.Text key={key} className={styles.contentText}>
          <PracticeInlineText text={block.text} />
        </Typography.Text>
      );
    case "list": {
      const List = block.style === "ordered" ? "ol" : "ul";
      return (
        <List key={key} className={styles.contentList}>
          {block.items.map((item, index) => (
            <li key={`${index}-${item}`}>
              <PracticeInlineText text={item} />
            </li>
          ))}
        </List>
      );
    }
    case "code":
      return (
        <div key={key} className={styles.contentCode}>
          {block.caption ? (
            <Typography.Text className={styles.contentCaption}>
              {block.caption}
            </Typography.Text>
          ) : null}
          <CodeBlock
            code={block.code}
            language={block.language}
            label={block.caption ?? "Фрагмент задания"}
          />
        </div>
      );
    case "table":
      return (
        <div
          key={key}
          className={styles.contentTableViewport}
          role="region"
          aria-label={block.caption ?? "Данные задания"}
          tabIndex={0}
        >
          <table className={styles.contentTable}>
            {block.caption ? <caption>{block.caption}</caption> : null}
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header} scope="col">
                    <PracticeInlineText text={header} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>
                      <PracticeInlineText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "image":
      return (
        <figure key={key} className={styles.contentFigure}>
          <Image
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            fit="contain"
          />
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case "diagram":
      return (
        <figure key={key} className={styles.contentFigure}>
          <Image
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            fit="contain"
          />
          <figcaption>{block.caption}</figcaption>
          <div className={styles.diagramDescription}>
            <Typography.Text>
              <strong>Зачем смотреть:</strong> {block.purpose}
            </Typography.Text>
            <Typography.Text>{block.accessibleDescription}</Typography.Text>
            <dl>
              {block.pointers.map((pointer) => (
                <div key={pointer.label}>
                  <dt>{pointer.label}</dt>
                  <dd>{pointer.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </figure>
      );
    case "attachment":
      return (
        <DownloadLink
          key={key}
          className={styles.contentAttachment}
          href={block.src}
        >
          <FileText aria-hidden="true" strokeWidth={1.8} />
          <span className={styles.attachmentCopy}>
            <strong>{block.label}</strong>
            <span>{block.description}</span>
            <span className={styles.attachmentMeta}>
              {block.mimeType} · {formatFileSize(block.sizeBytes)}
            </span>
          </span>
          <Download aria-hidden="true" strokeWidth={1.8} />
        </DownloadLink>
      );
    case "callout":
      return (
        <Callout
          key={key}
          density="dense"
          tone={block.tone}
          title="Обратите внимание"
        >
          <PracticeInlineText text={block.text} />
        </Callout>
      );
    case "steps":
      return (
        <div key={key} className={styles.contentSteps}>
          <Typography.Text>
            <PracticeInlineText text={block.prompt} />
          </Typography.Text>
          <ol>
            {block.steps.map((step, index) => (
              <li key={`${index}-${step}`}>
                <PracticeInlineText text={step} />
              </li>
            ))}
          </ol>
        </div>
      );
  }
}

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) return `${sizeBytes} Б`;
  const sizeKilobytes = sizeBytes / 1024;
  if (sizeKilobytes < 1024) return `${sizeKilobytes.toFixed(1)} КБ`;
  return `${(sizeKilobytes / 1024).toFixed(1)} МБ`;
}
