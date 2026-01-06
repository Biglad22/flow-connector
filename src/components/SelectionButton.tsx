import type { ReactNode } from "react";

type Props = {
  label: string | ReactNode;
  value: any;
  isActive?: boolean;
  onClick?: (value: Props["value"]) => void;
};

export default function SelectionButton({
  value,
  onClick,
  label,
  isActive,
}: Props) {
  return (
    <button
      className={`rounded-md p-1 text-sm text-text border-2 hover:bg-secondary-background ${isActive ? "bg-secondary-background border-border-brand" : "bg-transparent border-transparent"}`}
      type="button"
      onClick={() => onClick?.(isActive ? undefined : value)}
    >
      {label}
    </button>
  );
}
