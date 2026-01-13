import drawConnectionLine from "../handlers/connectorFunctions/drawConnectionLine";
import presentToast from "../handlers/presentToast";

export async function parameterModeEvent(parameters: ParameterValues) {
  const selections = figma.currentPage.selection;
  if (selections.length < 2)
    presentToast({
      message: "Select two or more nodes to create a connection.",
      error: true,
    });
  await drawConnectionLine({
    selections,
    endType: "ARROW",
    startType: "ARROW",
    label: parameters?.label || `${selections[0].name}-${selections[1].name}`,
    strokeType: "SOLID",
  });
}
