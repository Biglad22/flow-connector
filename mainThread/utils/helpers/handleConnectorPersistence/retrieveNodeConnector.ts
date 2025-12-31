import { constants } from "../../../constants";
import { NodeConnection } from "../../types/NodeConnection";
import { getPluginData } from "./getPluginData";
import persistPluginData from "./persistPluginData";
import { unlinkConnector } from "./unlinkConnector";
import { verifyConnectorLink } from "./verifyConnectorLink";

export const retrieveNodeConnector = async (
  node: SceneNode,
): Promise<Array<NodeConnection> | undefined> => {
  const pluginData = getPluginData<Record<string, any>>(
    node,
    constants.PLUGIN_DATA_KEY_NODE,
  );

  if (!pluginData || !(constants.PLUGIN_DATA_CONNECTOR_INFO in pluginData))
    return;

  const validConnectors: Array<NodeConnection> = [];

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
      validConnectors.push(connection);
    }
  }

  if (validConnectors.length > 0)
    persistPluginData(
      node,
      {
        ...pluginData,
        [constants.PLUGIN_DATA_CONNECTOR_INFO]: validConnectors,
      },
      constants.PLUGIN_DATA_KEY_NODE,
    );
  else {
    const { [constants.PLUGIN_DATA_CONNECTOR_INFO]: _, ...res } = pluginData;
    persistPluginData(node, res, constants.PLUGIN_DATA_KEY_NODE);
  }

  return validConnectors;
};
