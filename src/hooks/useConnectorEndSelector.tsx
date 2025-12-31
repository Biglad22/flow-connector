import type { ReactNode } from "react";
import {
  FlatLine,
  ArrowHead,
  ArrowHeadFilled,
  RoundEnd,
  RoundEndFilled,
} from "../assets/icons";
import type { ConnectorEnd } from "../utils/types/connectorEnd";

export default function useConnectorEndSelector() {
  const startOptions: Array<{ label: ReactNode; value: ConnectorEnd }> = [
    { label: <FlatLine className="stroke-text" />, value: "FLAT" },
    { label: <ArrowHead className="stroke-text rotate-180" />, value: "ARROW" },
    {
      label: <ArrowHeadFilled className="fill-text stroke-text rotate-180" />,
      value: "ARROW_FILLED",
    },
    { label: <RoundEnd className="stroke-text" />, value: "ROUND" },
    {
      label: <RoundEndFilled className="fill-text stroke-text" />,
      value: "ROUND_FILLED",
    },
  ];
  const endOptions: Array<{ label: ReactNode; value: ConnectorEnd }> = [
    { label: <FlatLine className="stroke-text" />, value: "FLAT" },
    { label: <ArrowHead className="stroke-text" />, value: "ARROW" },
    {
      label: <ArrowHeadFilled className="fill-text stroke-text" />,
      value: "ARROW_FILLED",
    },
    { label: <RoundEnd className="stroke-text  rotate-180" />, value: "ROUND" },
    {
      label: <RoundEndFilled className="fill-text stroke-text  rotate-180" />,
      value: "ROUND_FILLED",
    },
  ];

  const exportFormatOption: Array<{
    label: ExportSettings["format"];
    value: ExportSettings["format"];
  }> = [
    {
      label: "JPG",
      value: "JPG",
    },
    {
      label: "PDF",
      value: "PDF",
    },
    {
      label: "SVG",
      value: "SVG",
    },
  ];

  return { startOptions, endOptions, exportFormatOption };
}
