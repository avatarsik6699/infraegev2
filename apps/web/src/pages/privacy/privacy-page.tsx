import { Stack } from "@mantine/core";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import type { PrivacyPageTypes } from "./privacy-page.types";

/** Required by 152-ФЗ whenever personal data (including IP addresses via analytics/Nginx logs)
 * is processed — docs/SPEC.md §8. Placeholder copy pending legal review (docs/SPEC.md §11). */
export const PrivacyPage: React.FC<PrivacyPageTypes.Props> = () => {
  return (
    <PageContainer>
      <Stack gap="md">
        <Typography.Title order={1}>
          Политика обработки персональных данных
        </Typography.Title>
        <Typography.Text>
          [Черновик — требует юридического ревью перед публичным запуском,
          docs/SPEC.md §8/§11.]
        </Typography.Text>
      </Stack>
    </PageContainer>
  );
};
