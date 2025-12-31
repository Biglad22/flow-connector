import type { ConnectorEnd } from "./connectorEnd";

export type ConnectorStyle = {
  startType: ConnectorEnd;
  endType: ConnectorEnd;
  stroke?: string;
  strokeStyle?: "SOLID" | "DASHED";
  strokeWeight?: number;
  dashPattern?: number;
  radius?: number;
  label?: string;
};
