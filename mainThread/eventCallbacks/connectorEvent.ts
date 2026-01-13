import exportConnections from "../handlers/connectionExportFunction/exportConnections";
import drawConnectionLine from "../handlers/connectorFunctions/drawConnectionLine";
import updateConnector from "../handlers/connectorFunctions/updateConnector";
import presentToast from "../handlers/presentToast";
import {
  getNodesConnectorInfo,
  prepareConnector,
} from "../handlers/refineSelectionsAndPostMsgToUI";

//=================== DRAWS CONNECTOR
export async function drawConnectorEvent(payload: any) {
  const numberOfSelection = figma.currentPage.selection.length;

  if (numberOfSelection < 2 || numberOfSelection > 2) {
    return presentToast({
      message: "Select two nodes to create a connection.",
      error: true,
    });
  }
  payload.selections = figma.currentPage.selection;
  await drawConnectionLine(payload);
}

//=================== UPDATES CONNECTOR
export async function updateConnectorEvent(payload: any) {
  const numberOfSelection = figma.currentPage.selection.length;

  if (numberOfSelection < 1) return;
  const selection = figma.currentPage.selection;
  let connectorInfo;

  if (numberOfSelection == 1)
    connectorInfo = (await prepareConnector(selection[0]))?.messagePayload;
  else connectorInfo = await getNodesConnectorInfo(selection);

  if (!connectorInfo || !connectorInfo?.connector) return;
  const { fromNodeId, connector, toNodeId } = connectorInfo;
  await updateConnector({
    connector: connector as GroupNode,
    toNodeId,
    fromNodeId,
    style: payload,
    applyStyle: true,
  });
}

export async function exportConnectionsEvent(payload: {
  connectorIds: string[];
  format: ExportSettings["format"];
}) {
  await exportConnections(payload);
}
