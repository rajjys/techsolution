import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Slot minimal compatible React Server Components
 * (@radix-ui/react-slot évalue un createContext côté serveur — proscrit en RSC).
 */
function Slot({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const child = React.Children.only(children) as React.ReactElement<{
    className?: string;
  }>;
  return React.cloneElement(child, {
    ...props,
    className: cn(className, child.props.className),
  });
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-navy-950 text-white shadow-sm hover:bg-navy-800 hover:shadow-md active:translate-y-px",
        brand:
          "bg-brand-600 text-white shadow-sm hover:bg-brand-700 hover:shadow-md active:translate-y-px",
        solar:
          "bg-solar-500 text-navy-950 shadow-[0_10px_30px_-10px_rgba(255,184,0,0.7)] hover:bg-solar-400 hover:shadow-[0_14px_36px_-10px_rgba(255,184,0,0.8)] active:translate-y-px",
        ember:
          "bg-ember-700 text-white shadow-sm hover:bg-ember-800 hover:shadow-md active:translate-y-px",
        "outline-ember":
          "border-2 border-ember-700 bg-transparent text-ember-700 hover:bg-black/[0.04] active:translate-y-px",
        outline:
          "border-2 border-navy-950 bg-transparent text-navy-950 hover:bg-navy-950 hover:text-white active:translate-y-px",
        "outline-light":
          "border-2 border-white/70 bg-transparent text-white hover:bg-white hover:text-navy-950 active:translate-y-px",
        secondary:
          "bg-navy-50 text-navy-900 hover:bg-navy-100 active:translate-y-px",
        ghost: "text-navy-900 hover:bg-navy-50",
        link: "text-navy-800 underline-offset-4 hover:underline",
        whatsapp:
          "bg-[#25D366] text-white shadow-sm hover:bg-[#1FB958] hover:shadow-md active:translate-y-px",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
