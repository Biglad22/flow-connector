import { constants } from "../../constants";
import { ConnectionEdge } from "../types/ConnectionEdge";
import { Coordinate } from "../types/coordinate";
import { getAbsoluteCoordinate } from "./getAbsoluteCoordinate";
import { getConnectionEdgeCoordinate } from "./getConnectionEdgeCoordinate";

type Props = {
  target: ReturnType<typeof getAbsoluteCoordinate>;
  other: ReturnType<typeof getAbsoluteCoordinate>;
  otherConnectionEdgeCoord?: Coordinate;
};

export function getConnectorEdge({
  target,
  other,
}: Props): [ConnectionEdge, ConnectionEdge] {
  const tolerance = {
    x: (target.w + other.w) / 2 + constants.DISTANCE_TOLERANCE,
    y: (target.h + other.h) / 2 + constants.DISTANCE_TOLERANCE,
  };

  const targetEdge = getTargetConnectionEdge({
    target,
    other,
    tolerance,
    isAnchor: true,
  });
  const otherEdge = getTargetConnectionEdge({
    target: other,
    other: target,
    tolerance,
  });
  return [targetEdge, otherEdge];
}

// function getNodeConnectorEdge({ target, other }: Props): ConnectionEdge {
//   const dx = other.mid.x - target.mid.x;
//   const dy = other.mid.y - target.mid.y;
//   const absDx = Math.abs(dx);
//   const absDy = Math.abs(dy);

//   const toleranceX = (target.w + other.w) / 2 + constants.DISTANCE_TOLERANCE;
//   const toleranceY = (target.h + other.h) / 2 + constants.DISTANCE_TOLERANCE;

//   // Prioritize horizontal if horizontal gap is bigger
//   if (absDx > absDy) {
//     return dx > toleranceX ? "RIGHT" : "TOP";
//   } else {
//     return dy > toleranceY ? "BOTTOM" : "TOP";
//   }
// }

type RelativePos = "TL" | "TR" | "BL" | "BR";
// THIS FINDS POSITION OF BOX RELATIVE TO A TARGET BOX
/**
 *
 * @param target
 * @param other
 * @returns an array of length = 2, first element is the main relative position, while the second is the fallback position
 */
function getPossibleRelativePos(
  dx: number,
  dy: number,
): [RelativePos, RelativePos] {
  if (dx < 0) {
    if (dy >= 0) return ["TR", "BL"];
    if (dy < 0) return ["BR", "TL"];
  } else {
    if (dy >= 0) return ["TL", "BR"];
    if (dy < 0) return ["BL", "TR"];
  }

  return ["TR", "BL"];
}

function getRelativePos(props: {
  pos: [RelativePos, RelativePos];
  target: ReturnType<typeof getAbsoluteCoordinate>;
  other: ReturnType<typeof getAbsoluteCoordinate>;
  tolerance: Coordinate;
  dx: number;
  dy: number;
}) {
  const absDx = Math.abs(props.dx);
  const absDy = Math.abs(props.dy);
  const [mainPos, fallbackPos] = props.pos;

  const [firstPoint, secondPoint] = getRelativePosCoordinate(
    mainPos,
    props.target,
  );

  let targetPos: RelativePos = mainPos;

  const firstPointSafe = isNotInBox(
    firstPoint.edge,
    firstPoint.coord,
    props.other,
  );
  const secPointSafe = isNotInBox(
    secondPoint.edge,
    secondPoint.coord,
    props.other,
  );
  const hasTolerance = absDx >= props.tolerance.x || absDy >= props.tolerance.y;

  if (hasTolerance || firstPointSafe || secPointSafe) targetPos = mainPos;
  else targetPos = fallbackPos;

  return { targetPos, firstPointSafe, secPointSafe, hasTolerance };
}

function getExactConnectionEdge(
  absDx: number,
  absDy: number,
  relativePos: RelativePos,
): ConnectionEdge {
  let edge: ConnectionEdge = "TOP";

  switch (relativePos) {
    case "TR":
      if (absDx > absDy) edge = "RIGHT";
      else edge = "TOP";
      break;

    case "TL":
      if (absDx > absDy) edge = "LEFT";
      else edge = "TOP";
      break;

    case "BR":
      if (absDx > absDy) edge = "RIGHT";
      else edge = "BOTTOM";
      break;

    case "BL":
      if (absDx > absDy) edge = "LEFT";
      else edge = "BOTTOM";
      break;
  }
  return edge;
}

//MAIN FUNCTION FOR GETTING CONNECTION EDGE
function getTargetConnectionEdge(props: {
  target: ReturnType<typeof getAbsoluteCoordinate>;
  other: ReturnType<typeof getAbsoluteCoordinate>;
  tolerance: Coordinate;
  isAnchor?: boolean;
}) {
  const dx = props.target.mid.x - props.other.mid.x;
  const dy = props.target.mid.y - props.other.mid.y;

  const possibleRelativePos = getPossibleRelativePos(dx, dy);
  const exactRelativePos = getRelativePos({
    pos: possibleRelativePos,
    target: props.target,
    tolerance: props.tolerance,
    other: props.other,
    dx,
    dy,
  });

  const absX = Math.abs(dx),
    absY = Math.abs(dy);

  if (props.isAnchor) return getAnchorEdge({ ...exactRelativePos, absX, absY });

  return getExactConnectionEdge(absX, absY, exactRelativePos.targetPos);
}

function getRelativePosCoordinate(
  pos: RelativePos,
  target: ReturnType<typeof getAbsoluteCoordinate>,
): Array<{ coord: Coordinate; edge: ConnectionEdge }> {
  const firstEdge = pos.includes("T") ? "TOP" : "BOTTOM",
    secondEdge = pos.includes("R") ? "RIGHT" : "LEFT";
  return [
    {
      coord: getConnectionEdgeCoordinate(target, firstEdge),
      edge: firstEdge,
    },
    {
      coord: getConnectionEdgeCoordinate(target, secondEdge),
      edge: secondEdge,
    },
  ];
}

function getAnchorEdge(
  props: ReturnType<typeof getRelativePos> & { absX: number; absY: number },
): ConnectionEdge {
  if (props.absX > props.absY)
    return props.targetPos.includes("R") ? "RIGHT" : "LEFT";

  return props.targetPos.includes("T") ? "TOP" : "BOTTOM";
}

function isNotInBox(
  edge: ConnectionEdge,
  point: Coordinate,
  box: ReturnType<typeof getAbsoluteCoordinate>,
) {
  if (edge == "BOTTOM") return point.y <= box.trail.y || point.y >= box.y;
  else if (edge == "TOP") return point.y >= box.y || point.y >= box.y;
  else if (edge == "LEFT") return point.x > box.mid.x;

  return point.x < box.mid.x;
}
