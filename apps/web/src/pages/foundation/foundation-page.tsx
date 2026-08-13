import styles from "./foundation-page.module.css";

export const FoundationPage: React.FC = () => (
  <main className={styles.root}>
    <Typography.Text className={styles.brand}>infraege</Typography.Text>
    <Typography.Title order={1}>Учебные материалы готовятся</Typography.Title>
    <Typography.Text>
      Публичные темы появятся после проверки содержания и учебных представлений.
    </Typography.Text>
  </main>
);
import { Typography } from "~/shared/components/typography";
