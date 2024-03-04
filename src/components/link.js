import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";
import { forwardRef } from "react";

const linkVariants = cva("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-secondary text-white text-opacity-70 border-opacity-30 hover:border-opacity-70 hover:text-opacity-100",
        danger:
          "border border-red-500 text-red-500 text-opacity-70 border-opacity-30 hover:border-opacity-70 hover:text-opacity-100",
      },
      size: {
        default: "text-base py-2 px-2",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  })

const Link = forwardRef(({ variant, className, ...props }, ref) => {
  return (
    <a ref={ref} className={cn(linkVariants({ variant, className }))} {...props} />
  );
})

export default Link;