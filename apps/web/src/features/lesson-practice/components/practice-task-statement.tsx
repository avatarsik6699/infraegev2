import { Fragment } from "react";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import styles from "../lesson-practice.module.css";

type Props = {
  statement: string;
};

export const PracticeTaskStatement: React.FC<Props> = (props) => (
  <Typography.Text className={styles.taskStatement} data-practice-statement>
    {props.statement.split(/(`[^`]+`)/g).map((fragment, index) => {
      const isCode = fragment.startsWith("`") && fragment.endsWith("`");
      return (
        <Fragment key={`${index}-${fragment}`}>
          {isCode ? <Notation>{fragment.slice(1, -1)}</Notation> : fragment}
        </Fragment>
      );
    })}
  </Typography.Text>
);
