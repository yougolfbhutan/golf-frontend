"use client";

import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

interface SimpleModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  /** Optional small line under the title */
  description?: string;
  /** Panel width: sm = 400px, md = 520px (default), lg = 720px */
  size?: "sm" | "md" | "lg";
  /** Optional buttons pinned to the bottom of the panel */
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const WIDTHS = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-[520px]",
  lg: "sm:max-w-[720px]",
};

/*
  A side panel that slides in from the right.
  Closes with the X, the Esc key, or a click on the dark area.
  Colours: white + warm grey, with fairway green as the only accent.
*/
export function VerticalModalForm({
  isOpen,
  onClose,
  title = "Details",
  description,
  size = "md",
  footer,
  children,
}: SimpleModalFormProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Esc to close, lock page scroll, move focus into the panel
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={`relative flex h-full w-full flex-col bg-white shadow-2xl outline-none ${WIDTHS[size]}`}
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
          >
            {/* Green line along the top: the one accent */}
            <div className="h-1 w-full bg-emerald-800" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-6 py-5">
              <div className="min-w-0">
                <h2 id={titleId} className="text-xl font-semibold tracking-tight text-stone-900">
                  {title}
                </h2>
                {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6 text-stone-800">{children}</div>

            {/* Footer (only if you pass one) */}
            {footer && (
              <div className="flex justify-end gap-3 border-t border-stone-200 bg-stone-50 px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}