const normalizeId = (
  reactId: string,
  namespace: string,
  role: string,
): string =>
  `svg-${namespace}-${role}-${reactId.replaceAll(/[^a-zA-Z0-9_-]/g, "")}`;

const paintUrl = (id: string): string => `url(#${id})`;

export const svgResource = {
  normalizeId,
  paintUrl,
};
