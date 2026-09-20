import { Progress } from "~/shared/components/progress";
import type { CourseCatalogPageTypes } from "../course-catalog-page.types";
import { courseCatalogModel } from "../model/course-catalog-model";
import styles from "../course-catalog-page.module.css";

type Props = {
  progress: CourseCatalogPageTypes.Progress;
  title: string;
};

export const CourseCatalogProgress: React.FC<Props> = (props) => (
  <div className={styles.personalProgress} data-course-progress>
    <div className={styles.progressCopy}>
      <span className={styles.progressReserve} aria-hidden="true">
        {courseCatalogModel.progressText({ status: "unavailable" })}
      </span>
      <span role="status">
        {courseCatalogModel.progressText(props.progress)}
      </span>
    </div>
    {props.progress.status === "ready" && props.progress.total > 0 ? (
      <Progress
        className={styles.progress}
        value={props.progress.mastered}
        max={props.progress.total}
        label={`Освоение курса: ${props.title}`}
        valueText={courseCatalogModel.progressText(props.progress)}
      />
    ) : (
      <span className={styles.progressPlaceholder} aria-hidden="true" />
    )}
  </div>
);
