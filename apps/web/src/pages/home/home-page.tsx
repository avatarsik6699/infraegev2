import { Badge, Stack } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "~/shared/components/empty-state";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import styles from "./home-page.module.css";
import type { HomePageTypes } from "./home-page.types";

export const HomePage: React.FC<HomePageTypes.Props> = (props) => {
  return (
    <PageContainer>
      <Stack gap="lg">
        <Typography.Title order={1}>
          Подготовка к ЕГЭ по информатике
        </Typography.Title>
        {/* No full-site search on M0 — plain navigation by task number is enough while there are
          fewer than ten topics (docs/SPEC.md §10). */}
        {props.topics.length === 0 ? (
          <EmptyState
            title="Темы готовятся к публикации"
            description="Загляните позже: здесь появятся проверенные материалы и практика."
          />
        ) : (
          <ul className={styles.topicList}>
            {props.topics.map((topic) => (
              <li key={topic.id}>
                <Link
                  className={styles.topicLink}
                  to="/theory/$topicSlug"
                  params={{
                    topicSlug: `zadanie-${topic.task_numbers[0]}-${topic.id}`,
                  }}
                >
                  <Badge variant="outline" className={styles.taskBadge}>
                    №{topic.task_numbers[0]}
                  </Badge>
                  {topic.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Stack>
    </PageContainer>
  );
};
