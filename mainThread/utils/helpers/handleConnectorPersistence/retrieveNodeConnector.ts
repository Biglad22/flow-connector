import { constants } from "../../../constants";
import { NodeConnection } from "../../types/NodeConnection";
import { getPluginData } from "./getPluginData";
import persistPluginData from "./persistPluginData";
import { unlinkConnector } from "./unlinkConnector";
import { verifyConnectorLink } from "./verifyConnectorLink";

export const retrieveNodeConnector = async (
  node?: SceneNode,
  nodeId?: string,
): Promise<
  { validConnections: Array<NodeConnection>; node: SceneNode } | undefined
> => {
  nodeId = nodeId?.trim();

  if (!nodeId && !node) return;

  if (!node && nodeId) {
    let searchRes = await figma.getNodeByIdAsync(nodeId);
    if (searchRes) node = searchRes as any;
  }

  if (!node) return;

  const pluginData = getPluginData<Record<string, any>>(
    node,
    constants.PLUGIN_DATA_KEY_NODE,
  );

  if (!pluginData || !(constants.PLUGIN_DATA_CONNECTOR_INFO in pluginData))
    return;

  const validConnections: Array<NodeConnection> = [];

  for (const connection of pluginData[
    constants.PLUGIN_DATA_CONNECTOR_INFO
  ] as NodeConnection[]) {
    const connector = await figma.getNodeByIdAsync(connection.connectorId);
    const isConnected = await verifyConnectorLink({
      connectorId: connection.connectorId,
      fromNodeId: connection.connection.from,
      toNodeId: connection.connection.to,
    });

    //IF CONNECTOR DOES NOT EXIST REMOVE CONNECTOR DATA FROM NODE
    if (!connector) {
      await unlinkConnector({
        connectorId: connection.connectorId,
        nodeId: connection.connection.from,
      });

      await unlinkConnector({
        connectorId: connection.connectorId,
        nodeId: connection.connection.to,
      });
    }

    if (
      connector &&
      connection.connection.from !== node.id &&
      connection.connection.to !== node.id
    ) {
      console.log("Here", node);

      unlinkConnector({
        node,
        connectorId: connection.connectorId,
      });
    } else if (connector && isConnected) {
      validConnections.push(connection);
    }
  }

  if (validConnections.length > 0)
    persistPluginData(
      node,
      {
        ...pluginData,
        [constants.PLUGIN_DATA_CONNECTOR_INFO]: validConnections,
      },
      constants.PLUGIN_DATA_KEY_NODE,
    );
  else {
    const { [constants.PLUGIN_DATA_CONNECTOR_INFO]: _, ...res } = pluginData;
    persistPluginData(node, res, constants.PLUGIN_DATA_KEY_NODE);
  }

  return { validConnections, node };
};
