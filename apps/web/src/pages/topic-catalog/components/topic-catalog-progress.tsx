import { Progress } from "~/shared/components/progress";
import type { TopicCatalogPageTypes } from "../topic-catalog-page.types";
import { topicCatalogModel } from "../model/topic-catalog-model";
import styles from "../topic-catalog-page.module.css";

type Props = {
  progress?: TopicCatalogPageTypes.Progress;
  loadState: TopicCatalogPageTypes.LoadState;
  title: string;
};

export const TopicCatalogProgress: React.FC<Props> = (props) => (
  <div className={styles.progressSlot} data-topic-progress>
    <span className={styles.metadata}>
      {props.progress
        ? `Теория · ${topicCatalogModel.taskCount(props.progress.total)}`
        : "Теория"}
    </span>
    <div className={styles.personalProgress}>
      {props.progress ? (
        <>
          <span className={styles.progressStatus}>
            {topicCatalogModel.progressStatus(props.progress)}
          </span>
          <span>
            Решено {props.progress.solved} из {props.progress.total}
          </span>
          <Progress
            className={styles.progress}
            value={props.progress.solved}
            max={props.progress.total}
            label={`Практика: ${props.title}`}
            valueText={`Решено ${String(props.progress.solved)} из ${String(props.progress.total)} задач`}
          />
        </>
      ) : (
        <span className={styles.progressStatus}>
          {props.loadState === "loading"
            ? "Прогресс загружается"
            : "Прогресс недоступен"}
        </span>
      )}
    </div>
  </div>
);
