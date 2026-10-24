import { describe, expect, it } from "vitest";
import { findCourseLessonPublicationByRouteSlugs } from "~/entities/course";
import { findLessonByRouteSlug } from "~/entities/lesson";
import {
  legacyCourseLessonRouteSlugs,
  legacyTopicRouteSlugs,
} from "~/shared/config/legacy-routes";

// Change 206: a legacy address must be gone (a redirect would shadow a live page) and its target
// must be a published page (a redirect must not lead to 404).
describe("legacy addresses of the first production release", () => {
  it("send each renamed topic to a published topic", () => {
    for (const [old, current] of Object.entries(legacyTopicRouteSlugs)) {
      expect(findLessonByRouteSlug(old)).toBeUndefined();
      expect(findLessonByRouteSlug(current)?.status).toBe("published");
    }
  });

  it("send each retired course lesson to a published lesson of the same course", () => {
    for (const [course, lessons] of Object.entries(
      legacyCourseLessonRouteSlugs,
    )) {
      for (const [old, current] of Object.entries(lessons)) {
        expect(
          findCourseLessonPublicationByRouteSlugs(course, old),
        ).toBeUndefined();
        expect(
          findCourseLessonPublicationByRouteSlugs(course, current)?.status,
        ).toBe("published");
      }
    }
  });
});
