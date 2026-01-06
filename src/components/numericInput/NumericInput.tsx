import type { ChangeEvent, ComponentProps, ReactNode } from "react";

type Props = {
  label: string | ReactNode;
  onChange?: (value: number) => void;
  value?: number;
} & Omit<ComponentProps<"input">, "onChange" | "type">;

export default function NumericInput({
  onChange,
  value,
  label,
  ...props
}: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const refinedValue = Number(e.target.value);
    onChange?.(isNaN(refinedValue) ? 0 : refinedValue);
  };
  return (
    <label
      htmlFor={props.name}
      className="flex items-center gap-0 border-2 border-transparent focus-within:bg-secondary-background hover:bg-secondary-background focus-within:border-border-brand rounded-md  px-1 py-1.25"
    >
      <span className="block pl-1 pr-2">{label}</span>
      <input
        {...props}
        type="text"
        value={value?.toString() ?? "0"}
        onChange={handleChange}
        className=" p-0 bg-transparent border-0 border-transparent focus:border-red-200 text-sm w-5 appearance-none"
      />
    </label>
  );
}
