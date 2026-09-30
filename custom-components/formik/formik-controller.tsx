// ✅ FORMIK CONTROLLER (EXTENDED)
"use client";

import React, { useState } from "react";
import { ErrorMessage, Field, FormikContextType, useFormikContext } from "formik";
import { Eye, EyeOff, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonGroupOption {
  value: string;
  label?: string;
}

interface FieldConfig {
  type?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  values?: unknown;
  multiple?: boolean;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subType?: string;

  // extra props forwarded straight onto <input> (min, max, step, etc.)
  inputProps?: Record<string, unknown>;

  // buttongroup-specific
  options?: ButtonGroupOption[];
  wrapperClassName?: string;
  optionClassName?: string;
  activeOptionClassName?: string;
  renderOption?: (
    option: ButtonGroupOption,
    isActive: boolean,
  ) => React.ReactNode;

  // custom-specific — full escape hatch for bespoke UI (e.g. card grids)
  render?: (formik: FormikContextType<Record<string, unknown>>) => React.ReactNode;
}

export interface FormikControllerProps {
  control?: string;
  label?: string;
  name: string;
  fieldConfig: FieldConfig;
  className?: string;
  fieldstyle?: string;
  inputWidthIconStyle?: string;
  checkstyle?: string;
  checkmainstyle?: string;
  id?: string;
  setFieldValue?: (key: string, value: unknown | unknown[]) => void;
}

function FormikController({
  label,
  name,
  className,
  fieldstyle,
  inputWidthIconStyle,
  fieldConfig,
}: FormikControllerProps) {
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormikContext<Record<string, unknown>>();

  switch (fieldConfig.type) {
    case "input":
      return (
        <div className={className}>
          {label && <label htmlFor={name}>{label}</label>}
          <Field
            id={name}
            name={name}
            type={fieldConfig.subType || "text"}
            placeholder={fieldConfig.placeholder}
            className={fieldstyle}
            autoComplete="off"
            {...fieldConfig.inputProps}
          />
          <ErrorMessage
            name={name}
            component="div"
            className="text-sm text-red-400"
          />
        </div>
      );

    case "inputwithicon": {
      const Icon = fieldConfig.Icon || User;
      let inputType = "text";

      if (fieldConfig.subType === "password") {
        inputType = showPassword ? "text" : "password";
      }

      return (
        <div className={className}>
          {label && <label htmlFor={name}>{label}</label>}
          <div className="relative mt-1">
            <Icon
              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              size={18}
            />
            <Field
              type={inputType}
              id={name}
              name={name}
              placeholder={fieldConfig.placeholder}
              className={inputWidthIconStyle}
              autoComplete={
                name === "email"
                  ? "email"
                  : fieldConfig.subType === "password"
                    ? "new-password"
                    : "off"
              }
              {...fieldConfig.inputProps}
            />
            {fieldConfig.subType === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
          <ErrorMessage
            name={name}
            component="div"
            className="text-sm text-red-600"
          />
        </div>
      );
    }

    // ✅ NEW: segmented / pill / card style toggle groups (category, tier, etc.)
    case "buttongroup": {
      const options = fieldConfig.options || [];
      const currentValue = formik.values[name];

      return (
        <div className={className}>
          {label && (
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </label>
          )}
          <div className={cn("flex gap-2", fieldConfig.wrapperClassName)}>
            {options.map((option) => {
              const isActive = currentValue === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => formik.setFieldValue(name, option.value)}
                  className={cn(
                    fieldConfig.optionClassName,
                    isActive && fieldConfig.activeOptionClassName,
                  )}
                >
                  {fieldConfig.renderOption
                    ? fieldConfig.renderOption(option, isActive)
                    : option.label || option.value}
                </button>
              );
            })}
          </div>
          <ErrorMessage
            name={name}
            component="div"
            className="text-sm text-red-400"
          />
        </div>
      );
    }

    // ✅ NEW: escape hatch for bespoke UI (card grids, etc.) still wired to Formik
    case "custom": {
      if (!fieldConfig.render) return null;
      return (
        <div className={className}>
          {label && <label>{label}</label>}
          {fieldConfig.render(formik)}
          <ErrorMessage
            name={name}
            component="div"
            className="text-sm text-red-400"
          />
        </div>
      );
    }

    default:
      return null;
  }
}

export default FormikController;