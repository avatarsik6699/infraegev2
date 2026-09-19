import { ArrowLeft } from "lucide-react";
import { ActionLink } from "~/shared/components/action-link";
import { Tooltip } from "~/shared/components/tooltip";
import styles from "../practice-task-page.module.css";

export const PracticeBackLink: React.FC<{ href: string }> = (props) => (
  <Tooltip label="К списку задач">
    <ActionLink
      to={props.href}
      icon="none"
      presentation="navigation"
      className={styles.back}
      ariaLabel="К списку задач"
    >
      <ArrowLeft size={18} aria-hidden="true" />
    </ActionLink>
  </Tooltip>
);
