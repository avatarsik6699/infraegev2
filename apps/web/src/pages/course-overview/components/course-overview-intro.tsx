import type { CourseTypes } from "~/entities/course";
import { FragmentLink } from "~/shared/components/fragment-link";
import { Typography } from "~/shared/components/typography";
import { CourseOverviewAction } from "./course-overview-action";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import styles from "../course-overview-page.module.css";

type Props = {
  course: CourseTypes.Definition;
  overview: CourseOverviewPageTypes.Model;
};

export const CourseOverviewIntro: React.FC<Props> = (props) => (
  <header className={styles.intro}>
    <Typography.Text variant="interface" className={styles.eyebrow}>
      Мини-курс
      {props.overview.level
        ? ` · ${props.overview.level.toLocaleLowerCase("ru")} уровень`
        : ""}
    </Typography.Text>
    <Typography.Title order={1} className={styles.title}>
      {props.course.title}
    </Typography.Title>
    <Typography.Text variant="lead" className={styles.summary}>
      {props.course.summary}
    </Typography.Text>
  </header>
);

export const CourseOverviewActions: React.FC<Props> = (props) => (
  <div className={styles.actions}>
    <CourseOverviewAction
      courseRouteSlug={props.course.routeSlug}
      action={props.overview.action}
      modules={props.overview.modules}
    />
    <FragmentLink
      hash="course-curriculum"
      presentation="action"
      hierarchy="text"
      icon={false}
      className={styles.programLink}
    >
      К программе курса ↓
    </FragmentLink>
  </div>
);

export const CourseOverviewFacts: React.FC = () => (
  <div className={styles.facts}>
    <section className={styles.fact} aria-labelledby="course-requirements">
      <Typography.Title
        order={2}
        id="course-requirements"
        className={styles.factTitle}
      >
        Что понадобится
      </Typography.Title>
      <Typography.Text tone="muted">
        Компьютер с Python. Онлайн-среда — запасной вариант. Можно начать без
        опыта.
      </Typography.Text>
    </section>
    <section className={styles.fact} aria-labelledby="course-format">
      <Typography.Title
        order={2}
        id="course-format"
        className={styles.factTitle}
      >
        Как идёт курс
      </Typography.Title>
      <Typography.Text tone="muted">
        Каждый урок: объяснение, разобранный пример и практика. Прогресс
        сохраняется в аккаунте.
      </Typography.Text>
    </section>
  </div>
);
