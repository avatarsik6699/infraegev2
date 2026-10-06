import { ActionLink } from "~/shared/components/action-link";
import styles from "../practice-task-page.module.css";

/** F32: a quiet text link that sits before the topic label. */
export const PracticeBackLink: React.FC<{ href: string }> = (props) => (
  <ActionLink
    to={props.href}
    icon="back"
    presentation="navigation"
    className={styles.back}
  >
    К списку задач
  </ActionLink>
);
