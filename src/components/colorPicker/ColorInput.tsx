import type { ChangeEvent } from "react"

type Props = {
    onChange?:(e:ChangeEvent<HTMLInputElement>)=>void;
    value?:string
}

export const ColorInput = ({onChange, value}: Props) => {
  return (
    <div className="flex items-center gap-1">
        <span className="w-5 h-5 rounded-full"  
            style={{
                backgroundColor: value,
                border:`1px solid ${value}`
            }}
        />
        <input placeholder="Hex code" onChange={onChange} type="text" value={value} className="bg-background px-2 py-1 text-sm rounded-md w-20 border-2 border-transparent focus:border-border-brand focus:outline-none" />
    </div>
  )
}