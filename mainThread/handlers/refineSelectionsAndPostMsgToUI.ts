import { constants } from "../constants";
import { areNodesConnected } from "../utils/helpers/areNodesConnected";
import { getPluginData } from "../utils/helpers/handleConnectorPersistence/getPluginData";
import { retrieveNodeConnector } from "../utils/helpers/handleConnectorPersistence/retrieveNodeConnector";
import { ConnectorPluginData } from "../utils/types/ConnectorPluginData";
import { NodeConnection } from "../utils/types/NodeConnection";
import { postMessageToUI } from "./postMessageToUI";

export const getConnectorInfo = async (
  selections: readonly SceneNode[],
): Promise<
  | ({
      connections: NodeConnection[];
      connector?: GroupNode;
      isConnected?: boolean;
      connectorId?: string;
    } & ConnectorPluginData)
  | undefined
> => {
  if (selections.length !== 2) return;
  const [nodeA, nodeB] = selections;

  const connA = (await retrieveNodeConnector(nodeA)) ?? [];
  const connB = (await retrieveNodeConnector(nodeB)) ?? [];

  // flatten connections
  const connections = [...connA, ...connB];

  const { isConnected, connector: connectorId } = areNodesConnected(
    nodeA.id,
    nodeB.id,
    connections,
  );

  let messagePayload: any = {
    connections,
  };

  if (connectorId) {
    const connector = await figma.getNodeByIdAsync(connectorId);

    if (connector && connector.type == "GROUP") {
      const data = getPluginData<ConnectorPluginData>(
        connector,
        constants.PLUGIN_DATA_KEY_CONNECTOR,
      );
      messagePayload.connector = connector;
      messagePayload.isConnected = isConnected;
      messagePayload.connectorId = connector.id;

      messagePayload = { ...messagePayload, ...(data ?? {}) };
    }
  }

  return messagePayload;
};

export const refineSelectionsAndPostMsgToUI = async (
  selections: readonly SceneNode[],
) => {
  let connections: NodeConnection[] = [];
  const result: Array<{ name: string; type: string }> = [];

  // === TWO NODE SELECTION ===
  if (selections.length === 2) {
    const [nodeA, nodeB] = selections;
    const connectorInfo = await getConnectorInfo(selections);

    result.push(
      { name: nodeA.name, type: nodeA.type },
      { name: nodeB.name, type: nodeB.type },
    );

    const messagePayload: any = {
      type: "selections",
      selections: result,
      connections: connectorInfo?.connections,
      style: connectorInfo?.style,
      isConnected: connectorInfo?.isConnected || false,
    };

    postMessageToUI(messagePayload);
    return;
  }

  // === MULTI SELECTION ===
  for (const node of selections) {
    const connectionData = await retrieveNodeConnector(node);
    connections = [...connections, ...(connectionData || [])];

    result.push({
      name: node.name,
      type: node.type,
    });
  }

  postMessageToUI({ type: "selections", selections: result, connections });
};
