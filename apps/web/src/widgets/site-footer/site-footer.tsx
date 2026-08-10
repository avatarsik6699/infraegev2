import { Stack } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { env } from "~/shared/config/env";
import { ExternalLink } from "~/shared/components/external-link";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import styles from "./site-footer.module.css";
import type { SiteFooterTypes } from "./site-footer.types";

/** Feedback and legal navigation. Automated alerting is deliberately separate. */
export const SiteFooter: React.FC<SiteFooterTypes.Props> = () => {
  return (
    <PageContainer component="footer" className={styles.root}>
      <Stack gap="xs">
        <Typography.Text>
          <ExternalLink href={env.client.feedbackUrl} newTab>
            Сообщить о проблеме
          </ExternalLink>
        </Typography.Text>
        <Typography.Text>
          <Link to="/privacy">Политика обработки персональных данных</Link>
          {" · "}
          <Link to="/terms">Пользовательское соглашение</Link>
        </Typography.Text>
      </Stack>
    </PageContainer>
  );
};
