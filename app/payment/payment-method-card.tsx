"use client";

import type { ReactNode } from "react";

export interface PaymentMethodCardProps {
  id: string;
  name: string;
  /** Currently selected method id (controlled by parent) */
  selectedId: string;
  onSelect: (id: string) => void;
  title: ReactNode;
  /** Icons / logo shown on the right of the header */
  icons?: ReactNode;
  /** Content revealed when this method is selected */
  children?: ReactNode;
}

/** Reusable radio-style payment method row that expands when selected. */
export default function PaymentMethodCard({
  id,
  name,
  selectedId,
  onSelect,
  title,
  icons,
  children,
}: PaymentMethodCardProps) {
  const selected = selectedId === id;

  return (
    <div
      className={
        selected
          ? "border-green-600 bg-[#f4f8fe] -m-px relative rounded-[inherit] border first:rounded-t-xl"
          : "border-transparent"
      }
    >
      <label
        htmlFor={id}
        className={`flex cursor-pointer items-center gap-3 px-4 py-4 ${selected ? "" : "bg-white"}`}
      >
        <input
          id={id}
          type="radio"
          name={name}
          checked={selected}
          onChange={() => onSelect(id)}
          className="peer sr-only"
        />
        {/* custom radio */}
        <span
          aria-hidden
          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border ${
            selected ? "border-green-600 bg-green-600" : "border-gray-300 bg-white"
          } peer-focus-visible:ring-2 peer-focus-visible:ring-green-600/40`}
        >
          {selected && <span className="h-2 w-2 rounded-full bg-white" />}
        </span>

        <span className="flex-1 text-[15px] font-medium text-gray-900">{title}</span>
        {icons && <span className="flex items-center gap-1.5">{icons}</span>}
      </label>

      {selected && children && (
        <div className="bg-[#f5f5f5] px-4 pb-4 pt-3">{children}</div>
      )}
    </div>
  );
}