import { useRef } from "react";
import { ActionLink } from "~/shared/components/action-link";
import { Badge } from "~/shared/components/badge";
import { Image } from "~/shared/components/image";
import {
  SurfaceMaterial,
  SurfaceGlint,
} from "~/shared/components/surface-decoration";
import { Typography } from "~/shared/components/typography";
import { useElementActivity } from "~/shared/lib/element-activity";
import { VisualLanguageField } from "./visual-language-field";
import styles from "./visual-language-specimen.module.css";

type Props = { planned?: boolean };

export const VisualLanguageCard: React.FC<Props> = (props) => {
  const ref = useRef<HTMLElement>(null);
  const active = useElementActivity(ref);
  return (
    <article
      ref={ref}
      className={styles.card}
      data-visual-example={props.planned ? "planned" : "available"}
    >
      <SurfaceMaterial
        className={props.planned ? styles.quietMaterial : undefined}
      >
        <VisualLanguageField />
      </SurfaceMaterial>
      {!props.planned ? (
        <SurfaceGlint kind="frame" active={active} className={styles.frame} />
      ) : null}
      <div className={styles.media}>
        <Image
          layout="fill"
          src={
            props.planned
              ? "/images/course-overview/branch.webp"
              : "/images/course-overview/sequence.webp"
          }
          width={1536}
          height={1024}
          decorative
          fit="contain"
          className={styles.illustration}
        />
      </div>
      <div className={styles.copy}>
        {props.planned ? <Badge>Скоро</Badge> : null}
        <Typography.Title order={4}>
          {props.planned
            ? "Алгоритмы и структуры данных"
            : "Python с нуля для ЕГЭ"}
        </Typography.Title>
        <Typography.Text tone="muted">
          {props.planned
            ? "Направление в плане. Изображение и поверхность сохраняют объём; действия появятся вместе с курсом."
            : "От первой программы — к задачам и алгоритмам, которые пригодятся на ЕГЭ."}
        </Typography.Text>
      </div>
      {!props.planned ? (
        <div className={styles.footer}>
          <ActionLink
            hierarchy="drawn"
            icon="forward"
            to="/courses/$courseSlug"
            params={{ courseSlug: "python" }}
          >
            Открыть курс
          </ActionLink>
        </div>
      ) : null}
    </article>
  );
};
