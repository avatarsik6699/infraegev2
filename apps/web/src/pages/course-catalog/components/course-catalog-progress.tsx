import { Progress } from "~/shared/components/progress";
import { useAccountSession } from "~/features/account";
import { GuestProgressLoginLock } from "~/features/lesson-progress";
import type { CourseCatalogPageTypes } from "../course-catalog-page.types";
import { courseCatalogModel } from "../model/course-catalog-model";
import styles from "../course-catalog-page.module.css";

type Props = {
  progress: CourseCatalogPageTypes.Progress;
  total: number;
  title: string;
};

export const CourseCatalogProgress: React.FC<Props> = (props) => {
  const session = useAccountSession();
  const isGuest = session.status === "ready" && !session.account;
  let progress = props.progress;
  if (isGuest) progress = { status: "ready", mastered: 0, total: props.total };
  return (
    <GuestProgressLoginLock enabled={isGuest} total={props.total}>
      <div className={styles.personalProgress} data-course-progress>
        <div className={styles.progressCopy}>
          <span className={styles.progressReserve} aria-hidden="true">
            {courseCatalogModel.progressText({ status: "unavailable" })}
          </span>
          <span role="status">{courseCatalogModel.progressText(progress)}</span>
        </div>
        {progress.status === "ready" && progress.total > 0 ? (
          <Progress
            className={styles.progress}
            value={progress.mastered}
            max={progress.total}
            label={`Освоение курса: ${props.title}`}
            valueText={courseCatalogModel.progressText(progress)}
          />
        ) : (
          <span className={styles.progressPlaceholder} aria-hidden="true" />
        )}
      </div>
    </GuestProgressLoginLock>
  );
};
