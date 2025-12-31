import { getPluginData } from "../../utils/helpers/handleConnectorPersistence/getPluginData";
import { verifyConnectorLink } from "../../utils/helpers/handleConnectorPersistence/verifyConnectorLink";
import { ConnectorPluginData } from "../../utils/types/ConnectorPluginData";
import presentToast from "../presentToast";

type Props = { connectorIds: string[] };

export default async function getConnectionsToExport({
  connectorIds,
}: Props): Promise<
  Map<
    string,
    {
      type: "connector" | "connectedNode";
      node: SceneNode | BaseNode;
    }
  >
> {
  if (connectorIds.length < 1) {
    presentToast({
      message: "Select connection to export",
      error: true,
    });
    return new Map();
  }
  let connections: Map<
    string,
    {
      type: "connector" | "connectedNode";
      node: SceneNode | BaseNode;
    }
  > = new Map();

  for (const rawId of connectorIds) {
    const id = rawId.trim();

    const potentialConnector = await figma.getNodeByIdAsync(id);
    if (!potentialConnector) continue;

    const connectorPluginData =
      getPluginData<ConnectorPluginData>(potentialConnector);

    if (potentialConnector.type !== "GROUP" || !connectorPluginData) continue;

    const isConnected = await verifyConnectorLink({
      fromNodeId: connectorPluginData.fromNodeId,
      toNodeId: connectorPluginData.toNodeId,
      connectorId: potentialConnector.id,
    });

    if (!isConnected) {
      potentialConnector.remove();
      continue;
    }

    if (!connections.has(potentialConnector.id))
      connections.set(potentialConnector.id, {
        type: "connector",
        node: potentialConnector,
      });

    const firstNode = await figma.getNodeByIdAsync(
      connectorPluginData.fromNodeId,
    );
    const secondNode = await figma.getNodeByIdAsync(
      connectorPluginData.toNodeId,
    );

    if (firstNode && !connections.has(firstNode.id))
      connections.set(firstNode.id, {
        type: "connectedNode",
        node: firstNode,
      });
    if (secondNode && !connections.has(secondNode.id))
      connections.set(secondNode.id, {
        type: "connectedNode",
        node: secondNode,
      });
  }

  return connections;
}
