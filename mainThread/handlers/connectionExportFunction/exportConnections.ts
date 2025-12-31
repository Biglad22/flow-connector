import { getAbsoluteCoordinate } from "../../utils/helpers/getAbsoluteCoordinate";
import getTextNode from "../../utils/helpers/getTextNode";
import { postMessageToUI } from "../postMessageToUI";
import presentToast from "../presentToast";
import getConnectionsToExport from "./getConnectionsToExport";

type Props = { connectorIds: string[]; format: ExportSettings["format"] };

export default async function exportConnections({
  connectorIds,
  format = "SVG",
}: Props) {
  const WRAPPER_FRAME_PADDING = 64;

  const connections = await getConnectionsToExport({ connectorIds });

  if (!connections || connections.size < 1)
    return presentToast({ message: "No valid connection found" });

  const arrayOfConnection = Array.from(connections.values());

  // WRAPPER FRAME
  const frameToExport = figma.createFrame();
  frameToExport.x = 10000000;
  frameToExport.y = 10000000;

  const minX = Math.min(
    ...arrayOfConnection.map(({ node }) => {
      return (node as any).x;
    }),
  );
  const minY = Math.min(
    ...arrayOfConnection.map(({ node }) => {
      return (node as any).y;
    }),
  );

  frameToExport.resize(
    Math.max(
      ...arrayOfConnection.map(
        ({ node }) => (node as any).x + (node as any).width,
      ),
    ) +
      WRAPPER_FRAME_PADDING * 2 -
      minX,
    Math.max(
      ...arrayOfConnection.map(
        ({ node }) => (node as any).y + (node as any).height,
      ),
    ) +
      WRAPPER_FRAME_PADDING * 2 -
      minY,
  );

  // APPEND NODES TO WRAPPER FRAME
  for (const { type, node } of arrayOfConnection) {
    if (type == "connector") {
      const connectorClone = (node as GroupNode).clone();
      const { x, y } = getAbsoluteCoordinate(connectorClone);
      frameToExport.appendChild(connectorClone);

      connectorClone.x = x - (minX - WRAPPER_FRAME_PADDING);
      connectorClone.y = y - (minY - WRAPPER_FRAME_PADDING);
      continue;
    }

    //CREATE NAME FRAME
    const { h, w, y, x } = getAbsoluteCoordinate(node as SceneNode);
    const nodeLabelFrame = figma.createFrame();
    nodeLabelFrame.strokes = [figma.util.solidPaint({ r: 0, g: 0, b: 0 })];
    nodeLabelFrame.strokeWeight = 2;
    nodeLabelFrame.cornerRadius = 2;
    nodeLabelFrame.x = x - (minX - WRAPPER_FRAME_PADDING);
    nodeLabelFrame.y = y - (minY - WRAPPER_FRAME_PADDING);
    nodeLabelFrame.resize(w, h);

    // TEXT LABEL FOR CONNECTED NODES
    const connectedNodeText = await getTextNode({ text: nodeLabelFrame.name });
    const textLength = nodeLabelFrame.name.length;
    const textPossibleSize = (nodeLabelFrame.width * 0.6) / textLength;
    connectedNodeText.fontSize = Math.max(textPossibleSize, 18);

    connectedNodeText.resize(
      nodeLabelFrame.width * 0.6,
      connectedNodeText.height,
    );
    connectedNodeText.x = nodeLabelFrame.width * 0.2;
    connectedNodeText.y =
      nodeLabelFrame.height / 2 - connectedNodeText.height / 2;

    nodeLabelFrame.appendChild(connectedNodeText);
    frameToExport.appendChild(nodeLabelFrame);
  }

  const exportResult = await frameToExport.exportAsync({
    format,
    constraint: { type: "SCALE", value: 2 },
  });
  postMessageToUI({
    type: "connection-export-result",
    exportResult,
    format,
  });
  frameToExport.remove();

}
