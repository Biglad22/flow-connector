import { drawLineEnd } from "../../handlers/connectorFunctions/drawConnectorEnd";
import { drawLineStart } from "../../handlers/connectorFunctions/drawConnectorStart";
import { ConnectionEdge } from "../types/ConnectionEdge";
import { ConnectorEnd, ConnectorEndNode } from "../types/ConnectorEnd";
import { Coordinate } from "../types/coordinate";

export const getElbowConnectorHead = (props: {
  coord: Coordinate;
  connectionEdge: ConnectionEdge;
  headType?: ConnectorEnd;
  stroke?: string;
  strokeWeight?: number;
}): ConnectorEndNode => {

  if (!props.headType) return;
  const vertEdges: Array<ConnectionEdge> = ["BOTTOM", "TOP"];
  const connectorHead: Parameters<typeof drawLineStart>[0] = {
    axis: "hor",
    x: props.coord.x,
    y: props.coord.y,
    type: props.headType,
    fill: props.stroke,
    stroke: props.stroke,
    strokeWeight: props.strokeWeight,
  };

  if (vertEdges.includes(props.connectionEdge)) {
    connectorHead.axis = "vert";
    return props.connectionEdge === "TOP"
      ? drawLineEnd(connectorHead as any)
      : drawLineStart(connectorHead as any);
  }

  return props.connectionEdge === "RIGHT"
    ? drawLineStart(connectorHead)
    : drawLineEnd(connectorHead);
};
