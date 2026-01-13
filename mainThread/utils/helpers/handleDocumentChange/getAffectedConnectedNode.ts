import { ChangedConnection } from "../../types/ChangedConnection";
import retrievePersistedConnectors from "../handleConnectorPersistence/retrievePersistedConnectors";

export default async function getAffectedConnectedNode(
  documentChanges: DocumentChange[],
) {
  const availableConnectedNodes = await retrievePersistedConnectors();
  const affectedConnectedNodes = new Map<string, ChangedConnection>();
  const affectedConnectors = new Map<string, ChangedConnection>();

  documentChanges.forEach(({ id, ...changes }) => {
    const connectedNode = availableConnectedNodes.indexConnectedNodes.get(id);
    const connectorNode = availableConnectedNodes.indexConnectors.get(id);
    if (connectedNode) {
      affectedConnectedNodes.set(id, {
        ...changes,
        ...connectedNode,
      });
    } else if (connectorNode) {
      affectedConnectors.set(id, {
        ...changes,
        ...connectorNode,
      });
    }
  });

  return { affectedConnectedNodes, affectedConnectors };
}
