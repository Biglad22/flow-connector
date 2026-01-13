import { getConnection } from "../../utils/helpers/getConnection";
import { persistConnectorInfo } from "../../utils/helpers/handleConnectorPersistence/persistConnectorInfo";
import persistPluginData from "../../utils/helpers/handleConnectorPersistence/persistPluginData";
import { ConnectorStyle } from "../../utils/types/ConnectorStyle";

type Props = {
  selections: Readonly<SceneNode[]> | SceneNode[];
} & ConnectorStyle;

export default async function drawConnectionLine(props: Props) {
  const connection = await getConnection(props);

  if (!connection) return;
  const { nodes } = connection;

  const connectorGroup = figma.group(nodes, figma.currentPage);

  // stores store information
  persistPluginData(connectorGroup, {
    fromNodeId: props.selections[0].id,
    toNodeId: props.selections[1].id,
    style: {
      ...props,
    },
  });

  // PERSIST CONNECTORS
  persistConnectorInfo(props.selections[0], [
    {
      connectorId: connectorGroup.id,
      connection: {
        from: props.selections[0].id,
        to: props.selections[1].id,
      },
    },
  ]);
  
  persistConnectorInfo(props.selections[1], [
    {
      connectorId: connectorGroup.id,
      connection: {
        from: props.selections[0].id,
        to: props.selections[1].id,
      },
    },
  ]);
}
