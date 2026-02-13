import { ConnectorPluginData } from "./ConnectorPluginData";

export type ChangedConnection = {
  node?: SceneNode | RemovedNode;
} & DocumentChange & {
    connector: GroupNode;
    connectorMetaData: ConnectorPluginData;
  };
