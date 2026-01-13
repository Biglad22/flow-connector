import { constants } from "../../constants";
import { invertColor } from "../../utils/helpers/getInverseColor";
import { getPluginData } from "../../utils/helpers/handleConnectorPersistence/getPluginData";
import { ConnectorPart } from "../../utils/types/ConnectorPart";
import { ConnectorStyle } from "../../utils/types/ConnectorStyle";
import { Coordinate } from "../../utils/types/coordinate";
import presentToast from "../presentToast";

export const updateConnectorLabel = async (
  label: FrameNode,
  style: ConnectorStyle,
  meetPoint: Coordinate,
) => {
  if (label && !style.label) return label.remove();
  const labelFramePaint = figma.util.solidPaint(
    style.stroke ?? { r: 0, g: 0, b: 0 },
  );
  const labelPaint = figma.util.solidPaint(
    invertColor(style.stroke ?? { r: 0, g: 0, b: 0 }),
  );

  const labelText = label?.findChild(
    (node) =>
      node.type == "TEXT" &&
      getPluginData<{ role: ConnectorPart }>(node)?.role ==
        "CONNECTOR_LABEL_TEXT",
  );

  if (!labelText)
    return presentToast({
      message: "Connector label text node missing or corrupted",
      error: true,
    });

  (labelText as TextNode).fills = [labelPaint];

  // Update container (auto-layout frame) appearance
  label.strokes = [labelFramePaint];
  label.fills = [labelFramePaint];
  label.cornerRadius = style.radius ?? 1;
  label.strokeWeight = style.strokeWeight ?? 2;

  // If this is an Auto Layout frame (created in drawConnectorLabel), update its paddings
  const stroke = style.strokeWeight ?? 2;
  try {
    // Some FrameNodes (auto-layout) expose padding properties
    (label as FrameNode).paddingLeft =
      constants.CONNECTOR_LABEL_PADDING.x / 2 + stroke;
    (label as FrameNode).paddingRight =
      constants.CONNECTOR_LABEL_PADDING.x / 2 + stroke;
    (label as FrameNode).paddingTop =
      constants.CONNECTOR_LABEL_PADDING.y / 2 + stroke;
    (label as FrameNode).paddingBottom =
      constants.CONNECTOR_LABEL_PADDING.y / 2 + stroke;
  } catch (e) {
    // ignore if padding properties are not available on this frame
  }

  // For Auto Layout frames we should not manually set the child's x/y or resize the container.
  // Let the frame size itself based on the text and paddings, then center it on the meet point.
  if ((labelText as TextNode)?.characters !== style.label) {
    await figma.loadFontAsync(constants.CONNECTOR_LABEL_FONT_STYLE);
    (labelText as TextNode).characters = style?.label!;

    // Center the auto-layout frame on the provided coordinate after text change
    label.x = meetPoint.x - label.width / 2;
    label.y = meetPoint.y - label.height / 2;
  }
};
