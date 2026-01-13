import { ConnectorPluginData } from "../../types/ConnectorPluginData";
import { getPluginData } from "./getPluginData";
import { verifyConnectorLink } from "./verifyConnectorLink";

type IndexedData = Map<
  string,
  {
    connector: GroupNode;
    connectorMetaData: ConnectorPluginData;
    isConnector?: Boolean; //FLAGS CONNECTOR NODE AS TRUE
  }
>;

type ExpectedReturnType = {
  indexConnectedNodes: IndexedData;
  indexConnectors: IndexedData;
};

/**
 * @description use to get connector metadata (fromNodeId, toNodeId, style) and connection state
 * @param node suspected connector node
 * @returns if node is not a connector result is undefined
 */

export const verifyConnector = async (
  node: SceneNode,
): Promise<
  { connectorData: ConnectorPluginData; isConnected: boolean } | undefined
> => {
  const connectorMetaData = getPluginData<ConnectorPluginData>(node);
  if (node.type === "GROUP" && connectorMetaData) {
    const isConnected = await verifyConnectorLink({
      fromNodeId: connectorMetaData?.fromNodeId,
      connectorId: node.id,
      toNodeId: connectorMetaData?.toNodeId,
    });

    return { connectorData: connectorMetaData, isConnected };
  }
  return;
};

export default async function retrievePersistedConnectors(): Promise<ExpectedReturnType> {
  const connectors: SceneNode[] = [];

  for (const node of figma.currentPage.children) {
    const result = await verifyConnector(node);
    if (result && result.isConnected) connectors.push(node);

    continue;
  }

  const refinedConnectors = connectors.map((node) => {
    const connectorMetaData = getPluginData<ConnectorPluginData>(node);
    return { connector: node as GroupNode, connectorMetaData };
  });

  let indexConnectedNodes: IndexedData = new Map();
  let indexConnectors: IndexedData = new Map();

  refinedConnectors.forEach((connectorData) => {
    if (!connectorData.connectorMetaData) return;

    if (!indexConnectors.get(connectorData.connector.id))
      indexConnectors.set(connectorData.connector.id, connectorData as any);
    if (!indexConnectedNodes.get(connectorData.connectorMetaData.fromNodeId))
      indexConnectedNodes.set(
        connectorData.connectorMetaData.fromNodeId,
        connectorData as any,
      );
    if (!indexConnectedNodes.get(connectorData.connectorMetaData.toNodeId))
      indexConnectedNodes.set(
        connectorData.connectorMetaData.toNodeId,
        connectorData as any,
      );
  });

  return { indexConnectedNodes, indexConnectors };
}
