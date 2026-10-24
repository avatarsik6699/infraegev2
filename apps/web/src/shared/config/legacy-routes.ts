/**
 * Addresses the Change 166 production release published that later changes renamed or merged
 * (Change 206). Search engines and bookmarks still carry them through the infraege.ru → kodumka.ru
 * move, so each answers a permanent redirect to its closest current page instead of 404.
 */
export const legacyTopicRouteSlugs: Readonly<Record<string, string>> =
  Object.freeze({
    // Change 197: topic 25 follows the FIPI 2027 name.
    "25-obrabotka-celyh-chisel": "25-deliteli-i-maski",
  });

/** Course lessons by course route slug; Change 197 rebuilt the Python course. */
export const legacyCourseLessonRouteSlugs: Readonly<
  Record<string, Readonly<Record<string, string>>>
> = Object.freeze({
  python: Object.freeze({
    oshibki: "obrabotka-isklyucheniy",
    "sostavnye-usloviya": "logicheskie-vyrazheniya",
    "schetchiki-i-nakopiteli": "while",
    "tsifry-chisla": "chisla-i-vyrazheniya",
    tablitsy: "fayly",
    "polnyy-perebor": "standartnaya-biblioteka",
    "otbor-rezultata": "sortirovka-i-poisk",
    "spisok-del": "spiski",
    "deystviya-so-spiskom": "spiski",
    "sohranenie-spiska-del": "fayly",
  }),
});
