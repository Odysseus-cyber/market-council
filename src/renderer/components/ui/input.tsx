import * as React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-11 w-full rounded-lg border border-white/10 bg-black/15 px-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus-visible:ring-2 focus-visible:ring-cyan-300/60 disabled:cursor-not-allowed disabled:opacity-65",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
