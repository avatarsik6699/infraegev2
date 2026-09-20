export namespace PracticeCatalogTypes {
  export type Search = {
    q?: string;
    topics?: string[];
    sort?: "default" | "difficulty_asc" | "difficulty_desc";
    limit?: 10 | 30 | 50 | 100;
    skill?: string;
    exam_number?: number;
    difficulty?: number;
    page?: number;
    invalid?: boolean;
  };
  export type Entry = {
    id: string;
    title: string;
    answer_instruction: string;
    short_description: string | null;
    difficulty: number;
    estimated_minutes: number | null;
    solution_revision: number;
    skills: string[];
    exam_numbers: number[];
    sources?: {
      title: string | null;
      year: number | null;
      primary: boolean;
      kind: string;
    }[];
    topics?: string[];
  };
  export type Page = {
    tasks: Entry[];
    limit?: number;
    page: number;
    next_page: number | null;
    total: number;
  };
  export type Topic = {
    id: string;
    label: string;
    group: string;
    count: number;
  };
  export type Facets = {
    topics?: Topic[];
    total: number;
    exam_numbers: number[];
    difficulties: number[];
    skills: { value: string; label: string }[];
  };
  export type TaskSearch = Search;
}
