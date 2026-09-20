import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/shared/components/button";
import { scrollToTop } from "~/shared/lib/scroll-to-top";
import type { ScrollToTopTypes } from "./scroll-to-top.types";
import styles from "./scroll-to-top.module.css";

export const ScrollToTop: React.FC<ScrollToTopTypes.Props> = (props) => {
  const [visible, setVisible] = useState(false);
  useEffect(function observeScrollFx() {
    return scrollToTop.observe(setVisible);
  }, []);

  return (
    <div className={styles.root} hidden={!visible} data-scroll-to-top>
      <Button
        hierarchy="quiet"
        surface="bare"
        iconOnly
        iconStart={<ArrowUp size={20} aria-hidden="true" />}
        type="button"
        aria-label="К началу урока"
        title="К началу урока"
        onClick={() => scrollToTop.scroll(props.headingId)}
      />
    </div>
  );
};
