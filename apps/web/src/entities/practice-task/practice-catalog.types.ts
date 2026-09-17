export namespace PracticeCatalogTypes {
  export type Search = {
    skill?: string;
    exam_number?: number;
    difficulty?: number;
    page?: number;
    invalid?: boolean;
  };
  export type Entry = {
    id: string;
    title: string;
    short_description: string | null;
    difficulty: number;
    estimated_minutes: number | null;
    solution_revision: number;
    skills: string[];
    exam_numbers: number[];
  };
  export type Page = {
    tasks: Entry[];
    page: number;
    next_page: number | null;
    total: number;
  };
  export type Facets = {
    total: number;
    exam_numbers: number[];
    difficulties: number[];
    skills: { value: string; label: string }[];
  };
  export type TaskSearch = Search;
}
