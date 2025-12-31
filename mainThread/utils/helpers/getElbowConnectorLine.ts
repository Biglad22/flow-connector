import { ConnectionEdge } from "../types/ConnectionEdge";
import { ConnectorEnd } from "../types/ConnectorEnd";
import { Coordinate } from "../types/coordinate";

const VERTICAL_EDGES: ConnectionEdge[] = ["TOP", "BOTTOM"];
const MIN_OFFSET = 40;

export const getElbowConnectorLine = ({
  startingPoint,
  destination,
  startingEdge,
  endEdge,
  radius = 0,
}: {
  startingPoint: Coordinate;
  destination: Coordinate;
  startHeadType?: ConnectorEnd;
  startingEdge: ConnectionEdge;
  endEdge: ConnectionEdge;
  destinationHeadType?: ConnectorEnd;
  radius?: number;
}): { data: string; meetPoint: Coordinate } => {
  const isVerticalEdge = (edge: ConnectionEdge) =>
    VERTICAL_EDGES.includes(edge);

  const offset: Coordinate = {
    x: Math.max(Math.abs(startingPoint.x - destination.x) / 2, MIN_OFFSET),
    y: Math.max(Math.abs(startingPoint.y - destination.y) / 2, MIN_OFFSET),
  };

  /** Push destination slightly outward based on its edge */
  const pushedDestination: Coordinate = { ...destination };

  if (isVerticalEdge(endEdge)) {
    pushedDestination.y += endEdge === "TOP" ? -offset.y : offset.y;
  } else {
    pushedDestination.x += endEdge === "LEFT" ? -offset.x : offset.x;
  }

  let path = `M ${startingPoint.x} ${startingPoint.y}`;
  let meetPoint: Coordinate;

  /**
   * ROUTING FROM VERTICAL START EDGE
   */
  if (isVerticalEdge(startingEdge)) {
    const goesOppositeDirection =
      (startingEdge === "TOP" && startingPoint.y <= destination.y) ||
      (startingEdge === "BOTTOM" && startingPoint.y >= destination.y);

    if (goesOppositeDirection) {
      const firstY =
        startingEdge === "TOP"
          ? startingPoint.y - offset.y
          : startingPoint.y + offset.y;

      path += ` L ${startingPoint.x} ${firstY}`;
      path += ` L ${pushedDestination.x} ${firstY}`;
      path += ` L ${pushedDestination.x} ${destination.y}`;
      path += ` L ${destination.x} ${destination.y}`;

      meetPoint = { x: startingPoint.x, y: firstY };
    } else {
      path += ` L ${startingPoint.x} ${pushedDestination.y}`;
      path += ` L ${destination.x} ${pushedDestination.y}`;
      path += ` L ${destination.x} ${destination.y}`;

      meetPoint = { x: startingPoint.x, y: pushedDestination.y };
    }
  } else {
    /**
     * ROUTING FROM HORIZONTAL START EDGE
     */
    const goesOppositeDirection =
      (startingEdge === "LEFT" && startingPoint.x <= destination.x) ||
      (startingEdge === "RIGHT" && startingPoint.x >= destination.x);

    if (goesOppositeDirection) {
      const firstX =
        startingEdge === "LEFT"
          ? startingPoint.x - offset.x
          : startingPoint.x + offset.x;

      path += ` L ${firstX} ${startingPoint.y}`;
      path += ` L ${firstX} ${pushedDestination.y}`;
      path += ` L ${destination.x} ${pushedDestination.y}`;
      path += ` L ${destination.x} ${destination.y}`;

      meetPoint = { x: firstX, y: startingPoint.y };
    } else {
      path += ` L ${pushedDestination.x} ${startingPoint.y}`;
      path += ` L ${pushedDestination.x} ${destination.y}`;
      path += ` L ${destination.x} ${destination.y}`;

      meetPoint = { x: pushedDestination.x, y: startingPoint.y };
    }
  }

  return { data: path, meetPoint };
};
