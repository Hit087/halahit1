import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-luxury-lg bg-white p-6 shadow-soft transition hover:shadow-soft-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
