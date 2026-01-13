import updateConnector from "../handlers/connectorFunctions/updateConnector";
import { getPluginData } from "../utils/helpers/handleConnectorPersistence/getPluginData";
import persistPluginData from "../utils/helpers/handleConnectorPersistence/persistPluginData";
import { unlinkConnector } from "../utils/helpers/handleConnectorPersistence/unlinkConnector";
import getAffectedConnectedNodes from "../utils/helpers/handleDocumentChange/getAffectedConnectedNode";
import { ConnectorPart } from "../utils/types/ConnectorPart";
import { ConnectorPluginData } from "../utils/types/ConnectorPluginData";

export async function documentChangeEvent({
  documentChanges,
}: DocumentChangeEvent) {
  const affectedConnectors = await getAffectedConnectedNodes(documentChanges);

  for (const {
    connector,
    type,
    connectorMetaData: { fromNodeId, style, toNodeId },
  } of affectedConnectors.affectedConnectedNodes.values()) {
    switch (type) {
      case "DELETE":
        for (const nodeId of [fromNodeId, toNodeId]) {
          await unlinkConnector({
            nodeId,
            connectorId: connector.id,
          });
        }
        connector.remove();
        break;
      case "PROPERTY_CHANGE":
        updateConnector({
          connector,
          fromNodeId,
          style,
          toNodeId,
        });
        break;
      default:
        break;
    }
  }

  for (const {
    connector,
    type,
    connectorMetaData: metadata,
  } of affectedConnectors.affectedConnectors.values()) {
    switch (type) {
      case "DELETE":
        for (const nodeId of [metadata.fromNodeId, metadata.toNodeId]) {
          await unlinkConnector({
            nodeId,
            connectorId: connector.id,
          });
        }
        break;
      case "PROPERTY_CHANGE":
        handleConnectorStyleUpdate(connector, metadata);
        break;
      default:
        break;
    }
  }
}

function handleConnectorStyleUpdate(
  connectorGroup: GroupNode,
  connectorData: ConnectorPluginData,
) {
  const connectorLine = connectorGroup.children.find(
    (n) =>
      getPluginData<{ role: ConnectorPart }>(n)?.role === "CONNECTOR_LINE" &&
      n.type === "VECTOR",
  ) as VectorNode | undefined;

  const paintToHex = (paint?: Readonly<Paint>): string | undefined => {
    if (!paint || paint.type !== "SOLID") return undefined;
    const { r, g, b } = (paint as SolidPaint).color;
    const toHex = (n: number) =>
      Math.round(n * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  const strokePaint = connectorLine?.strokes?.[0];

  const updatedStyle: Partial<ConnectorPluginData["style"]> = {
    dashPattern: connectorLine?.dashPattern?.[1] ?? 0,
    stroke: paintToHex(strokePaint),
    strokeWeight: Number(connectorLine?.strokeWeight) ?? 1,
  };
  updatedStyle.strokeType = updatedStyle.dashPattern ? "DASHED" : "SOLID";

  const payload: ConnectorPluginData = {
    ...connectorData,
    style: {
      ...connectorData.style,
      ...updatedStyle,
    },
  };

  persistPluginData(connectorGroup, payload);
}
