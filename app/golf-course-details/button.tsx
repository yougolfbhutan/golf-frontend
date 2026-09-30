import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonSize = "default" | "sm" | "lg";
type ButtonVariant = "default" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function Button({
  children,
  className = "",
  size = "default",
  variant = "default",
  ...props
}: ButtonProps) {
  const sizes: Record<ButtonSize, string> = {
    default: "h-10 px-4",
    sm: "h-9 px-3 text-sm",
    lg: "h-12 px-6 text-base",
  };
  const variants: Record<ButtonVariant, string> = {
    default: "bg-emerald-600 text-white hover:bg-emerald-700",
    outline:
      "border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900",
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-semibold transition-colors ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
