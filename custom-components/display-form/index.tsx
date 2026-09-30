/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

export type FieldType =
  | "text"
  | "date"
  | "select"
  | "checkbox"
  | "checkbox-group"
  | "number";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string | number }[];
  optionGroups?: {
    groupName: string;
    options: { label: string; value: string | number }[];
  }[];
}

// Props
interface DisplayFormProps {
  title?: string;
  fields: FieldConfig[];
  data: Record<string, any>; // the values to display
  buttonTitle?: string;



}

export function DisplayForm({ title, fields, data }: DisplayFormProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md max-w-6xl mx-auto">
      {title && (
        <h2 className="text-xl md:text-base font-bold 0 mb-4">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fields.map((field) => {
          let displayValue: any = data[field.name] ?? "-";

          // Customize display based on field type
          if (field.type === "checkbox") {
            displayValue = displayValue ? "Yes" : "No";
          } else if (field.type === "select") {
            const selectedOption = field.options?.find(
              (opt) => opt.value === displayValue
            );
            displayValue = selectedOption?.label ?? "-";
          } else if (field.type === "checkbox-group") {
            const valueArray: string[] = Array.isArray(displayValue)
              ? displayValue
              : [];
            const selectedLabels: string[] = [];
            field.optionGroups?.forEach((group) =>
              group.options.forEach((opt) => {
                if (valueArray.includes(opt.value as any))
                  selectedLabels.push(opt.label);
              })
            );
            displayValue = selectedLabels.join(", ") || "-";
          }

          return (
            <div key={field.name} className="flex flex-col">
              {/* Label outside the box */}
              <span className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                {field.label}
              </span>
              {/* Value box */}
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 min-h-[36px] flex items-center">
                <span className="text-sm md:text-base text-gray-900 font-semibold">
                  {displayValue}
                </span>
              </div>
             
            </div>
          );
        })}
      </div>
  
    </div>
  );
}
