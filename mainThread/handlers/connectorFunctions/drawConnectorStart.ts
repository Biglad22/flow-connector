import { constants } from "../../constants";
import { Axis } from "../../utils/types/Axis";
import { ConnectorEnd } from "../../utils/types/ConnectorEnd";
import { drawEllipse } from "./drawEllipse";

function arrowPath(
  x: number,
  y: number,
  axis: Axis,
  filled: boolean,
  size: number,
) {
  if (axis === "hor") {
    // Arrow pointing LEFT (line start)
    return filled
      ? `M ${x} ${y} L ${x + size} ${y - size / 2} L ${x + size} ${y + size / 2} Z`
      : `M ${x} ${y} L ${x + size} ${y - size / 2} M ${x} ${y} L ${x + size} ${y + size / 2}`;
  }

  // axis === "vert"
  // Arrow pointing UP (line start)
  return filled
    ? `M ${x} ${y} L ${x - size / 2} ${y + size} L ${x + size / 2} ${y + size} Z`
    : `M ${x} ${y} L ${x - size / 2} ${y + size} M ${x} ${y} L ${x + size / 2} ${y + size}`;
}

export const drawLineStart = (props: {
  type: ConnectorEnd;
  x: number;
  y: number;
  axis: Axis;
  stroke?: string;
  strokeWeight?: number;
  fill?: string;
}): VectorNode | EllipseNode | undefined => {
  const CONNECTOR_HEAD_SIZE =
    constants.CONNECTOR_END_SIZE * ((props.strokeWeight || 2) / 2);

  if (props.type === "FLAT") return;
  if (props.type === "ARROW" || props.type === "ARROW_FILLED") {
    const vector = figma.createVector();

    const data = arrowPath(
      props.x,
      props.y,
      props.axis,
      props.type === "ARROW_FILLED",
      CONNECTOR_HEAD_SIZE,
    );

    vector.vectorPaths = [
      {
        windingRule: "EVENODD",
        data,
      },
    ];

    if (props.type === "ARROW_FILLED" && props.fill) {
      vector.fills = [figma.util.solidPaint(props.fill)];
    } else {
      vector.fills = [];
    }

    if (props.stroke) {
      vector.strokes = [figma.util.solidPaint(props.stroke)];
    }

    if (props.strokeWeight) {
      vector.strokeWeight = props.strokeWeight;
    }

    return vector;
  }

  // ROUND / ROUND_FILLED
  if (props.type === "ROUND" || props.type === "ROUND_FILLED") {
    const ellipseProps = props;

    ellipseProps.x =
      props.axis === "hor" ? props.x : props.x - CONNECTOR_HEAD_SIZE / 2;
    ellipseProps.y =
      props.axis === "vert" ? props.y : props.y - CONNECTOR_HEAD_SIZE / 2;

    return drawEllipse(ellipseProps);
  }
};
