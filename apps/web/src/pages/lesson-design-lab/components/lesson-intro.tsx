import { Badge } from "@mantine/core";
import { Typography } from "~/shared/components/typography";
import styles from "../lesson-design-lab.module.css";

export const LessonIntro: React.FC = () => (
  <div className={styles.intro} data-lesson-intro>
    <div className={styles.chips} aria-label="Сведения об уроке">
      <Badge variant="outline">№12</Badge>
      <Badge className={styles.accentChip}>Средняя</Badge>
      <Badge variant="outline">~7 мин</Badge>
      <Badge variant="outline">1 балл</Badge>
      <Badge variant="outline">алгоритмы</Badge>
      <Badge variant="outline">проверка кода</Badge>
    </div>
    <Typography.Title order={1}>
      Почему двоичный поиск отбрасывает половину вариантов
    </Typography.Title>
    <Typography.Text className={styles.summary}>
      Двоичный поиск каждый шаг делит текущий диапазон на две части и
      гарантированно исключает одну из них из дальнейшего рассмотрения.
    </Typography.Text>
    <Typography.Text className={styles.meta}>
      2026 · демонстрационный урок · синтетический материал для дизайн-lab
    </Typography.Text>
  </div>
);
