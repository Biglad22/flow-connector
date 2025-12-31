import type { ChangeEvent, ComponentProps, ReactNode } from "react";

type Props = {
    label: string | ReactNode; 
    onChange?: (value:number)=>void;
    value?:number;
} & Omit<ComponentProps<"input">, "onChange"| "type">

export default function NumericInput({onChange, value, label, ...props}: Props) {
  const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
    const refinedValue = Number(e.target.value);
    onChange?.(isNaN(refinedValue)? 0 : refinedValue);
  }
  return (
    <label htmlFor={props.name} className="flex items-center gap-0.5">
        <span>{label}</span>
        <input {...props} type="text" value={value?.toString() ?? "0"} onChange={handleChange}  className=' px-2  py-1 bg-transparent border-2 border-transparent focus:border-border-brand rounded-md text-sm w-10 appearance-none'  />
    </label>
  )
}