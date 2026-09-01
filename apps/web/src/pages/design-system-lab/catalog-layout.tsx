import type { ReactNode } from "react";
import { FragmentLink } from "~/shared/components/fragment-link";
import { Typography } from "~/shared/components/typography";
import styles from "./design-system-lab.module.css";

type CatalogSection = {
  id: string;
  label: string;
};

type CatalogLayoutProps = {
  title: string;
  description: string;
  sections: readonly CatalogSection[];
  children: ReactNode;
};

export const CatalogLayout: React.FC<CatalogLayoutProps> = ({
  title,
  description,
  sections,
  children,
}) => (
  <div className={styles.catalogView}>
    <header className={styles.catalogHeading}>
      <Typography.Title order={2} className={styles.sectionHeading}>
        {title}
      </Typography.Title>
      <Typography.Text
        className={styles.paletteDescription}
        data-alchimia-reading
      >
        {description}
      </Typography.Text>
    </header>
    <div className={styles.catalogLayout}>
      <nav
        className={styles.catalogNavigation}
        aria-label={`Разделы: ${title}`}
        data-catalog-navigation
      >
        <Typography.Text className={styles.catalogNavigationTitle}>
          В этом разделе
        </Typography.Text>
        <ol className={styles.catalogNavigationList}>
          {sections.map((section) => (
            <li key={section.id}>
              <FragmentLink
                className={styles.catalogNavigationLink}
                hash={section.id}
                icon={false}
              >
                {section.label}
              </FragmentLink>
            </li>
          ))}
        </ol>
      </nav>
      <div className={styles.catalogCanvas} data-catalog-canvas>
        {children}
      </div>
    </div>
  </div>
);
