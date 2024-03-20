import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-secondary text-white text-opacity-70 border-opacity-30 hover:border-opacity-70 hover:text-opacity-100",
        ghost:
          "hover:bg-secondary/30",
        danger:
          "border border-red-500 text-red-500 text-opacity-70 border-opacity-30 hover:border-opacity-70 hover:text-opacity-100",
      },
      size: {
        sm: "text-sm py-1 px-2",
        default: "text-base py-2 px-3",
        icon: "h-9 w-9",
        "icon-sm": "h-5 w-5",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  })

const Button = forwardRef(({ variant, size, className, ...props }, ref) => {
  return (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
})

export default Button;