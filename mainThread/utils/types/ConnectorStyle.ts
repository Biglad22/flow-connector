import { ConnectorEnd } from "./ConnectorEnd";

export type ConnectorStyle = {
    strokeType: "SOLID" | "DASHED";
    startType: ConnectorEnd;
    endType: ConnectorEnd;
    dashPattern?: number;
    stroke?: string;
    strokeWeight?: number;
    radius?: number;
    label?: string;
}