import { constants } from "../../constants";
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
  const labelPaint = figma.util.solidPaint(
    style.stroke ?? { r: 0, g: 0, b: 0 },
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
  label.strokes = [labelPaint];

  if ((labelText as TextNode)?.characters !== style.label) {
    await figma.loadFontAsync(constants.CONNECTOR_LABEL_FONT_STYLE);
    (labelText as TextNode).characters = style?.label!;

    label.resize(
      labelText.width +
        constants.CONNECTOR_LABEL_PADDING.x +
        (style.strokeWeight ?? 2) * 2,
      label.height,
    );

    (labelText as TextNode).x =
      constants.CONNECTOR_LABEL_PADDING.x / 2 + (style.strokeWeight ?? 2);
    (labelText as TextNode).y =
      constants.CONNECTOR_LABEL_PADDING.y / 2 + (style.strokeWeight ?? 2);

    const containerX =
      meetPoint.x - (style.strokeWeight ?? 2) - label.width / 2;
    const containerY =
      meetPoint.y - (style.strokeWeight ?? 2) - label.height / 2;
  }
};
