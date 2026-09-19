import { ChevronDown } from "lucide-react";
import { ActionLink } from "~/shared/components/action-link";
import type { PracticeTaskWidgetTypes } from "../practice-task.types";
import styles from "../practice-task.module.css";

export const PracticeTheory: React.FC<{
  links: PracticeTaskWidgetTypes.Props["links"];
}> = (props) => {
  if (!props.links.length) return null;
  return (
    <nav className={styles.catalogTheory} aria-label="Теория к задаче">
      {props.links.length === 1 ? (
        <ActionLink to={props.links[0].href}>Теория</ActionLink>
      ) : (
        <details>
          <summary>
            Теория <ChevronDown size={16} aria-hidden="true" />
          </summary>
          <div className={styles.theoryOptions}>
            {props.links.map((link) => (
              <ActionLink key={link.href} to={link.href}>
                {link.label}
              </ActionLink>
            ))}
          </div>
        </details>
      )}
    </nav>
  );
};
