export function getAbsoluteCenter(node: SceneNode) {
  const t = node.absoluteTransform;
  const absX = t[0][2];
  const absY = t[1][2];

  return {
    x: absX  + (node.width / 2),
    y: absY + (node.height / 2)
  };
}
