import { InfoPopover } from "~/shared/components/info-popover";
import { PythonCourseLessonLink } from "./python-course-lesson-link";
import { pythonTerms, type PythonTermKey } from "./python-terms";
import styles from "./python-term.module.css";

type Props = {
  term: PythonTermKey;
  children: React.ReactNode;
};

/**
 * A Python basic that topic lessons do not re-explain (Change 171): the term
 * itself, underlined with dots, opens a short explanation with a link to the
 * Python course lesson.
 */
export const PythonTerm: React.FC<Props> = (props) => {
  const entry = pythonTerms[props.term];
  return (
    <span data-python-term={props.term}>
      <InfoPopover
        label={`Что это: ${entry.title}`}
        closeLabel="Закрыть"
        inline
        trigger={props.children}
      >
        <span className={styles.title}>{entry.title}</span>
        <span className={styles.body}>{entry.body}</span>
        <span className={styles.course}>Курс Python: {entry.lessonTitle}</span>
        <span className={styles.link}>
          <PythonCourseLessonLink lessonSlug={entry.lessonSlug}>
            Читать урок →
          </PythonCourseLessonLink>
        </span>
      </InfoPopover>
    </span>
  );
};
