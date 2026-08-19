import { Link } from "@tanstack/react-router";
import styles from "./public-footer.module.css";

type Props = {
  seamless?: boolean;
};

export const PublicFooter: React.FC<Props> = ({ seamless = false }) => (
  <footer className={styles.root} data-seamless={seamless || undefined}>
    <span>infraege</span>
    <Link to="/privacy">Обработка данных</Link>
  </footer>
);
