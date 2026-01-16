import { constants } from "../../constants";
import { invertColor } from "../../utils/helpers/getInverseColor";
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

  const labelFramePaint = figma.util.solidPaint(
    props.color ?? { r: 0, g: 0, b: 0 },
  );
  const labelPaint = figma.util.solidPaint(
    invertColor(props.color ?? { r: 0, g: 0, b: 0 }),
  );
  // const labelPaint = figma.util.solidPaint(
  //   props.color === "#000" ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 },
  // );

  const label = figma.createText();
  label.fontName = constants.CONNECTOR_LABEL_FONT_STYLE;
  label.characters = props.label;
  label.fontSize = constants.CONNECTOR_LABEL_FONT_SIZE;
  label.fills = [labelPaint];
  persistPluginData(label, { role: "CONNECTOR_LABEL_TEXT" });

  const labelContainer = figma.createFrame();
  labelContainer.strokes = [labelFramePaint];
  labelContainer.strokeWeight = props.strokeWeight ?? 2;
  labelContainer.fills = [labelFramePaint];
  labelContainer.cornerRadius = props.radius ?? 1;
  labelContainer.clipsContent = false;

  // Make it an Auto Layout frame
  labelContainer.layoutMode = "HORIZONTAL";
  labelContainer.primaryAxisSizingMode = "AUTO";
  labelContainer.counterAxisSizingMode = "AUTO";
  labelContainer.primaryAxisAlignItems = "CENTER";
  labelContainer.counterAxisAlignItems = "CENTER";
  labelContainer.itemSpacing = 0;

  const stroke = props.strokeWeight ?? 2;
  labelContainer.paddingLeft = constants.CONNECTOR_LABEL_PADDING.x / 2 + stroke;
  labelContainer.paddingRight =
    constants.CONNECTOR_LABEL_PADDING.x / 2 + stroke;
  labelContainer.paddingTop = constants.CONNECTOR_LABEL_PADDING.y / 2 + stroke;
  labelContainer.paddingBottom =
    constants.CONNECTOR_LABEL_PADDING.y / 2 + stroke;

  labelContainer.appendChild(label);

  // Center the auto frame on the provided coordinate
  labelContainer.x = props.coordinates.x - labelContainer.width / 2;
  labelContainer.y = props.coordinates.y - labelContainer.height / 2;

  return labelContainer;
}
