import { ColorInput } from "./ColorInput";
import ColorSwitch from "./ColorSwitch";

type Props = {
    value?:string;
    onChange?:(value:string)=>void;
}
const colors = ["#000000", "#FFF672", "#F59696", "#7F52F6", "#96D2F5"];

export const ColorPicker = ({onChange,value}: Props) => {
  return (
    <div className="flex items-center w-full gap-3 justify-between">
        <ColorInput value={value} onChange={(e)=>onChange?.(e.target.value)}  />
        <div className='space-x-2'>
          {
            colors.map((cl, idx)=>(<ColorSwitch isActive={value?.toLowerCase() == cl.toLowerCase()} onClick={onChange} color={cl} key={idx} />))
          }
        </div>
    </div>
  )
}