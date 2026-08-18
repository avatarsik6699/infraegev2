import { Badge } from "~/shared/components/badge";
import { Typography } from "~/shared/components/typography";
import styles from "../lesson-design-lab.module.css";

export const LessonIntro: React.FC = () => (
  <div className={styles.intro} data-lesson-intro>
    <div className={styles.chips} aria-label="Сведения об уроке">
      <Badge>№12</Badge>
      <Badge tone="accent">Средняя</Badge>
      <Badge>~7 мин</Badge>
      <Badge>1 балл</Badge>
      <Badge>алгоритмы</Badge>
      <Badge>проверка кода</Badge>
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
