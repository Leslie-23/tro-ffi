import * as React from "react";
export const Checkbox: React.FC<{
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}> = ({ id, checked, onCheckedChange, className = "" }) => (
  <input
    id={id}
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
    className={`rounded border-gray-300 text-[#32bb78] focus:ring-[#32bb78] ${className}`}
  />
);
