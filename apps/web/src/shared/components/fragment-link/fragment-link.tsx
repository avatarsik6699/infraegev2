import type { FragmentLinkTypes } from "./fragment-link.types";

export const FragmentLink: React.FC<FragmentLinkTypes.Props> = (props) => {
  return (
    <a
      {...props.anchorProps}
      href={`#${props.hash}`}
      className={props.className}
    >
      {props.children}
    </a>
  );
};
