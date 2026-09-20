import type { CourseTypes } from "~/entities/course";
import { Typography } from "~/shared/components/typography";
import { CourseOverviewAction } from "./course-overview-action";
import { courseOverviewModel } from "../model/course-overview-model";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import styles from "../course-overview-page.module.css";

type Props = {
  course: CourseTypes.Definition;
  overview: CourseOverviewPageTypes.Model;
};

export const CourseOverviewIntro: React.FC<Props> = (props) => (
  <>
    <header className={styles.intro}>
      <Typography.Text
        variant="interface"
        tone="muted"
        className={styles.eyebrow}
      >
        Мини-курс
      </Typography.Text>
      <Typography.Title order={1} className={styles.title}>
        {props.course.title}
      </Typography.Title>
      <Typography.Text variant="lead" tone="muted" className={styles.summary}>
        {props.course.summary}
      </Typography.Text>
      <Typography.Text variant="interface" tone="muted" className={styles.meta}>
        {courseOverviewModel.lessonCount(props.overview.lessonCount)}
        {props.overview.level ? (
          <>
            {" "}
            <span aria-hidden="true">·</span> {props.overview.level} уровень
          </>
        ) : null}
      </Typography.Text>
    </header>
    <section
      className={styles.requirements}
      aria-labelledby="course-requirements"
    >
      <Typography.Title
        order={2}
        id="course-requirements"
        className={styles.smallHeading}
      >
        Что понадобится
      </Typography.Title>
      <Typography.Text variant="interface" tone="muted">
        Компьютер с Python. Онлайн-среда — запасной вариант. Можно начать без
        опыта.
      </Typography.Text>
      <CourseOverviewAction
        courseRouteSlug={props.course.routeSlug}
        action={props.overview.action}
        modules={props.overview.modules}
      />
    </section>
  </>
);
