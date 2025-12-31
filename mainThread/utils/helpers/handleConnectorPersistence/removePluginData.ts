export default function removePluginData(
  node: SceneNode | GroupNode,
  pluginKey: string,
) {
  return node.setPluginData(pluginKey, "");
}
