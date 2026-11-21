import type { InputHTMLAttributes, ReactNode } from "react";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Icon rendered inside the field on the right */
  endIcon?: ReactNode;
  wrapperClassName?: string;
}

export default function TextField({ endIcon, wrapperClassName = "", className = "", ...props }: TextFieldProps) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <input
        {...props}
        className={`h-[58px] w-full rounded-xl border border-gray-200 bg-white px-4 text-[16px] text-gray-900 placeholder:text-gray-500 focus:border-[#0b57d0] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/25 ${
          endIcon ? "pr-12" : ""
        } ${className}`}
      />
      {endIcon && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
          {endIcon}
        </span>
      )}
    </div>
  );
}