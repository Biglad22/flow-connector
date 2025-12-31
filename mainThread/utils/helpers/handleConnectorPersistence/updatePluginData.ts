import { getPluginData } from "./getPluginData";
import persistPluginData from "./persistPluginData";

export const updatePluginData = <T>(props: {
  node: GroupNode | SceneNode;
  pluginDataKey: string;
  payload: T;
  dataKey: string;
}) => {
  const pluginData = getPluginData(props.node, props.pluginDataKey);

  if (!pluginData) return;

  const updatedPluginData: Record<string, any> = {
    ...pluginData,
    [props.dataKey]: props.payload,
  };

  persistPluginData(props.node, updatedPluginData, props.pluginDataKey);
};
