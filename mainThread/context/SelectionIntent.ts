// selectionState.ts
let isProgrammaticSelection = false;

export function setFigmaSelection(
  nodes: readonly SceneNode[],
  opts?: { scroll?: boolean },
) {
  isProgrammaticSelection = true;
  figma.currentPage.selection = nodes;

  const bounds = nodes.reduce(
    (acc, node) => {
      const x = node.absoluteTransform[0][2];
      const y = node.absoluteTransform[1][2];

      acc.minX = Math.min(acc.minX, x);
      acc.minY = Math.min(acc.minY, y);
      acc.maxX = Math.max(acc.maxX, x + node.width);
      acc.maxY = Math.max(acc.maxY, y + node.height);

      return acc;
    },
    {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
    },
  );

  if (opts?.scroll) {
    figma.viewport.center = {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
    };
  }

  // IMPORTANT: reset asynchronously
  setTimeout(() => {
    isProgrammaticSelection = false;
  }, 0);
}

export function isSelectionProgrammatic() {
  return isProgrammaticSelection;
}
