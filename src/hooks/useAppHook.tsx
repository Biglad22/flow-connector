import { useState, useEffect } from "react";
import type { ConnectionInfo } from "../utils/types/connectionInfo";
import type { SelectedNode } from "../utils/types/connectorNode";
import type { ConnectorStyle } from "../utils/types/connectorStyle";

export default function useAppHook() {
  const [connectorStyles, setConnectorStyles] = useState<ConnectorStyle>({
    stroke: "#000000",
    startType: "ARROW",
    endType: "ARROW",
    radius: 0,
    strokeStyle: "SOLID",
    strokeWeight: 2,
  });

  const [exportSettings, setExportSettings] = useState<{
    format: ExportSettings["format"];
    connectorIds: string[];
  }>({ format: "JPG", connectorIds: [] });

  const [selections, setSelections] = useState<SelectedNode[]>([]);
  const [connectionInfo, setConnectionInfo] = useState<{
    isConnected: boolean;
    connections: ConnectionInfo[];
  }>({
    connections: [],
    isConnected: false,
  });

  const handleStyleChange = <T extends keyof ConnectorStyle>(
    name: T,
    value: ConnectorStyle[T],
  ) => {
    setConnectorStyles((prev) => ({ ...prev, [name]: value }));
  };
  const downloadConnections = (event: MessageEvent<any>) => {
    const { exportResult, format } = event.data.pluginMessage;

    const mimeMap: Record<string, string> = {
      PNG: "image/png",
      JPG: "image/jpeg",
      SVG: "image/svg+xml",
    };

    const extensionMap: Record<string, string> = {
      PNG: "png",
      JPG: "jpg",
      SVG: "svg",
    };

    const blob = new Blob([exportResult], {
      type: mimeMap[format],
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `flow-connection-${Date.now()}.${extensionMap[format as ExportSettings["format"]]}`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const getPluginMessages = (event: MessageEvent<any>) => {
    const pluginMsg = event.data.pluginMessage;
    if (pluginMsg.type == "selections") {
      setSelections(pluginMsg.selections || []);
      const connectorIds = pluginMsg.connections?.map(
        ({ connectorId }: any) => connectorId,
      );

      setExportSettings((prev) => ({ ...prev, connectorIds }));

      if (pluginMsg.isConnected && pluginMsg.style) {
        setConnectorStyles((prev) => ({ ...prev, ...pluginMsg.style }));
      }

      setConnectionInfo({
        isConnected: (pluginMsg.isConnected as boolean) || false,
        connections: pluginMsg.connections as any,
      });
    } else if (pluginMsg.type == "connection-export-result") {
      downloadConnections(event);
    }
  };

  useEffect(() => {
    window.addEventListener("message", getPluginMessages);
    parent.postMessage({ pluginMessage: { type: "ui-ready" } }, "*");

    return () => window.removeEventListener("message", getPluginMessages);
  }, []);

  const handleSubmission = () => {
    let type = "draw-connector";
    if (selections.length == 2 && connectionInfo.isConnected)
      type = "update-connector";
    parent.postMessage(
      {
        pluginMessage: {
          type,
          payload: {
            ...connectorStyles,
          },
        },
      },
      "*",
    );
  };

  const handleConnectionExport = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "export-connections",
          payload: exportSettings,
        },
      },
      "*",
    );
  };

  return {
    handleSubmission,
    handleStyleChange,
    selections,
    connectionInfo,
    connectorStyles,
    handleConnectionExport,
    exportSettings,
    setExportSettings,
  };
}
