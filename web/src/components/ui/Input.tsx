import * as React from "react";
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#32bb78] focus:ring-[#32bb78] ${className}`}
    {...props}
  />
));
Input.displayName = "Input";
