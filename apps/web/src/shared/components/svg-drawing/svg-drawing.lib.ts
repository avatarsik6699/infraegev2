import { svgResource } from "~/shared/lib/svg-resource";

const normalizeResourceId = (reactId: string, role: string): string =>
  svgResource.normalizeId(reactId, "drawing", role);

export const svgDrawing = {
  normalizeResourceId,
  paintUrl: svgResource.paintUrl,
};
