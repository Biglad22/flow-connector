import { constants } from "../../../constants";
import { ConnectorStyle } from "../../types/ConnectorStyle";

export default function persistPluginData<
  T extends SceneNode,
  V extends Record<string, any>,
>(node: T, payload: V, key: string = constants.PLUGIN_DATA_KEY_CONNECTOR) {
  return node.setPluginData(key, JSON.stringify(payload));
}
