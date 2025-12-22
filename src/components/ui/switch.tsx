import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        data-state={checked ? "checked" : "unchecked"}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full border border-border bg-muted transition",
          "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          disabled && "cursor-not-allowed opacity-60",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow transition",
            "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
          )}
        />
      </button>
    );
  },
);
Switch.displayName = "Switch";
