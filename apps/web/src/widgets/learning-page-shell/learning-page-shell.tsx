import { Badge, Group } from "@mantine/core";
import { ContentBlockList } from "~/entities/content-block";
import { FragmentLink } from "~/shared/components/fragment-link";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import type { LearningPageShellTypes } from "./learning-page-shell.types";
import styles from "./learning-page-shell.module.css";

export const LearningPageShell: React.FC<LearningPageShellTypes.Props> = (
  props,
) => {
  return (
    <PageContainer size="92rem" className={styles.root}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <Typography.Text tone="muted" className={styles.overline}>
            {props.overline}
          </Typography.Text>
          <Typography.Title order={1}>{props.title}</Typography.Title>
          {props.summary && (
            <Typography.Text className={styles.summary}>
              {props.summary}
            </Typography.Text>
          )}
          <Group gap="xs" className={styles.metadata}>
            {props.metadata.map((item) => (
              <Badge
                key={item.label}
                variant="outline"
                color="gray"
                radius="xl"
              >
                {item.label}
              </Badge>
            ))}
          </Group>
        </div>
        <FragmentLink hash="practice" className={styles.practiceLink}>
          К практике <span aria-hidden="true">→</span>
        </FragmentLink>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sectionRail} aria-label="Разделы материала">
          <div className={styles.stickyRail}>
            <Typography.Text tone="muted" className={styles.railLabel}>
              В этой теме
            </Typography.Text>
            <nav>
              <ol className={styles.sectionList}>
                {props.sections.map((section, index) => (
                  <li key={section.id} className={styles.sectionItem}>
                    <FragmentLink
                      hash={section.id}
                      className={styles.sectionLink}
                    >
                      <span className={styles.sectionNumber}>{index + 1}</span>
                      <span>
                        <span className={styles.sectionName}>
                          {section.nav_label ?? section.title}
                        </span>
                        <span className={styles.sectionRole}>
                          {sectionRoleLabel(section.role)}
                        </span>
                      </span>
                    </FragmentLink>
                  </li>
                ))}
              </ol>
            </nav>
            {props.progress && (
              <div className={styles.progress}>{props.progress}</div>
            )}
          </div>
        </aside>

        <article className={styles.content}>
          {props.beforeContent}
          {props.sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className={styles.section}
            >
              <Typography.Text className={styles.sectionEyebrow}>
                § {index + 1} · {sectionRoleLabel(section.role)}
              </Typography.Text>
              <Typography.Title order={2}>{section.title}</Typography.Title>
              <ContentBlockList blocks={section.blocks} />
            </section>
          ))}
          <section id="practice" className={styles.practice}>
            {props.practice}
          </section>
          {props.afterContent}
        </article>

        {props.quickReferenceBlocks.length > 0 && (
          <aside className={styles.quickReference} aria-label="Краткая памятка">
            <div className={styles.quickReferenceCard}>
              <Typography.Text className={styles.railLabel}>
                Памятка
              </Typography.Text>
              <ContentBlockList blocks={props.quickReferenceBlocks} />
            </div>
          </aside>
        )}
      </div>
    </PageContainer>
  );
};

function sectionRoleLabel(
  role: LearningPageShellTypes.Props["sections"][number]["role"],
): string {
  const labels = {
    idea: "суть задания",
    theory: "почему это работает",
    algorithm: "порядок решения",
    pitfalls: "частые ошибки",
  } as const;
  return labels[role];
}
