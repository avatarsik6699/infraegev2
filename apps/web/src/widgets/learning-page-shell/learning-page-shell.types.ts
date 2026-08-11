import type { ContentBlock, LearningSection } from "~/entities/content";

export namespace LearningPageShellTypes {
  export type MetadataItem = {
    label: string;
  };

  export type Props = {
    overline: string;
    title: string;
    summary?: string;
    metadata: MetadataItem[];
    sections: LearningSection[];
    quickReferenceBlocks: ContentBlock[];
    progress?: React.ReactNode;
    beforeContent?: React.ReactNode;
    practice: React.ReactNode;
    afterContent?: React.ReactNode;
  };
}
