import * as React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "error" | "warning";
}

const variantStyles: Record<NonNullable<AlertProps["variant"]>, string> = {
  default: "border-border bg-muted/40 text-foreground",
  success: "border-emerald-400 bg-emerald-500/10 text-emerald-900",
  error: "border-destructive bg-destructive/10 text-destructive",
  warning: "border-amber-400 bg-amber-100 text-amber-900",
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  ),
);
Alert.displayName = "Alert";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm leading-relaxed", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";
