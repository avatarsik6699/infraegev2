import { describe, expect, it } from "vitest";
import { ContentNotFoundError, parseTopicRouteSlug } from "~/entities/content";

describe("content route boundaries", () => {
  it("accepts canonical slug ids and preserves the topic task number", () => {
    expect(parseTopicRouteSlug("zadanie-1-graphs-and-tables")).toEqual({
      taskNumber: 1,
      topicId: "graphs-and-tables",
    });
  });

  it.each(["../secrets", "topic.json", "/absolute", "UPPERCASE", ""])(
    "rejects a non-slug content id before filesystem access: %s",
    (id) => {
      expect(() => parseTopicRouteSlug(`zadanie-1-${id}`)).toThrow(
        ContentNotFoundError,
      );
    },
  );
});
