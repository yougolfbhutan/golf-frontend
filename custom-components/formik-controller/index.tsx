/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ErrorMessage, Field } from "formik";
import { Eye, EyeOff, User } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // shadcn switch
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // shadcn select
import { COUNTRY_CODES, flagEmoji } from "@/app/(auth)/data";

interface FieldConfig {
  type?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  values?: unknown;
  multiple?: boolean;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subType?: string;
  autoComplete?: string; // NEW
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; // NEW
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
  errorstyle?: string; // NEW
  id?: string;
  setFieldValue?: (key: string, value: unknown | unknown[]) => void;
}

function FormikController({
  label,
  name,
  className,
  fieldstyle,
  inputWidthIconStyle,
  errorstyle = "text-sm text-destructive",
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
            autoComplete={fieldConfig.autoComplete ?? "off"}
            inputMode={fieldConfig.inputMode}
          />
          <ErrorMessage name={name} component="div" className={errorstyle} />
        </div>
      );

    // NEW: password with eye toggle, no leading icon
    case "password":
      return (
        <div className={className}>
          <label htmlFor={name}>{label}</label>
          <div className="relative">
            <Field
              id={name}
              name={name}
              type={showPassword ? "text" : "password"}
              placeholder={fieldConfig.placeholder}
              className={`${fieldstyle} pr-11`}
              autoComplete={fieldConfig.autoComplete ?? "off"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <ErrorMessage name={name} component="div" className={errorstyle} />
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
          <ErrorMessage name={name} component="div" className={errorstyle} />
        </div>
      );
    }

    case "phone":
      return (
        <div className={className}>
          <label htmlFor={name}>{label}</label>
          <div className="flex gap-2">
            <Field name="country_code">
              {({ field, form }: any) => {
                const selected = COUNTRY_CODES.find(
                  (c) => c.iso === field.value,
                );
                return (
                  <Select
                    value={field.value}
                    onValueChange={(v) => form.setFieldValue("country_code", v)}
                  >
                    <SelectTrigger
                      className={`${fieldstyle} w-[120px] shrink-0 data-[size=default]:h-12`}
                    >
                      <SelectValue>
                        {selected
                          ? `${flagEmoji(selected.iso)} ${selected.dial}`
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {COUNTRY_CODES.map((c) => (
                        <SelectItem key={c.iso} value={c.iso}>
                          {flagEmoji(c.iso)} {c.name} ({c.dial})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            </Field>
            <Field
              id={name}
              name={name}
              type="tel"
              inputMode="numeric"
              placeholder={fieldConfig.placeholder}
              className={`${fieldstyle} flex-1`}
              autoComplete="tel-national"
            />
          </div>
          <ErrorMessage name={name} component="div" className={errorstyle} />
        </div>
      );

    // NEW: shadcn select, options come from fieldConfig.values (string[])
    case "select": {
      const options = (fieldConfig.values as readonly string[]) ?? [];
      return (
        <div className={className}>
          <label htmlFor={name}>{label}</label>
          <Field name={name}>
            {({ field, form }: any) => (
              <Select
                value={field.value}
                onValueChange={(v) => form.setFieldValue(name, v)}
                onOpenChange={(open) =>
                  !open && form.setFieldTouched(name, true)
                }
              >
                <SelectTrigger
                  id={name}
                  className={`${fieldstyle} flex items-center justify-between data-[size=default]:h-12`}
                >
                  <SelectValue placeholder={fieldConfig.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>
          <ErrorMessage name={name} component="div" className={errorstyle} />
        </div>
      );
    }

    case "switch": // shadcn switch
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="flex cursor-pointer items-center justify-between gap-6 px-4 py-3 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <Field name={name}>
          {({ field, form }: any) => (
            <Switch
              id={name}
              checked={!!field.value}
              onCheckedChange={(checked) => form.setFieldValue(name, checked)}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 focus-visible:ring-green-500"
            />
          )}
        </Field>
      </label>
      <ErrorMessage name={name} component="div" className={errorstyle} />
    </div>
  );

    default:
      return null;
  }
}

export default FormikController;
