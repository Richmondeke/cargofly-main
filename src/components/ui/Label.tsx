
import * as React from "react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-navy-900/60 dark:text-white/60 font-body uppercase tracking-wider mb-2 block",
            className
        )}
        {...props}
    />
))
Label.displayName = "Label"

export { Label }
