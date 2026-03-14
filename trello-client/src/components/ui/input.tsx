import { cva, type VariantProps } from "class-variance-authority";
import { Lock } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        outlined: 
          "bg-background/50 border border-input focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary px-4 py-3 shadow-sm h-11",
        filled: 
          "bg-secondary/30 border-b-2 border-transparent hover:bg-secondary/50 focus-visible:bg-secondary/70 focus-visible:border-primary px-4 py-3 rounded-b-none shadow-inner h-11",
        standard: 
          "bg-transparent border-b-2 border-input rounded-none px-0 py-3 focus-visible:border-primary transition-[border-color] h-11",
      },
      isError: {
        true: "!border-error focus-visible:ring-error/20 focus-visible:border-error text-error",
      },
      isBlocked: {
        true: "bg-muted/50 opacity-80 cursor-not-allowed border-dashed grayscale-[0.2]",
      }
    },
    defaultVariants: {
      variant: "outlined",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "variant">,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: boolean | string;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, error, label, helperText, containerClassName, disabled, ...props }, ref) => {
    const isError = !!error;
    const isBlocked = disabled;
    
    return (
      <div className={cn("flex flex-col w-full gap-1.5", containerClassName)}>
        {label && (
          <label className={cn(
            "text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1",
            isError && "text-error",
            isBlocked && "text-muted-foreground/50"
          )}>
            {label}
          </label>
        )}
        
        <div className="relative group">
          <input
            type={type}
            disabled={disabled}
            className={cn(
              inputVariants({ variant, isError, isBlocked, className })
            )}
            ref={ref}
            {...props}
          />
          
          {isBlocked && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none">
              <Lock size={14} />
            </div>
          )}
        </div>

        {(helperText || typeof error === "string") && (
          <p className={cn(
            "text-[11px] font-medium ml-1 transition-all duration-200",
            isError ? "text-error animate-in fade-in slide-in-from-top-1" : "text-muted-foreground"
          )}>
            {typeof error === "string" ? error : helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
