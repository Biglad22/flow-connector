import { constants } from "../../constants";
import { ConnectionEdge } from "../types/ConnectionEdge";
import { Coordinate } from "../types/coordinate";
import { getAbsoluteCoordinate } from "./getAbsoluteCoordinate";

type Props = {
  target: ReturnType<typeof getAbsoluteCoordinate>;
  other: ReturnType<typeof getAbsoluteCoordinate>;
  otherConnectionEdgeCoord?: Coordinate;
};

export function getConnectorEdge({
  target,
  other,
}: Props): [ConnectionEdge, ConnectionEdge] {
  const targetEdge = getNodeConnectorEdge({ target, other });
  const otherEdge = getNodeConnectorEdge({ target: other, other: target });
  return [targetEdge, otherEdge];
}

function getNodeConnectorEdge({ target, other }: Props): ConnectionEdge {
  const dx = other.mid.x - target.mid.x;
  const dy = other.mid.y - target.mid.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  const toleranceX = (target.w + other.w) / 2 + constants.DISTANCE_TOLERANCE;
  const toleranceY = (target.h + other.h) / 2 + constants.DISTANCE_TOLERANCE;

  // Prioritize horizontal if horizontal gap is bigger
  if (absDx > absDy) {
    return dx > toleranceX ? "RIGHT" : "LEFT";
  } else {
    return dy > toleranceY ? "BOTTOM" : "TOP";
  }
}
