import { Stack } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { env } from "~/shared/config/env";
import { ExternalLink } from "~/shared/components/external-link";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import styles from "./site-footer.module.css";
import type { SiteFooterTypes } from "./site-footer.types";

/**
 * Feedback link + age marking, per docs/SPEC.md §5.2/§8. No feedback form — a Telegram/VK link
 * is zero-cost and reuses the same channel monitoring alerts land in (docs/SPEC.md §7.2).
 */
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
        {/* 436-ФЗ marking — exact category still needs a lawyer, see docs/SPEC.md §11. */}
        <Typography.Text component="span" ariaLabel="Возрастная маркировка">
          12+
        </Typography.Text>
      </Stack>
    </PageContainer>
  );
};
