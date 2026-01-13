// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

import { refineSelectionsAndPostMsgToUI } from "./handlers/refineSelectionsAndPostMsgToUI";
import presentToast from "./handlers/presentToast";
import { isSelectionProgrammatic } from "./context/SelectionIntent";
import {
  drawConnectorEvent,
  exportConnectionsEvent,
  updateConnectorEvent,
} from "./eventCallbacks/connectorEvent";
import { documentChangeEvent } from "./eventCallbacks/documentChangeEvent";
import { parameterModeEvent } from "./eventCallbacks/parameterModeEvent";

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

figma.on("run", async ({ parameters }) => {
  if (parameters && "label" in parameters) {
    return await parameterModeEvent(parameters);
  }

  // This shows the HTML page in "ui.html".
  figma.showUI(__html__, { themeColors: true, width: 300, height: 500 });

  await figma.loadAllPagesAsync();
  figma.on("documentchange", documentChangeEvent);
});

figma.ui.onmessage = async (msg) => {
  if (msg.type == "ui-ready") {
    const selections = figma.currentPage.selection;
    await refineSelectionsAndPostMsgToUI(selections);
  } else if (msg.type === "notify") {
    presentToast(msg.message);
  } else if (["draw-connector", "update-connector"].includes(msg.type)) {
    const payload: any = msg.payload;
    if (msg.type == "draw-connector") {
      return await drawConnectorEvent(payload);
    } else {
      return await updateConnectorEvent(payload);
    }
  } else if (msg.type == "export-connections") {
    return await exportConnectionsEvent(msg.payload);
  }
};

figma.on("selectionchange", async () => {
  if (isSelectionProgrammatic()) return;
  const selections = figma.currentPage.selection;
  await refineSelectionsAndPostMsgToUI(selections);
});
