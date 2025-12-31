import { useEffect, useRef, useState } from "react";
import { DropMenuIcon } from "../../assets/icons";

type Props = {
  value: string;
  options: Array<{ label: any; value: string }>;
  onChange?: (value: string) => void;
  name?: string;
};

export default function DropMenu({ options, value, onChange, name }: Props) {
  const valueNode = options.find(
    ({ value: optionValue }) =>
      value.toLowerCase() === optionValue.toLowerCase(),
  );

  const [isOpen, setIsOpen] = useState(false);

  // NEW: dynamic positioning state
  const [position, setPosition] = useState<{
    vertical: "top" | "bottom";
    horizontal: "left" | "right";
  }>({
    vertical: "bottom",
    horizontal: "left",
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Detect outside clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!isOpen) return;

      if (!wrapperRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isOpen]);

  // Auto-position when opening
  useEffect(() => {
    if (!isOpen) return;

    const wrapper = wrapperRef.current;
    const menu = menuRef.current;

    if (!wrapper || !menu) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const menuHeight = menu.offsetHeight;
    const menuWidth = menu.offsetWidth;

    // Vertical positioning
    const spaceBelow = window.innerHeight - wrapperRect.bottom;
    const spaceAbove = wrapperRect.top;

    const vertical =
      spaceBelow < menuHeight && spaceAbove > menuHeight ? "top" : "bottom";

    // Horizontal positioning
    const spaceRight = window.innerWidth - wrapperRect.left;
    const spaceLeft = wrapperRect.right;

    const horizontal =
      spaceRight < menuWidth && spaceLeft > menuWidth ? "right" : "left";

    setPosition({ vertical, horizontal });
  }, [isOpen]);

  const handleSelect = (v: string) => {
    setIsOpen(false);
    onChange?.(v);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        name={name}
        onClick={() => setIsOpen(!isOpen)}
        className={`py-1! px-2! hover:bg-background-hover rounded-md text-center w-full text-sm bg-transparent border-2 ${
          isOpen ? "border-border-brand" : "border-transparent"
        }`}
      >
        <div className="min-h-2 flex justify-between items-center gap-2">
          <span>{valueNode?.label}</span>
          <DropMenuIcon
            className={`size-5 fill-text transition-all duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </div>
      </button>

      {/* MENU */}
      <div
        ref={menuRef}
        className={`
          absolute z-20 min-w-fit max-h-24 w-full p-0.5 
          bg-secondary-background shadow-md rounded-md overflow-y-auto
          ${isOpen ? "block" : "hidden"}
          ${position.vertical === "top" ? "bottom-full mb-1" : "top-full mt-1"}
          ${position.horizontal === "right" ? "right-0" : "left-0"}
        `}
      >
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(opt.value)}
            className="py-1 px-2! min-h-3 flex items-center hover:bg-background rounded-sm justify-center w-full text-sm bg-transparent border-none"
          >
            <div className="min-h-2 flex justify-center items-center">
              {opt.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
