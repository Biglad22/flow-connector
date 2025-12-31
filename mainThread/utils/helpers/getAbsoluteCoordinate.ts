import { getAbsoluteCenter } from "./getAbsoluteCenter";

export function getAbsoluteCoordinate(node: SceneNode) {
  const t = node.absoluteTransform;
  const absX = t[0][2];
  const absY = t[1][2];
  const mid = getAbsoluteCenter(node);
  return {
    x: absX,
    y: absY,
    mid,
    w: node.width,
    h: node.height,
  };
}
