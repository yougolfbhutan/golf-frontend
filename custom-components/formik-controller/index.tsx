/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ErrorMessage, Field } from "formik";
import { Eye, EyeOff, User } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // shadcn switch

interface FieldConfig {
  type?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  values?: unknown;
  multiple?: boolean;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subType?: string;
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
  setFieldValue,
}: FormikControllerProps) {
  const [showPassword, setShowPassword] = useState(false);

  switch (fieldConfig.type) {
    case "input":
      return (
        <div className={className}>
          <label htmlFor={name}>{label}</label>
          <Field
            id={name}
            name={name}
            type={fieldConfig.subType || "text"}
            placeholder={fieldConfig.placeholder}
            className={fieldstyle}
            autoComplete="off"
          />
          <ErrorMessage name={name} className="text-red-400" />
        </div>
      );

    case "inputwithicon":
      const Icon = fieldConfig.Icon || User;
      let inputType = "text";

      if (fieldConfig.subType === "password") {
        inputType = showPassword ? "text" : "password";
      }

      return (
        <div className={className}>
          <label htmlFor={name}>{label}</label>
          <div className="relative mt-1">
            <Icon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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

    case "switch": // NEW: shadcn switch
      return (
        <div className={className}>
          <label className="flex items-center justify-between">
            <span>{label}</span>
            <Field name={name}>
              {({ field }: any) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    setFieldValue?.(name, checked)
                  }
                />
              )}
            </Field>
          </label>
          <ErrorMessage
            name={name}
            component="div"
            className="text-sm text-red-600"
          />
        </div>
      );

    default:
      return null;
  }
}

export default FormikController;
