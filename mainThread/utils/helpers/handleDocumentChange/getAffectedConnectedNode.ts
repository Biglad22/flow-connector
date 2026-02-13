import { ChangedConnection } from "../../types/ChangedConnection";
import retrievePersistedConnectors from "../handleConnectorPersistence/retrievePersistedConnectors";

export default async function getAffectedConnectedNode(
  documentChanges: DocumentChange[],
) {
  const availableConnectedNodes = await retrievePersistedConnectors();
  const affectedConnectedNodes = new Map<string, ChangedConnection>();
  const affectedConnectors = new Map<string, ChangedConnection>();

  const changesMap = new Map<string, DocumentChange>();

  documentChanges.forEach((change) => {
    const storedChange = changesMap.get(change.id);
    if (storedChange && storedChange?.type == "CREATE") return;
    if (
      change.type == "PROPERTY_CHANGE" &&
      change.properties.length == 1 &&
      change.properties.includes("pluginData")
    )
      return;
    changesMap.set(change.id, change);
  });

  for (const changes of changesMap.values()) {
    const connectedNode = availableConnectedNodes.indexConnectedNodes.get(
      changes.id,
    );
    const connectorNode = availableConnectedNodes.indexConnectors.get(
      changes.id,
    );

    if (connectedNode) {
      affectedConnectedNodes.set(changes.id, {
        ...changes,
        ...connectedNode,
      });
    } else if (connectorNode) {
      affectedConnectors.set(changes.id, {
        ...changes,
        ...connectorNode,
      });
    }
  }

  return { affectedConnectedNodes, affectedConnectors };
}
