import { unlinkConnector } from "./unlinkConnector";

export const verifyConnectorLink = async (props: {
  fromNodeId: string;
  toNodeId: string;
  connectorId: string;
}): Promise<boolean> => {
  if (!props.fromNodeId || !props.toNodeId) return false;
  const firstChild = await figma.getNodeByIdAsync(props.fromNodeId);
  const secChild = await figma.getNodeByIdAsync(props.toNodeId);

  let isConnected: boolean = true;

  if (!firstChild && !secChild) {
    isConnected = false;

    for (const node of [firstChild, secChild]) {
      if (node) await unlinkConnector({ node, connectorId: props.connectorId });
    }
  }
  return isConnected;
};
