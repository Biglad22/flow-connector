// selectionState.ts
let isProgrammaticSelection = false;

export function setFigmaSelection(
  nodes: readonly SceneNode[],
  opts?: { scroll?: boolean },
) {
  isProgrammaticSelection = true;

  figma.currentPage.selection = nodes;

  if (opts?.scroll) {
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  // IMPORTANT: reset asynchronously
  setTimeout(() => {
    isProgrammaticSelection = false;
  }, 0);
}

export function isSelectionProgrammatic() {
  return isProgrammaticSelection;
}
