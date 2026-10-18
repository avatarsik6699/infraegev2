import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { legalBlocks } from "./model/legal-documents";
import styles from "./legal-page.module.css";

type Props = {
  markdown: string;
  /** Under the title: the edition and links to other editions. */
  aside?: React.ReactNode;
};

/** A legal text page (Change 192): the privacy page's reading layout. */
export const LegalDocument: React.FC<Props> = (props) => {
  const blocks = legalBlocks(props.markdown);
  const title = blocks.find((block) => block.kind === "title");
  return (
    <div className={styles.page}>
      <PublicHeader />
      <PageContainer component="main" measure="reading" className={styles.root}>
        <Typography.Title order={1}>{title?.text}</Typography.Title>
        {props.aside}
        <Typography.Prose className={styles.content}>
          {blocks.map((block, index) => {
            if (block.kind === "title") return null;
            return block.kind === "heading" ? (
              <Typography.Title key={index} order={2}>
                {block.text}
              </Typography.Title>
            ) : (
              <Typography.Text key={index}>{block.text}</Typography.Text>
            );
          })}
        </Typography.Prose>
      </PageContainer>
      <PublicFooter />
    </div>
  );
};
