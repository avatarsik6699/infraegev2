import { Container } from "@mantine/core";
import type { PageContainerTypes } from "./page-container.types";

export const PageContainer: React.FC<PageContainerTypes.Props> = (props) => {
  return (
    <Container
      component={props.component ?? "main"}
      size={props.size ?? "var(--max-content-width)"}
      px="var(--space-2)"
      py="var(--space-3)"
      className={props.className}
    >
      {props.children}
    </Container>
  );
};
