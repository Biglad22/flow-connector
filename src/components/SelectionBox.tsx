import { type ChangeEvent } from "react";
import { ArrowHead } from "../assets/icons";
import type { SelectedNode } from "../utils/types/connectorNode";

type Props = {
  selections?: Array<SelectedNode>;
  connectorLabel?: string;
  onChange?: (value: string) => void;
};

export default function SelectionBox({
  selections,
  connectorLabel,
  onChange,
}: Props) {
  const boxGeneralStyle =
    "rounded-xl bg-background border w-24 h-30 p-2! text-xs text-center line-clamp-2 text-text flex items-center justify-center";
  const boxStyle = (isSelected: boolean) =>
    `${boxGeneralStyle} ${!isSelected ? "border-dashed border-border" : "border-border-brand"}`;

  return (
    <div className="w-full px-4 py-4 rounded-2xl bg-secondary-background space-y-4">
      <p className="text-center text-text-strong font-sans font-normal text-sm leading-none ">
        Select the two frames you want to connect
      </p>
      {!selections || selections?.length <= 2 ? (
        <div className="flex items-center gap-4 justify-center">
          <div className={boxStyle(Boolean(selections?.[0]))}>
            {selections && selections[0] ? selections[0]?.name : "unselected"}
          </div>
          <ArrowHead className="stroke-text size-5" />
          <div className={boxStyle(Boolean(selections?.[1]))}>
            {selections && selections[1] ? selections[1]?.name : "unselected"}
          </div>
        </div>
      ) : (
        <div
          className="
          flex flex-col items-center gap-2
          max-h-30 overflow-auto
          [mask-image:linear-gradient(to_bottom,black_70%,transparent)]
          [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent)]
        "
        >
          {selections.map(({ name }) => (
            <div className="py-3 min-h-fit text-center px-4 truncate w-full rounded-md bg-background text-xs">
              {name}
            </div>
          ))}
        </div>
      )}
      <input
        value={connectorLabel || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange?.(e.target.value)
        }
        placeholder="Enter Connector label"
        type="text"
        className="bg-background border-2 border-background focus:outline-0 focus:border-border-brand rounded-lg text-sm px-3 py-2 w-full caret-border-brand text-text-strong placeholder:text-text"
      />
    </div>
  );
}
