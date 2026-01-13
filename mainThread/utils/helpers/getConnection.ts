import { ConnectorEndNode } from "../types/ConnectorEnd";
import { ConnectorPart } from "../types/ConnectorPart";
import { ConnectorStyle } from "../types/ConnectorStyle";
import { getElbowConnectorData } from "./getConnectorData";
import persistPluginData from "./handleConnectorPersistence/persistPluginData";

type Props = {
  selections: Readonly<SceneNode[]> | SceneNode[];
} & ConnectorStyle;

export const getConnection = async (props: Props) => {
  if (props.selections.length < 2) return;
  if (!props.radius) props.radius = 0;
  if (!props.strokeWeight) props.strokeWeight = 2;
  const connector = figma.createVector();

  let data = "";
  let head: ConnectorEndNode, tail: ConnectorEndNode;
  let label: FrameNode | undefined;
  const vectorPath = { windingRule: "EVENODD" as const, data };

  const elbowConnector = await getElbowConnectorData(props);
  vectorPath.data = elbowConnector.line;
  head = elbowConnector.head;
  tail = elbowConnector.tail;
  label = elbowConnector.label;

  const nodes: Array<SceneNode> = [connector];
  persistPluginData(connector, { role: "CONNECTOR_LINE" as ConnectorPart });

  if (head) {
    nodes.push(head);
    persistPluginData(head, { role: "HEAD" as ConnectorPart });
  }
  if (tail) {
    nodes.push(tail);
    persistPluginData(tail, { role: "TAIL" as ConnectorPart });
  }
  if (label) {
    nodes.push(label);
    persistPluginData(label, { role: "LABEL" as ConnectorPart });
  }

  if (props.strokeWeight) connector.strokeWeight = props.strokeWeight;
  if (props.stroke) connector.strokes = [figma.util.solidPaint(props.stroke)];
  if (props.dashPattern) {
    const DASH_LENGTH = props.strokeWeight ? props.strokeWeight * 4 : 8;
    connector.dashPattern = [DASH_LENGTH, props.dashPattern];
  }

  return {
    nodes,
  };
};
