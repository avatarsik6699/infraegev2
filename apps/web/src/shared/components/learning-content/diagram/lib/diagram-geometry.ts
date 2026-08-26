export type DiagramGeometryPoint = {
  id: string;
  x: number;
  y: number;
};

export type DiagramGeometry = {
  width: number;
  height: number;
  markers: DiagramGeometryPoint[];
  notes: DiagramGeometryPoint[];
};

export type DiagramLeaderPath = {
  id: string;
  d: string;
};

const format = (value: number) => Number(value.toFixed(2));

export function buildDiagramLeaderPaths(
  geometry: DiagramGeometry,
): DiagramLeaderPath[] {
  const paths: DiagramLeaderPath[] = [];

  for (const marker of geometry.markers) {
    const note = geometry.notes.find(({ id }) => id === marker.id);
    if (!note) continue;
    // A horizontal-ease cubic curve rather than a straight segment — it
    // leaves the marker and arrives at the note roughly level, reading
    // as an organic leader rather than a ruled connector.
    const midX = format((marker.x + note.x) / 2);
    paths.push({
      id: marker.id,
      d: `M ${format(marker.x)} ${format(marker.y)} C ${midX} ${format(marker.y)} ${midX} ${format(note.y)} ${format(note.x)} ${format(note.y)}`,
    });
  }

  return paths;
}
