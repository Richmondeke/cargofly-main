import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'glass' | 'flat' | 'premium' }
>(({ className, variant = 'default', ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-2xl border transition-all duration-300",
            variant === 'default' && "bg-white border-slate-100 shadow-sm hover:shadow-md dark:bg-slate-900 dark:border-white/5",
            variant === 'glass' && "bg-white/70 backdrop-blur-xl border-white/20 shadow-2xl dark:bg-white/5 dark:border-white/10",
            variant === 'flat' && "bg-slate-50 border-transparent dark:bg-slate-900/50",
            variant === 'premium' && "bg-white border-primary/20 shadow-[0_20px_40px_-12px_rgba(37,99,235,0.1)] dark:bg-slate-900 dark:border-primary/30",
            className
        )}
        {...props}
    />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-lg font-bold leading-none tracking-tight text-slate-900 dark:text-white",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-slate-500 dark:text-slate-400 font-medium", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
