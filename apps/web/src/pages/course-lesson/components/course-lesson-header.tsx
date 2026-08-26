import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Typography } from "~/shared/components/typography";
import { PublicHeader } from "~/widgets/public-header";
import styles from "../course-lesson-page.module.css";

type Props = {
  courseRouteSlug: string;
  courseTitle: string;
  lessonTitle: string;
};

export const CourseLessonHeader: React.FC<Props> = (props) => (
  <>
    <PublicHeader />
    <div className={styles.contextBar} data-course-lesson-context>
      <div className={styles.contextArea}>
        <Link
          className={styles.courseBackLink}
          to="/courses/$courseSlug"
          params={{ courseSlug: props.courseRouteSlug }}
        >
          <ArrowLeft aria-hidden="true" size={17} strokeWidth={1.8} />
          <span>К курсу</span>
        </Link>
      </div>
      <Typography.Text className={styles.contextLesson}>
        {props.courseTitle + " · " + props.lessonTitle}
      </Typography.Text>
    </div>
  </>
);
