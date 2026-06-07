import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }
>(({ className, label, error, id, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text">
        {label}
      </label>
    )}
    <input
      ref={ref}
      id={id}
      className={cn(
        "w-full rounded-luxury border border-beige bg-white px-4 py-3 text-text placeholder:text-text/40 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
        error && "border-red-400",
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
));
Input.displayName = "Input";
