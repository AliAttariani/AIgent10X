import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  requiredIndicator?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, requiredIndicator = false, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-foreground",
        requiredIndicator && "after:ml-1 after:text-destructive after:content-['*']",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  ),
);
Label.displayName = "Label";
