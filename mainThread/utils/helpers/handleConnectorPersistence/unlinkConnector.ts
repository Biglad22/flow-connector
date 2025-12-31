import { constants } from "../../../constants";
import { NodeConnection } from "../../types/NodeConnection";
import { getPluginData } from "./getPluginData";
import { updatePluginData } from "./updatePluginData";

export const unlinkConnector = async (props: {
  node?: GroupNode | SceneNode;
  nodeId?: string;
  connectorId: string;
}) => {
  if (!props.node && !props.nodeId) return;

  let node = props.node;

  if (props.nodeId && !props.node) {
    node = (await figma.getNodeByIdAsync(props.nodeId)) as any;
    if (!node) return;
  }

  if (!node) return;
  const nodePluginData: any = getPluginData(
    node,
    constants.PLUGIN_DATA_KEY_NODE,
  );
  const connections = (nodePluginData[constants.PLUGIN_DATA_CONNECTOR_INFO] ||
    []) as NodeConnection[];
  const updatedPluginData = connections?.filter(
    ({ connectorId: id }) => id !== props.connectorId,
  );
  updatePluginData({
    pluginDataKey: constants.PLUGIN_DATA_KEY_NODE,
    dataKey: constants.PLUGIN_DATA_CONNECTOR_INFO,
    node,
    payload: updatedPluginData,
  });
};
