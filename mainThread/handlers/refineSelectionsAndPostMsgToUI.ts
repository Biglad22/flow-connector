import { constants } from "../constants";
import { setFigmaSelection } from "../context/SelectionIntent";
import { areNodesConnected } from "../utils/helpers/areNodesConnected";
import { getPluginData } from "../utils/helpers/handleConnectorPersistence/getPluginData";
import { retrieveNodeConnector } from "../utils/helpers/handleConnectorPersistence/retrieveNodeConnector";
import { verifyConnector } from "../utils/helpers/handleConnectorPersistence/retrievePersistedConnectors";
import { ConnectorPluginData } from "../utils/types/ConnectorPluginData";
import { ConnectorStyle } from "../utils/types/ConnectorStyle";
import { NodeConnection } from "../utils/types/NodeConnection";
import { postMessageToUI } from "./postMessageToUI";

type RefinedNode = { name: string; type: string };
type PostMessage = {
  type: "selections";
  selections: Array<RefinedNode>;
  connections?: Array<NodeConnection>;
  style?: ConnectorStyle;
  isConnected?: boolean;
};

export const getNodesConnectorInfo = async (
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

  const connA = (await retrieveNodeConnector(nodeA))?.validConnections ?? [];
  const connB = (await retrieveNodeConnector(nodeB))?.validConnections ?? [];

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
      /// CHANGE SELECTION TO CONNECTOR
      setFigmaSelection([connector], { scroll: true });
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

// TRY TO CHECK IF SELECTION | NODE IS A SELECTOR
export async function prepareConnector(node: SceneNode): Promise<
  | {
      messagePayload: Partial<PostMessage> &
        ConnectorPluginData & {
          connector?: SceneNode;
          connectorId?: string;
        };
      nodes: Array<RefinedNode>;
    }
  | undefined
> {
  const connectorData = await verifyConnector(node);
  if (!connectorData) return;

  let messagePayload: Partial<PostMessage> &
    ConnectorPluginData & {
      connector?: SceneNode;
      connectorId?: string;
    } = {
    connector: node,
    isConnected: connectorData.isConnected,
    connectorId: node.id,
    ...(connectorData.connectorData ?? {}),
  };

  const fromNode = await retrieveNodeConnector(
      undefined,
      connectorData.connectorData.fromNodeId,
    ),
    toNode = await retrieveNodeConnector(
      undefined,
      connectorData.connectorData.toNodeId,
    );

  if (!fromNode || !toNode) return;

  messagePayload.connections = [
    ...(fromNode?.validConnections ?? []),
    ...(toNode?.validConnections ?? []),
  ];

  return {
    messagePayload,
    nodes: [
      { name: fromNode?.node.name, type: fromNode?.node.type },
      { name: toNode?.node.name, type: toNode?.node.type },
    ],
  };
}

//========== MAIN FUNCTION ===========================
export const refineSelectionsAndPostMsgToUI = async (
  selections: readonly SceneNode[],
) => {
  let connections: NodeConnection[] = [];
  const numberOfSelection = selections.length;

  // === TWO NODE SELECTION ===
  if (numberOfSelection === 2) {
    const [nodeA, nodeB] = selections;
    const connectorInfo = await getNodesConnectorInfo(selections);

    const selectedNodes = [
      { name: nodeA.name, type: nodeA.type },
      { name: nodeB.name, type: nodeB.type },
    ];

    const messagePayload: PostMessage = {
      type: "selections",
      selections: selectedNodes,
      connections: connectorInfo?.connections,
      style: connectorInfo?.style,
      isConnected: connectorInfo?.isConnected || false,
    };

    postMessageToUI(messagePayload);
    return;
  }

  const prepareSelection = async () => {
    // === MULTI SELECTION ===
    const selectedNodes = [];
    for (const node of selections) {
      const connectionData = await retrieveNodeConnector(node);
      connections = [
        ...connections,
        ...(connectionData?.validConnections || []),
      ];

      selectedNodes.push({
        name: node.name,
        type: node.type,
      });
    }
    postMessageToUI({
      type: "selections",
      selections: selectedNodes,
      connections,
    } as PostMessage);
  };

  if (numberOfSelection === 1) {
    const possibleConnectorData = await prepareConnector(selections[0]);

    if (possibleConnectorData) {
      const { messagePayload: metadata, nodes } = possibleConnectorData;

      const messagePayload: PostMessage = {
        type: "selections",
        selections: nodes,
        connections: metadata?.connections,
        style: metadata?.style,
        isConnected: metadata.isConnected || false,
      };
      postMessageToUI(messagePayload);

      return;
    }
  }

  prepareSelection();
};
