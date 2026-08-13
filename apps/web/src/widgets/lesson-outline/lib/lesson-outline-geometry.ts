export type LessonOutlineGeometryNode = {
  id: string;
  groupId: string;
  kind: "group" | "item";
  x: number;
  y: number;
  radius: number;
};

export type LessonOutlineGeometry = {
  width: number;
  height: number;
  nodes: LessonOutlineGeometryNode[];
};

export type LessonOutlinePath = {
  id: string;
  d: string;
  groupId?: string;
  kind: "trunk" | "branch";
};

export type LessonOutlinePathGroup = {
  paths: LessonOutlinePath[];
  activePath?: LessonOutlinePath;
};

const NODE_CLEARANCE = 5;

const format = (value: number) => Number(value.toFixed(2));

const createBranchPath = (
  parent: LessonOutlineGeometryNode,
  children: LessonOutlineGeometryNode[],
  lastChildIndex = children.length - 1,
  activeOnly = false,
) => {
  const visibleChildren = children.slice(0, lastChildIndex + 1);
  const firstChild = visibleChildren[0];
  const lastChild = visibleChildren.at(-1);
  if (!firstChild || !lastChild) return "";

  const branchX = format(parent.x + (firstChild.x - parent.x) / 2);
  const startY = format(parent.y + parent.radius + NODE_CLEARANCE);
  const firstChildY = format(firstChild.y);
  const lastChildY = format(lastChild.y);
  const bendY = format(Math.min(startY + 10, firstChildY - 6));
  const bendRadius = format(Math.max(2, Math.min(6, branchX - parent.x)));
  const entry = [
    `M ${format(parent.x)} ${startY}`,
    `V ${format(bendY - bendRadius)}`,
    `Q ${format(parent.x)} ${bendY} ${format(parent.x + bendRadius)} ${bendY}`,
    `H ${branchX}`,
    `V ${lastChildY}`,
  ].join(" ");
  const twigChildren = activeOnly ? [lastChild] : visibleChildren;
  const twigs = twigChildren
    .map(
      (child) =>
        `M ${branchX} ${format(child.y)} H ${format(child.x - child.radius - NODE_CLEARANCE)}`,
    )
    .join(" ");

  return `${entry} ${twigs}`;
};

export function buildLessonOutlinePaths(
  geometry: LessonOutlineGeometry,
  activeId?: string,
): LessonOutlinePathGroup {
  const parents = geometry.nodes.filter(({ kind }) => kind === "group");
  const paths: LessonOutlinePath[] = [];

  for (let index = 0; index < parents.length - 1; index += 1) {
    const current = parents[index];
    const next = parents[index + 1];
    if (!current || !next) continue;

    paths.push({
      id: `trunk-${current.id}-${next.id}`,
      kind: "trunk",
      d: `M ${format(current.x)} ${format(current.y + current.radius + NODE_CLEARANCE)} V ${format(next.y - next.radius - NODE_CLEARANCE)}`,
    });
  }

  for (const parent of parents) {
    const children = geometry.nodes.filter(
      ({ kind, groupId }) => kind === "item" && groupId === parent.id,
    );
    const d = createBranchPath(parent, children);
    if (!d) continue;
    paths.push({
      id: `branch-${parent.id}`,
      groupId: parent.id,
      kind: "branch",
      d,
    });
  }

  const activeNode = geometry.nodes.find(({ id }) => id === activeId);
  if (!activeNode || activeNode.kind !== "item") return { paths };
  const activeParent = parents.find(({ id }) => id === activeNode.groupId);
  if (!activeParent) return { paths };
  const siblings = geometry.nodes.filter(
    ({ kind, groupId }) => kind === "item" && groupId === activeParent.id,
  );
  const activeIndex = siblings.findIndex(({ id }) => id === activeNode.id);
  const d = createBranchPath(activeParent, siblings, activeIndex, true);

  return {
    paths,
    activePath: d
      ? {
          id: `active-${activeParent.id}-${activeNode.id}`,
          groupId: activeParent.id,
          kind: "branch",
          d,
        }
      : undefined,
  };
}
