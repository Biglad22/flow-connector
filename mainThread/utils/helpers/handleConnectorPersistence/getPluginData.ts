import { constants } from "../../../constants";

export const getPluginData = <T>(
  node: SceneNode | BaseNode,
  key = constants.PLUGIN_DATA_KEY_CONNECTOR,
): T | undefined => {
  const pluginData = node.getPluginData(key);


  if (!pluginData) return;
  return JSON.parse(pluginData) as T;
};
