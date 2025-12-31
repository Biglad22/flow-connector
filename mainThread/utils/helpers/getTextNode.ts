import React from "react";

type Props = {
  text: string;
  fontSize?: number;
};

export default async function getTextNode({
  text,
  fontSize = 24,
}: Props): Promise<TextNode> {
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  const labelPaint = figma.util.solidPaint({ r: 0, g: 0, b: 0 });

  const TextNode = figma.createText();
  TextNode.fontName = { family: "Inter", style: "Semi Bold" };
  TextNode.characters = text;
  TextNode.fontSize = fontSize;
  TextNode.fills = [labelPaint];
  TextNode.textAutoResize = "HEIGHT";
  TextNode.textAlignHorizontal = "CENTER";

  return TextNode;
}
