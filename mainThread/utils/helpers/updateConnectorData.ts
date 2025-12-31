import { ConnectorEndNode } from "../types/ConnectorEnd";
import { ConnectorStyle } from "../types/ConnectorStyle";
import { Coordinate } from "../types/coordinate";
import { getAbsoluteCoordinate } from "./getAbsoluteCoordinate";
import { getConnectionEdgeCoordinate } from "./getConnectionEdgeCoordinate";
import { getElbowConnectorData } from "./getConnectorData";
import { getConnectorEdge } from "./getConnectorEdge";
import { getElbowConnectorHead } from "./getElbowConnectorHead";
import { getElbowConnectorLine } from "./getElbowConnectorLine";
import { isSceneNode } from "./isSceneNode";

type ElbowData = NonNullable<Awaited<ReturnType<typeof getElbowConnectorData>>>;
type ElbowDataWithoutLabel = Omit<ElbowData, "label">;
type FuncReturnType = ElbowDataWithoutLabel & { meetPoint: Coordinate };

export async function updateElbowConnectorData(props: {
  fromNodeId: string;
  toNodeId: string;
  connector: VectorNode;
  head: ConnectorEndNode;
  tail: ConnectorEndNode;
  label?: FrameNode;
  style?: ConnectorStyle;
}): Promise<FuncReturnType | undefined> {
  const firstNode = await figma.getNodeByIdAsync(props.fromNodeId);
  const secondNode = await figma.getNodeByIdAsync(props.toNodeId);

  if (!isSceneNode(firstNode) || !isSceneNode(secondNode)) return;

  const first = getAbsoluteCoordinate(firstNode),
    second = getAbsoluteCoordinate(secondNode);

  const [firstConnectionEdge, secondConnectionEdge] = getConnectorEdge({
    target: first,
    other: second,
  });

  const firstConnectionEdgeCoord = getConnectionEdgeCoordinate(
    first,
    firstConnectionEdge,
  );

  const secondConnectionEdgeCoord = getConnectionEdgeCoordinate(
    second,
    secondConnectionEdge,
  );

  const { data, meetPoint } = getElbowConnectorLine({
    destination: secondConnectionEdgeCoord,
    radius: props.style?.radius,
    startingEdge: firstConnectionEdge,
    startingPoint: firstConnectionEdgeCoord,
    endEdge: secondConnectionEdge,
  });

  const head = getElbowConnectorHead({
    connectionEdge: firstConnectionEdge,
    coord: firstConnectionEdgeCoord,
    headType: props.style?.startType,
    ...props.style,
  });

  const tail = getElbowConnectorHead({
    connectionEdge: secondConnectionEdge,
    coord: secondConnectionEdgeCoord,
    headType: props.style?.endType,
    ...props.style,
  });

  return {
    line: data,
    head,
    tail,
    meetPoint,
  } as FuncReturnType;
}
