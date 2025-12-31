import { ConnectorStyle } from "./ConnectorStyle";

export type ConnectorPluginData = {
  fromNodeId: string;
  toNodeId: string;
  style: ConnectorStyle;
};
