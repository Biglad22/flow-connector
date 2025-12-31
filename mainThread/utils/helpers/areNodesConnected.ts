import { NodeConnection } from "../types/NodeConnection";
export function areNodesConnected(
  nodeAId: string,
  nodeBId: string,
  connections: NodeConnection[],
): { isConnected: boolean; connector: string | undefined } {
  const match = connections.find((conn) => {
    return (
      (conn.connection.from === nodeAId && conn.connection.to === nodeBId) ||
      (conn.connection.from === nodeBId && conn.connection.to === nodeAId)
    );
  });

  return {
    isConnected: Boolean(match),
    connector: match?.connectorId,
  };
}
