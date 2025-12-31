// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

import {
  getConnectorInfo,
  refineSelectionsAndPostMsgToUI,
} from "./handlers/refineSelectionsAndPostMsgToUI";
import drawConnectionLine from "./handlers/connectorFunctions/drawConnectionLine";
import getAffectedConnectors from "./utils/helpers/handleDocumentChange/getAffectedConnectors";
import updateConnector from "./handlers/connectorFunctions/updateConnector";
import presentToast from "./handlers/presentToast";
import exportConnections from "./handlers/connectionExportFunction/exportConnections";
import { unlinkConnector } from "./utils/helpers/handleConnectorPersistence/unlinkConnector";

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

figma.on("run", async ({ parameters }) => {
  // This shows the HTML page in "ui.html".

  if (parameters && "label" in parameters) {
    const selections = figma.currentPage.selection;
    if (selections.length < 2)
      presentToast({
        message: "Select two or more nodes to create a connection.",
        error: true,
      });
    await drawConnectionLine({
      selections,
      endType: "ARROW",
      startType: "ARROW",
      label: parameters?.label || `${selections[0].name}-${selections[1].name}`,
      strokeType: "SOLID",
    });

    figma.closePlugin();
  }

  await figma.loadAllPagesAsync();
  figma.showUI(__html__, { themeColors: true, width: 300, height: 500 });

  figma.on("documentchange", async ({ documentChanges }) => {
    const affectedConnectors = await getAffectedConnectors(documentChanges);

    for (const {
      connector,
      type,
      connectorMetaData: { fromNodeId, style, toNodeId },
    } of affectedConnectors.values()) {
      switch (type) {
        case "DELETE":
          for (const nodeId of [fromNodeId, toNodeId]) {
            await unlinkConnector({
              nodeId,
              connectorId: connector.id,
            });
          }
          connector.remove();
          break;
        case "CREATE":
          break;
        case "PROPERTY_CHANGE":
          updateConnector({
            connector,
            fromNodeId,
            style,
            toNodeId,
          });
          break;
        default:
          break;
      }
    }
  });
});

figma.ui.onmessage = async (msg) => {
  if (msg.type == "ui-ready") {
    const selections = figma.currentPage.selection;
    await refineSelectionsAndPostMsgToUI(selections);
  } else if (msg.type === "notify") {
    figma.notify(msg.message, {
      timeout: msg.timeout ?? 1500,
    });
  } else if (["draw-connector", "update-connector"].includes(msg.type)) {
    const payload: any = msg.payload;

    if (
      figma.currentPage.selection.length < 2 ||
      figma.currentPage.selection.length > 2
    )
      return presentToast({
        message: "Select two nodes to create a connection.",
        error: true,
      });

    if (msg.type == "draw-connector") {
      payload.selections = figma.currentPage.selection;
      await drawConnectionLine(payload);
    } else {
      const connectorInfo = await getConnectorInfo(figma.currentPage.selection);
      if (!connectorInfo || !connectorInfo.connector) return;

      const { fromNodeId, connector, toNodeId } = connectorInfo;
      await updateConnector({
        connector,
        toNodeId,
        fromNodeId,
        style: payload,
        applyStyle: true,
      });
    }

    figma.closePlugin();
  } else if (msg.type == "export-connections") {
    const payload: {
      connectorIds: string[];
      format: ExportSettings["format"];
    } = msg.payload;

    await exportConnections(payload);
  }
};

figma.on("selectionchange", async () => {
  const selections = figma.currentPage.selection;
  await refineSelectionsAndPostMsgToUI(selections);
});
