import { constants } from "../../constants";
import persistPluginData from "../../utils/helpers/handleConnectorPersistence/persistPluginData";
import { Coordinate } from "../../utils/types/coordinate";

type Props = {
  label?: string;
  coordinates: Coordinate;
  color?: string;
  strokeWeight?: number;
  radius?: number;
};
export async function drawConnectorLabel(
  props: Props,
): Promise<FrameNode | undefined> {
  if (!props.label) return;

  await figma.loadFontAsync(constants.CONNECTOR_LABEL_FONT_STYLE);

  const labelPaint = figma.util.solidPaint(props.color ?? { r: 0, g: 0, b: 0 });

  const label = figma.createText();
  label.fontName = constants.CONNECTOR_LABEL_FONT_STYLE;
  label.characters = props.label;
  label.fontSize = 18;
  label.fills = [labelPaint];
  persistPluginData(label, { role: "CONNECTOR_LABEL_TEXT" });

  const containerWidth = label.width + constants.CONNECTOR_LABEL_PADDING.x,
    containerHeight = label.height + constants.CONNECTOR_LABEL_PADDING.y;

  const labelContainer = figma.createFrame();
  labelContainer.resize(
    containerWidth + (props.strokeWeight ?? 2) * 2,
    containerHeight + (props.strokeWeight ?? 2) * 2,
  );
  labelContainer.strokes = [labelPaint];
  labelContainer.strokeWeight = props.strokeWeight ?? 2;
  labelContainer.fills = figma.currentPage.backgrounds;
  labelContainer.cornerRadius = props.radius ?? 1;
  labelContainer.clipsContent = false;
  labelContainer.layoutMode = "NONE";

  const containerX =
    props.coordinates.x - (props.strokeWeight ?? 2) - labelContainer.width / 2;
  const containerY =
    props.coordinates.y - (props.strokeWeight ?? 2) - labelContainer.height / 2;
  labelContainer.x = containerX;
  labelContainer.y = containerY;

  labelContainer.appendChild(label);
  label.x = constants.CONNECTOR_LABEL_PADDING.x / 2 + (props.strokeWeight ?? 2);
  label.y = constants.CONNECTOR_LABEL_PADDING.y / 2 + (props.strokeWeight ?? 2);

  return labelContainer;
}
