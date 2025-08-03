import * as React from "react";
export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = "", ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    {...props}
  />
));
Button.displayName = "Button";
