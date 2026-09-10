import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronDown } from "lucide-react";
import { useMediaQuery } from "~/shared/lib/media-query";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import type { ResponsiveDisclosureTypes } from "./responsive-disclosure.types";
import styles from "./responsive-disclosure.module.css";

export const ResponsiveDisclosure: React.FC<ResponsiveDisclosureTypes.Props> = (
  props,
) => {
  const narrow = useMediaQuery("(max-width: 60rem)");
  const enhanced = useIsEnhanced();
  const collapsible = narrow && enhanced;

  return (
    <Collapsible.Root
      open={!collapsible || props.expanded}
      onOpenChange={props.onExpandedChange}
      data-responsive-disclosure
      data-collapsible={collapsible || undefined}
    >
      {collapsible ? (
        <Collapsible.Trigger className={styles.trigger}>
          <span>{props.label}</span>
          <ChevronDown
            aria-hidden="true"
            size={18}
            className={styles.chevron}
          />
        </Collapsible.Trigger>
      ) : null}
      <Collapsible.Panel keepMounted className={styles.panel}>
        {props.children}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
};
