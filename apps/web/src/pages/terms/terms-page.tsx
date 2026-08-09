import { Stack } from "@mantine/core";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import type { TermsPageTypes } from "./terms-page.types";

/** docs/SPEC.md §5.1/§13.3 — terms of use for the free service. */
export const TermsPage: React.FC<TermsPageTypes.Props> = () => {
  return (
    <PageContainer>
      <Stack gap="md">
        <Typography.Title order={1}>
          Пользовательское соглашение
        </Typography.Title>
        <Typography.Text>
          [Черновик — условия использования бесплатного сервиса, docs/SPEC.md
          §11.]
        </Typography.Text>
      </Stack>
    </PageContainer>
  );
};
