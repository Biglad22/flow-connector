import { constants } from "../../../constants";
import { getPluginData } from "./getPluginData";
import persistPluginData from "./persistPluginData";
import { retrieveNodeConnector } from "./retrieveNodeConnector";

export const persistConnectorInfo = (
  node: SceneNode,
  payload: NonNullable<Awaited<ReturnType<typeof retrieveNodeConnector>>>,
) => {
  let existingPluginData = getPluginData<Record<string, any>>(
    node,
    constants.PLUGIN_DATA_KEY_NODE,
  );

  let updatedPluginData: any = {};

  if (
    existingPluginData &&
    constants.PLUGIN_DATA_CONNECTOR_INFO in existingPluginData
  ) {
    updatedPluginData = { ...existingPluginData };
    updatedPluginData[constants.PLUGIN_DATA_CONNECTOR_INFO] = [
      ...payload,
      ...existingPluginData[constants.PLUGIN_DATA_CONNECTOR_INFO],
    ];
  } else {
    updatedPluginData = { ...(existingPluginData ?? {}) };
    updatedPluginData[constants.PLUGIN_DATA_CONNECTOR_INFO] = payload;
  }

  persistPluginData(node, updatedPluginData, constants.PLUGIN_DATA_KEY_NODE);
};
