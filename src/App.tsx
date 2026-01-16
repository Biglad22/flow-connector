import "./App.css";
import { ColorPicker } from "./components/colorPicker/ColorPicker";
import SelectionBox from "./components/SelectionBox";
import {
  AlignmentIcon,
  BorderRadiusIcon,
  DashedBorderIcon,
  SolidBorderIcon,
} from "./assets/icons";
import DropMenu from "./components/dropDown/DropMenu";
import NumericInput from "./components/numericInput/NumericInput";
import SelectionButton from "./components/SelectionButton";
import useAppHook from "./hooks/useAppHook";
import type { ConnectorStyle } from "./utils/types/connectorStyle";
import useConnectorEndSelector from "./hooks/useConnectorEndSelector";

function App() {
  const {
    selections,
    handleStyleChange,
    connectorStyles,
    handleSubmission,
    // exportSettings,
    // setExportSettings,
    // handleConnectionExport,
  } = useAppHook();
  const {
    endOptions,
    startOptions,
    //exportFormatOption
  } = useConnectorEndSelector();

  return (
    <div className="p-4 space-y-4 hide-scroller h-full overflow-auto">
      <SelectionBox
        selections={selections}
        onChange={(value: string) => handleStyleChange("label", value)}
        connectorLabel={connectorStyles.label}
      />
      {/* COLOR SELECTOR */}
      <div className="py-0.5">
        <ColorPicker
          value={connectorStyles.stroke}
          onChange={(value: string) => handleStyleChange("stroke", value)}
        />
      </div>

      <div className="flex items-center justify-between gap-4 py-0.5">
        <div className="flex items-center gap-2">
          <NumericInput
            label={<AlignmentIcon className="fill-text" />}
            name="connector-width"
            onChange={(value: number) =>
              handleStyleChange("strokeWeight", value)
            }
            value={connectorStyles.strokeWeight}
          />
          <NumericInput
            label={<BorderRadiusIcon className="stroke-text" />}
            name="connector-border-radius"
            onChange={(value: number) => handleStyleChange("radius", value)}
            value={connectorStyles.radius}
          />
        </div>
        <div className="flex items-center gap-2">
          <SelectionButton
            onClick={(value: ConnectorStyle["strokeStyle"]) => {
              handleStyleChange("strokeStyle", value ? value : "DASHED");
              handleStyleChange("dashPattern", value ? 0 : 1);
            }}
            value="solid"
            isActive={connectorStyles.strokeStyle?.toLowerCase() == "solid"}
            label={<SolidBorderIcon className="stroke-text h-3.5" />}
          />
          <NumericInput
            label={<DashedBorderIcon className="stroke-text h-3.5" />}
            name="connector-dashed-border"
            onChange={(value: number) => {
              handleStyleChange("dashPattern", value);
              handleStyleChange("strokeStyle", value > 0 ? "DASHED" : "SOLID");
            }}
            value={connectorStyles.dashPattern}
          />
        </div>
      </div>

      {/* CONNECTOR STYLE  */}
      <div className="flex items-center justify-between">
        <label htmlFor="start" className="flex items-center gap-1">
          <span className="text-text">Start</span>
          <DropMenu
            onChange={(value: string) =>
              handleStyleChange("startType", value as any)
            }
            name="start"
            value={connectorStyles.startType!}
            options={startOptions}
          />
        </label>
        <label htmlFor="end" className="flex items-center gap-1">
          <span className="text-text">End</span>
          <DropMenu
            onChange={(value: string) =>
              handleStyleChange("endType", value as any)
            }
            name="end"
            value={connectorStyles.endType!}
            options={endOptions}
          />
        </label>
      </div>
      {/* {exportSettings.connectorIds.length > 0 && (
        <div className="py-4 space-y-2 border-t border-b border-border">
          <p className="blocks text-text-strong">Export Existing Connections</p>
          <div className="flex items-center gap-2">
            <label
              htmlFor="export_format"
              className="flex flex-1 items-center gap-1"
            >
              <span className="text-text">Format:</span>
              <span className="block flex-1">
                <DropMenu
                  onChange={(value: string) =>
                    setExportSettings((prev) => ({
                      ...prev,
                      exportFormat: value as ExportSettings["format"],
                    }))
                  }
                  name="export_format"
                  value={exportSettings.format}
                  options={exportFormatOption}
                />
              </span>
            </label>
            <button
              className="outlined rounded-sm w-fit py-1! px-2! text-sm font-medium uppercase"
              onClick={handleConnectionExport}
            >
              Export
            </button>
          </div>
        </div>
      )} */}
      <button
        className="fill rounded-4xl w-full text-sm font-medium uppercase"
        onClick={handleSubmission}
        disabled={selections.length < 2 || selections.length > 2}
      >
        Apply
      </button>
    </div>
  );
}

export default App;
