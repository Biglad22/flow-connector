import { getPluginData } from "../../utils/helpers/handleConnectorPersistence/getPluginData";
import persistPluginData from "../../utils/helpers/handleConnectorPersistence/persistPluginData";
import persistConnector from "../../utils/helpers/handleConnectorPersistence/persistPluginData";
import { updateElbowConnectorData } from "../../utils/helpers/updateConnectorData";
import { ConnectorEndNode } from "../../utils/types/ConnectorEnd";
import { ConnectorPart } from "../../utils/types/ConnectorPart";
import { ConnectorPluginData } from "../../utils/types/ConnectorPluginData";
import { refineSelectionsAndPostMsgToUI } from "../refineSelectionsAndPostMsgToUI";
import { drawConnectorLabel } from "./drawConnectorLabel";
import { updateConnectorLabel } from "./updateConnectorLabel";

type Props = {
  connector: GroupNode;
  applyStyle?: boolean;
} & ConnectorPluginData;

export default async function updateConnector({
  connector: connectorGroup,
  fromNodeId,
  style,
  toNodeId,
  applyStyle = false,
}: Props) {
  const connector = connectorGroup.children.find(
    (n) =>
      getPluginData<{ role: ConnectorPart }>(n)?.role === "CONNECTOR_LINE" &&
      n.type === "VECTOR",
  ) as VectorNode | undefined;

  const head = connectorGroup.children.find(
    (n) => getPluginData<{ role: ConnectorPart }>(n)?.role === "HEAD",
  ) as ConnectorEndNode | undefined;

  const tail = connectorGroup.children.find(
    (n) => getPluginData<{ role: ConnectorPart }>(n)?.role === "TAIL",
  ) as ConnectorEndNode | undefined;

  let label = connectorGroup.children.find(
    (n) =>
      getPluginData<{ role: ConnectorPart }>(n)?.role === "LABEL" &&
      n.type === "FRAME",
  ) as FrameNode | undefined;

  if (!connector) return;

  const updates = await updateElbowConnectorData({
    fromNodeId,
    toNodeId,
    style,
    connector,
    head,
    tail,
    label: label || undefined,
  });

  if (updates?.line) {
    connector.x = 0;
    connector.y = 0;
    connector.vectorPaths = [{ windingRule: "EVENODD", data: updates.line }];
  }

  if (updates?.meetPoint && label) {
    label.x = updates.meetPoint.x - label.width / 2;
    label.y = updates.meetPoint.y - label.height / 2;
  }

  if (updates?.head) {
    head?.remove();
    connectorGroup.appendChild(updates?.head);
    persistPluginData(updates?.head, { role: "HEAD" as ConnectorPart });
  }

  if (updates?.tail) {
    tail?.remove();
    connectorGroup.appendChild(updates?.tail);
    persistPluginData(updates?.tail, { role: "TAIL" as ConnectorPart });
  }

  if (applyStyle) {
    if (style?.strokeWeight) connector.strokeWeight = style?.strokeWeight;
    if (style?.stroke)
      connector.strokes = [figma.util.solidPaint(style?.stroke)];
    if (style?.dashPattern) {
      const DASH_LENGTH = style?.strokeWeight ? style?.strokeWeight * 4 : 8;
      connector.dashPattern = [DASH_LENGTH, style?.dashPattern];
    }

    if (label && updates?.meetPoint) {
      await updateConnectorLabel(label, style, updates.meetPoint);
    }

    if (!label && style.label && updates?.meetPoint) {
      label = await drawConnectorLabel({
        coordinates: updates?.meetPoint,
        color: style.stroke,
        label: style.label,
        radius: style.radius,
        strokeWeight: style.strokeWeight,
      });
      connectorGroup.appendChild(label as FrameNode);
      persistPluginData(label as FrameNode, { role: "LABEL" as ConnectorPart });
    }
  }

  persistConnector(connectorGroup, {
    fromNodeId,
    toNodeId,
    style,
  });
}
