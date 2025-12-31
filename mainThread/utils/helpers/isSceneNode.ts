export function isSceneNode(node: any): node is SceneNode {
  return (
    node !== null &&
    "x" in node &&
    "absoluteTransform" in node &&
    node.type !== "DOCUMENT" &&
    node.type !== "PAGE"
  );
}
