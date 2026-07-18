import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("grid w-full items-center gap-1.5", className)} {...props} />
))
Field.displayName = "Field"

export const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
  <Label ref={ref} className={cn("", className)} {...props} />
))
FieldLabel.displayName = "FieldLabel"
