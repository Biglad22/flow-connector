import { ConnectorPluginData } from "./ConnectorPluginData";

export type ChangedConnection = {
  type: DocumentChange["type"];
  node?: SceneNode | RemovedNode;
  origin: DocumentChange["origin"];
} & {
  connector: GroupNode;
  connectorMetaData: ConnectorPluginData;
};
