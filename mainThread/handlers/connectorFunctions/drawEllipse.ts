import { constants } from "../../constants";
import { ConnectorEnd } from "../../utils/types/ConnectorEnd";

type Props = {
  type: ConnectorEnd;
  x: number;
  y: number;
  stroke?: string;
  strokeWeight?: number;
  fill?: string;
};

export function drawEllipse(props: Props) {
  const CONNECTOR_HEAD_SIZE =
    constants.CONNECTOR_END_SIZE * ((props.strokeWeight || 2) / 2);

  let ellipse = figma.createEllipse();
  ellipse.resize(CONNECTOR_HEAD_SIZE, CONNECTOR_HEAD_SIZE);
  ellipse.x = props.x;
  ellipse.y = props.y;

  if (props.type == "ROUND_FILLED" && props.fill)
    ellipse.fills = [figma.util.solidPaint(props.fill)];
  else ellipse.fills = figma.currentPage.backgrounds;

  if (props.stroke) ellipse.strokes = [figma.util.solidPaint(props.stroke)];
  if (props.strokeWeight) ellipse.strokeWeight = props.strokeWeight;

  return ellipse;
}
