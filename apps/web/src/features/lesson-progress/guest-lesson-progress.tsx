import { GuestProgressLoginLock } from "./guest-progress-login-lock";
import { LessonProgress } from "./lesson-progress";
import styles from "./lesson-progress.module.css";

type Props = {
  headingId: string;
  headingOrder?: 2 | 3 | 4 | 5 | 6;
  masteryThreshold: number;
  total: number;
};

export const GuestLessonProgress: React.FC<Props> = (props) => {
  return (
    <GuestProgressLoginLock
      className={styles.guestLessonLocked}
      total={props.total}
    >
      <section data-guest-lesson-progress>
        <LessonProgress
          headingId={props.headingId}
          headingOrder={props.headingOrder}
          masteryThreshold={props.masteryThreshold}
          solved={0}
          total={props.total}
        />
      </section>
    </GuestProgressLoginLock>
  );
};
