import { ChangedConnection } from "../../types/ChangedConnection";
import { ConnectorPluginData } from "../../types/ConnectorPluginData";
import retrievePersistedConnectors from "../handleConnectorPersistence/retrievePersistedConnectors";

export default async function getAffectedConnectors(
  documentChanges: DocumentChange[],
) {
  const availableConnectors = await retrievePersistedConnectors();
  const affectedConnectors = new Map<string, ChangedConnection>();

  documentChanges.forEach(({ id, ...changes }) => {
    const assignedConnector = availableConnectors.get(id);
    if (assignedConnector) {
      affectedConnectors.set(id, {
        ...changes,
        ...assignedConnector,
      });
    }
  });

  return affectedConnectors;
}
