import { Progress } from "~/shared/components/progress";
import { useAccountSession } from "~/features/account";
import { GuestProgressLoginLock } from "~/features/lesson-progress";
import type { TopicCatalogPageTypes } from "../topic-catalog-page.types";
import { topicCatalogModel } from "../model/topic-catalog-model";
import styles from "../topic-catalog-page.module.css";

type Props = {
  progress?: TopicCatalogPageTypes.Progress;
  loadState: TopicCatalogPageTypes.LoadState;
  title: string;
};

export const TopicCatalogProgress: React.FC<Props> = (props) => (
  <TopicCatalogProgressContent {...props} />
);

const TopicCatalogProgressContent: React.FC<Props> = (props) => {
  const session = useAccountSession();
  const isGuest = session.status === "ready" && !session.account;
  let progress = props.progress;
  if (isGuest && progress) progress = { solved: 0, total: progress.total };
  return (
    <div className={styles.progressSlot} data-topic-progress>
      <span className={styles.metadata}>
        {props.progress
          ? `Теория · ${topicCatalogModel.taskCount(props.progress.total)}`
          : "Теория"}
      </span>
      <GuestProgressLoginLock
        enabled={isGuest && progress !== undefined}
        total={progress?.total ?? 0}
      >
        <div className={styles.personalProgress}>
          {progress ? (
            <>
              <span className={styles.progressStatus}>
                {topicCatalogModel.progressStatus(progress)}
              </span>
              <span>
                Решено {progress.solved} из {progress.total}
              </span>
              <Progress
                className={styles.progress}
                value={progress.solved}
                max={progress.total}
                label={`Практика: ${props.title}`}
                valueText={`Решено ${String(progress.solved)} из ${String(progress.total)} задач`}
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
      </GuestProgressLoginLock>
    </div>
  );
};
