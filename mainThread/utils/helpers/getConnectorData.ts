import { getAbsoluteCoordinate } from "./getAbsoluteCoordinate";
import { getConnectorEdge } from "./getConnectorEdge";
import { Coordinate } from "../types/coordinate";
import { getConnectionEdgeCoordinate } from "./getConnectionEdgeCoordinate";
import { ConnectorEnd, ConnectorEndNode } from "../types/ConnectorEnd";
import { drawConnectorLabel } from "../../handlers/connectorFunctions/drawConnectorLabel";
import { getElbowConnectorLine } from "./getElbowConnectorLine";
import { getElbowConnectorHead } from "./getElbowConnectorHead";
import { isSceneNode } from "./isSceneNode";
import { ConnectorStyle } from "../types/ConnectorStyle";

type Props = {
  startType: ConnectorEnd;
  endType: ConnectorEnd;
  stroke?: string;
  strokeWeight?: number;
  radius?: number;
  label?: string;
};

type FuncReturnType = {
  line: string;
  head?: ConnectorEndNode;
  tail?: ConnectorEndNode;
  label?: FrameNode;
};

export async function getElbowConnectorData(
  props: { selections: Readonly<SceneNode[]> | SceneNode[] } & Omit<
    Props,
    "start" | "length"
  >,
): Promise<FuncReturnType> {
  const first = getAbsoluteCoordinate(props.selections[0]),
    second = getAbsoluteCoordinate(props.selections[1]);

  const [firstConnectionEdge, secondConnectionEdge] = getConnectorEdge({
    other: second,
    target: first,
  });
  const firstConnectionEdgeCoord = getConnectionEdgeCoordinate(
    first,
    firstConnectionEdge,
  );

  const secondConnectionEdgeCoord = getConnectionEdgeCoordinate(
    second,
    secondConnectionEdge,
  );

  let connectorEndStyle = {
    stroke: props.stroke,
    strokeWeight: props.strokeWeight,
  };

  const { data, meetPoint } = getElbowConnectorLine({
    destination: secondConnectionEdgeCoord,
    destinationHeadType: props.endType,
    radius: props.radius,
    startHeadType: props.startType,
    startingEdge: firstConnectionEdge,
    startingPoint: firstConnectionEdgeCoord,
    endEdge: secondConnectionEdge,
  });
  const head = getElbowConnectorHead({
    connectionEdge: firstConnectionEdge,
    coord: firstConnectionEdgeCoord,
    headType: props.startType,
    ...connectorEndStyle,
  });

  const tail = getElbowConnectorHead({
    connectionEdge: secondConnectionEdge,
    coord: secondConnectionEdgeCoord,
    headType: props.endType,
    ...connectorEndStyle,
  });

  const label = await drawConnectorLabel({
    color: props.stroke,
    coordinates: meetPoint,
    label: props.label,
    radius: props.radius,
    strokeWeight: props.strokeWeight,
  });

  return {
    line: data,
    head,
    tail,
    label,
  };
}
