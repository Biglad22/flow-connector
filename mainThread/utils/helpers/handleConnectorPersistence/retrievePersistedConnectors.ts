import { constants } from "../../../constants";
import { ConnectorPluginData } from "../../types/ConnectorPluginData";
import { getPluginData } from "./getPluginData";
import { verifyConnectorLink } from "./verifyConnectorLink";

type ExpectedReturnType = Map<
  string,
  {
    connector: GroupNode;
    connectorMetaData: ConnectorPluginData;
  }
>;

export default async function retrievePersistedConnectors(): Promise<ExpectedReturnType> {
  const connectors: SceneNode[] = [];

  for (const node of figma.currentPage.children) {
    const connectorMetaData = getPluginData<ConnectorPluginData>(node);
    if (node.type === "GROUP" && connectorMetaData) {
      const isConnected = await verifyConnectorLink({
        fromNodeId: connectorMetaData?.fromNodeId,
        connectorId: node.id,
        toNodeId: connectorMetaData?.toNodeId,
      });
      if (isConnected) connectors.push(node);
    }
    continue;
  }

  const refinedConnectors = connectors.map((node) => {
    const connectorMetaData = getPluginData<ConnectorPluginData>(node);
    return { connector: node as GroupNode, connectorMetaData };
  });

  let indexConnectors: ExpectedReturnType = new Map();

  refinedConnectors.forEach((connectorData) => {
    if (!connectorData.connectorMetaData) return;

    if (!indexConnectors.get(connectorData.connectorMetaData.fromNodeId))
      indexConnectors.set(
        connectorData.connectorMetaData.fromNodeId,
        connectorData as any,
      );
    if (!indexConnectors.get(connectorData.connectorMetaData.toNodeId))
      indexConnectors.set(
        connectorData.connectorMetaData.toNodeId,
        connectorData as any,
      );
  });

  return indexConnectors;
}
