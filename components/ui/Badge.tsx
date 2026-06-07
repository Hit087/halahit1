import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "muted";
  className?: string;
}) {
  const variants = {
    default: "bg-primary/20 text-text",
    accent: "bg-accent/20 text-accent",
    success: "bg-green-100 text-green-800",
    muted: "bg-beige text-text/70",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
