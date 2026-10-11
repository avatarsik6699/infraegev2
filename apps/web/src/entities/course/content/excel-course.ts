import { defineCourse } from "../lib/define-course";
import { excelCoursePublication } from "./course-publication.mjs";

export const excelCourse = defineCourse(excelCoursePublication);
