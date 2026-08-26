import type { CourseTypes } from "~/entities/course";
import styles from "../course-overview-page.module.css";
import { CourseOverviewModule } from "./course-overview-module";

type Props = {
  courseRouteSlug: string;
  lessons: readonly CourseTypes.LessonDefinition[];
  modules: readonly CourseTypes.Module[];
};

export const CourseOverviewCurriculum: React.FC<Props> = (props) => {
  const lessonsById = new Map(
    props.lessons.map((lesson) => [lesson.id, lesson]),
  );

  return (
    <section className={styles.curriculum} aria-label="Содержание курса">
      <ol className={styles.moduleList}>
        {props.modules.map((courseModule, index) => (
          <CourseOverviewModule
            courseRouteSlug={props.courseRouteSlug}
            index={index}
            key={courseModule.id}
            lessons={courseModule.lessonIds.flatMap((lessonId) => {
              const lesson = lessonsById.get(lessonId);
              return lesson ? [lesson] : [];
            })}
            module={courseModule}
          />
        ))}
      </ol>
    </section>
  );
};
