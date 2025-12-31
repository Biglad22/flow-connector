type Props = {
    color: string;
    onClick?:(value:string)=>void;
    isActive?: boolean
}

export default function ColorSwitch({color, onClick, isActive}: Props) {
  return (
    <button style={{
        backgroundColor:color,
        outlineColor: isActive ? color : "transparent"
    }} 
    onClick={()=>onClick?.(color)} 
    className={`w-5 h-5 p-0! rounded-full outline outline-offset-2`}
    />
  )
}