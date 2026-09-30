
import React from "react";
import { X } from "lucide-react";

interface SimpleModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function VerticalModalForm({
  isOpen,
  onClose,
  title = "Modal Form",
  children,
}: SimpleModalFormProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center p-4 bg-opacity-50 animate-fadeIn">
      <div className="bg-white w-full max-w-7xl rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn">
        {/* Header - Matching the gradient style from DisplayForm */}
        <div className="  bg-orange-500 px-6 md:px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full  transition-all duration-200 group"
          >
            <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-4 text-gray-800 bg-gradient-to-br from-orange-50 via-white to-amber-50">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 py-4 border-t border-orange-100 bg-white flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}