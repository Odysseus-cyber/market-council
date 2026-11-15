import * as React from "react";
import { cn } from "../../lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-white/[0.075] bg-[#14191f]",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";
