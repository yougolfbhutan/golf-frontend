
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useEffect } from "react";
import {
  Formik,
  Field,
  FieldArray,
  Form,
  useFormikContext,
  getIn,
  useField,
} from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// -------------------- Types --------------------
export type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "file"
  | "image"
  | "textarea"
  | "year";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string | number }[];
  validation?: any;
  storeLabel?: boolean;
  calc?: {
    multiply?: string[];
    sum?: string[];
    percentageOf?: string;
  };
  disabled?: boolean;
  minYear?: number; // ✅ added
  maxYear?: number; // ✅ added
}

interface DynamicArrayFormProps {
  title?: string;
  topFields?: FieldConfig[];
  arrayFieldName?: string;
  arrayFields?: FieldConfig[];
  initialValues?: Record<string, any>;
  onValuesChange?: (values: Record<string, any>) => void;
  onSubmit: (values: Record<string, any>) => void;
  buttonTitle: string;
  topContainerClassName?: string;
  ItemTitle?: string;
}

// ─────────────────────────────────────────────
//  SHARED FIELD STYLES  (one source of truth)
// ─────────────────────────────────────────────
const FIELD_BASE =
  "h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 " +
  "placeholder:text-gray-400 transition-colors duration-150 " +
  "focus:outline-none focus:ring-2 focus:ring-orange-500 " +
  "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:md:text-base  disabled:text-gray-900";

// -------------------- Formik Select Field --------------------
interface FormikSelectFieldProps {
  name: string;
  options: { label: string; value: any }[];
  storeLabel?: boolean;
  placeholder?: string;
  disabled?: boolean;
}
function ComboboxField({
  name,
  options,
  placeholder = "Type to search...",
  disabled,
}: {
  name: string;
  options: { label: string; value: string | number }[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();
  const currentValue = getIn(values, name) ?? "";

  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Sync display when value is set externally (e.g. initialValues)
  const currentLabel = React.useMemo(
    () =>
      options.find((o) => String(o.value) === String(currentValue))?.label ??
      "",
    [currentValue, options],
  );

  const [inputDisplay, setInputDisplay] = React.useState(currentLabel);

  // Keep display in sync when form value changes externally
  React.useEffect(() => {
    setInputDisplay(currentLabel);
  }, [currentLabel]);

  const filtered = React.useMemo(() => {
    if (!query) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, options]);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        // Reset display to current selected label if user typed but didn't pick
        setInputDisplay(currentLabel);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [currentLabel]);

  const handleSelect = (opt: { label: string; value: string | number }) => {
    setFieldValue(name, opt.value);
    setFieldTouched(name, true, false);
    setInputDisplay(opt.label);
    setQuery("");
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setInputDisplay(e.target.value);
    setOpen(true);
    // Clear form value while typing so validation fires correctly
    if (!e.target.value) setFieldValue(name, "");
  };

  const handleClear = () => {
    setFieldValue(name, "");
    setInputDisplay("");
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={inputDisplay}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          className={FIELD_BASE + " pr-8"}
        />

        {/* Clear button or chevron */}
        {inputDisplay ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : (
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <ul className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg text-sm">
          {filtered.length > 0 ? (
            filtered.map((opt,index) => (
              <li
    key={opt.value != null && opt.value !== "" ? opt.value : index}
                onMouseDown={() => handleSelect(opt)}
                className={
                  "px-3 py-2 cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition-colors " +
                  (String(opt.value) === String(currentValue)
                    ? "bg-orange-50 text-orange-600 font-medium"
                    : "text-gray-700")
                }
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-400">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}
function FormikSelectField({
  name,
  options,
  placeholder,
  disabled,
}: FormikSelectFieldProps) {
  return (
    <ComboboxField
      name={name}
      options={options}
      placeholder={placeholder || "Type to search..."}
      disabled={disabled}
    />
  );
}
function YearSelectField({
  name,
  minYear = 1970,
  maxYear = new Date().getFullYear(),
  disabled,
}: {
  name: string;
  minYear?: number;
  maxYear?: number;
  disabled?: boolean;
}) {
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i,
  ).map((y) => ({ label: String(y), value: y }));

  return (
    <ComboboxField
      name={name}
      options={years}
      placeholder="Type or search year..."
      disabled={disabled}
    />
  );
}

// -------------------- Universal Totals Watcher --------------------
function ItemsTotalWatcher({
  arrayFieldName,
  arrayFields,
  topFields,
}: {
  arrayFieldName: string;
  arrayFields: FieldConfig[];
  topFields: FieldConfig[];
}) {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    if (!arrayFieldName || !Array.isArray(values[arrayFieldName])) return;

    values[arrayFieldName].forEach((item: any, index: number) => {
      arrayFields.forEach((field) => {
        if (!field.calc) return;

        if (field.calc.multiply) {
          const product = field.calc.multiply.reduce(
            (acc, key) => acc * (Number(item[key]) || 0),
            1,
          );
          if (item[field.name] !== product)
            setFieldValue(`${arrayFieldName}.${index}.${field.name}`, product);
        }

        if (field.calc.sum) {
          const sum = field.calc.sum.reduce(
            (acc, key) => acc + (Number(item[key]) || 0),
            0,
          );
          if (item[field.name] !== sum)
            setFieldValue(`${arrayFieldName}.${index}.${field.name}`, sum);
        }

        if (field.calc.percentageOf) {
          const base = Number(item[field.calc.percentageOf]) || 0;
          const percentValue = base * 0.05;
          if (item[field.name] !== percentValue)
            setFieldValue(
              `${arrayFieldName}.${index}.${field.name}`,
              percentValue,
            );
        }
      });
    });

    topFields.forEach((field) => {
      if (!field.calc || !field.calc.sum) return;
      const total = values[arrayFieldName].reduce((acc: number, item: any) => {
        const rowSum = field.calc!.sum!.reduce(
          (rowAcc, key) => rowAcc + (Number(item[key]) || 0),
          0,
        );
        return acc + rowSum;
      }, 0);
      if (values[field.name] !== total) setFieldValue(field.name, total);
    });
  }, [values, setFieldValue, arrayFieldName, arrayFields, topFields]);

  return null;
}

// -------------------- Date Difference Watcher --------------------
function DateDiffWatcher() {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    const startDate = values.start_date;
    const endDate = values.end_date;

    if (!startDate || !endDate) {
      if ("total_days" in values) setFieldValue("total_days", undefined);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setFieldValue("total_days", 0);
      return;
    }
    if (end < start) {
      setFieldValue("total_days", 0);
      return;
    }

    const diffDays =
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (values.total_days !== diffDays) setFieldValue("total_days", diffDays);
  }, [values.start_date, values.end_date, setFieldValue]);

  return null;
}

// -------------------- File Upload Field --------------------
function FileUploadField({ name }: { name: string }) {
  const { setFieldValue } = useFormikContext<any>();
  const [meta] = useField(name);
  const [preview, setPreview] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    setFieldValue(name, file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const hasFile = meta.value instanceof File;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className={
          /* Same h-11 height + border as every other field */
          "h-11 w-full flex items-center gap-2 px-3 rounded-lg border border-dashed " +
          "border-gray-300 bg-white text-sm cursor-pointer transition-colors duration-150 " +
          "hover:border-orange-500 hover:bg-orange-50 " +
          (hasFile ? "text-gray-700" : "text-gray-400")
        }
      >
        {/* Upload icon */}
        <svg
          className={`w-4 h-4 shrink-0 ${hasFile ? "text-orange-500" : "text-gray-400"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4"
          />
        </svg>
        <span className="truncate">
          {hasFile ? (meta.value as File).name : "Upload file…"}
        </span>
      </label>

      <input
        id={name}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        onChange={handleChange}
        className="hidden"
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mt-1 h-16 w-auto rounded-md object-contain border border-gray-200"
        />
      )}
    </div>
  );
}

// -------------------- Default value helper --------------------
function getDefaultValue(type: FieldType): string | number {
  return type === "number" ? 0 : "";
}

// -------------------- Error message --------------------
function FieldError({ name }: { name: string }) {
  const { errors, touched } = useFormikContext<any>();
  const error = getIn(errors, name);
  const touch = getIn(touched, name);
  if (!touch || !error) return null;
  return <p className="mt-0.5 text-xs text-red-500">{String(error)}</p>;
}

// -------------------- Label --------------------
function FieldLabel({ label }: { label: string }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
      {label}
    </label>
  );
}

// -------------------- Modern Textarea --------------------
function ModernTextarea({ name }: { name: string }) {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();
  const value: string = getIn(values, name) ?? "";
  const MAX = 500;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    if (next.length <= MAX) {
      setFieldValue(name, next);
      setFieldTouched(name, true, false);
    }
  };

  const pct = Math.round((value.length / MAX) * 100);
  const circumference = 2 * Math.PI * 7; // r=7
  const dash = (pct / 100) * circumference;
  const ringColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f97316" : "#22c55e";

  return (
    <div className="group relative">
      {/* Glow border wrapper */}
      <div
        className={
          "relative rounded-xl border border-gray-200 bg-white shadow-sm " +
          "transition-all duration-200 " +
          "focus:outline-none focus:ring-2 focus:ring-orange-500 group-focus-within:ring-2 group-focus-within:ring-orange-500"
        }
      >
        {/* Textarea */}
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          rows={4}
          placeholder="Start typing…"
          className={
            "w-full resize-none rounded-xl bg-transparent px-4 pt-3 pb-8 " +
            "text-sm text-gray-800 placeholder:text-gray-400 " +
            "focus:outline-none leading-relaxed"
          }
        />

        {/* Bottom bar: char count pill + ring */}
        <div className="absolute bottom-2.5 left-4 right-3 flex items-center justify-between pointer-events-none">
          {/* Remaining characters pill */}
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors duration-200 ${
              pct >= 90
                ? "bg-red-50 text-red-500"
                : pct >= 70
                  ? "bg-orange-50 text-orange-500"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            {MAX - value.length} left
          </span>

          {/* SVG ring progress */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            className="-rotate-90"
          >
            {/* Track */}
            <circle
              cx="10"
              cy="10"
              r="7"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2.5"
            />
            {/* Progress */}
            <circle
              cx="10"
              cy="10"
              r="7"
              fill="none"
              stroke={ringColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              style={{
                transition: "stroke-dasharray 0.3s ease, stroke 0.3s ease",
              }}
            />
          </svg>
        </div>
      </div>

      <FieldError name={name} />
    </div>
  );
}

// -------------------- Render one field --------------------
function RenderField({
  field,
  fieldName,
  onValuesChange,
}: {
  field: FieldConfig;
  fieldName: string; // may be `arrayKey.0.fieldName` or just `fieldName`
  onValuesChange?: (values: Record<string, any>) => void;
}) {
  if (field.type === "select") {
    return (
      <>
        <FormikSelectField
          name={fieldName}
          options={field.options || []}
          storeLabel={field.storeLabel}
          placeholder={`Select ${field.label}`}
        />
        <FieldError name={fieldName} />
      </>
    );
  }

  if (field.type === "textarea") {
    return <ModernTextarea name={fieldName} />;
  }
  if (field.type === "year") {
    // ✅ added
    return (
      <>
        <YearSelectField
          name={fieldName}
          minYear={field.minYear}
          maxYear={field.maxYear}
          disabled={field.disabled}
        />
        <FieldError name={fieldName} />
      </>
    );
  }

  if (field.type === "file" || field.type === "image") {
    return (
      <>
        <FileUploadField name={fieldName} />
        <FieldError name={fieldName} />
      </>
    );
  }

  // text | number | date
  return (
    <>
      <Field name={fieldName}>
        {({ field: f }: any) => (
          <Input
            {...f}
            type={field.type}
            disabled={field.disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              f.onChange(e);
              onValuesChange?.({});
            }}
            className={FIELD_BASE}
          />
        )}
      </Field>
      <FieldError name={fieldName} />
    </>
  );
}

// -------------------- DynamicArrayForm --------------------
export default function DynamicArrayForm({
  title,
  topFields = [],
  arrayFieldName = "",
  arrayFields = [],
  initialValues = {},
  buttonTitle,
  onSubmit,
  onValuesChange,
  topContainerClassName,
  ItemTitle,
}: DynamicArrayFormProps) {
  const arrayFieldKey = arrayFieldName;

  const topFieldDefaults = topFields.reduce(
    (acc, field) => {
      acc[field.name] =
        initialValues[field.name] ?? getDefaultValue(field.type);
      return acc;
    },
    {} as Record<string, any>,
  );

  const arrayItemDefaults = arrayFields.reduce(
    (acc, f) => ({ ...acc, [f.name]: getDefaultValue(f.type) }),
    {},
  );

  const initialArray = arrayFields.length > 0 ? [arrayItemDefaults] : [];

  const initialFormValues = {
    ...topFieldDefaults,
    ...initialValues,
    ...(arrayFieldKey
      ? {
          [arrayFieldKey]:
            initialValues[arrayFieldKey]?.length > 0
              ? initialValues[arrayFieldKey].map((item: any) => ({
                  ...arrayItemDefaults,
                  ...item,
                }))
              : initialArray,
        }
      : {}),
  };

  const validationSchema = useMemo(() => {
    const topFieldSchema = topFields.reduce(
      (acc, f) => {
        if (f.validation) acc[f.name] = f.validation;
        return acc;
      },
      {} as Record<string, any>,
    );

    const arrayFieldSchema = arrayFields.reduce(
      (acc, f) => {
        if (f.validation) acc[f.name] = f.validation;
        return acc;
      },
      {} as Record<string, any>,
    );

    return Yup.object().shape({
      ...topFieldSchema,
      ...(arrayFieldKey
        ? {
            [arrayFieldKey]: Yup.array().of(
              Yup.object().shape(arrayFieldSchema),
            ),
          }
        : {}),
    });
  }, [topFields, arrayFields, arrayFieldKey]);

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {title && (
        <h2 className="text-xl md:text-2xl font-bold text-orange-600 mb-6">
          {title}
        </h2>
      )}

      <Formik
        initialValues={initialFormValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values }) => (
          <Form className="space-y-6">
            {/* ── Top-level fields ── */}
            {topFields.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
                {topFields.map((field) => (
                  <div key={field.name}>
                    <FieldLabel label={field.label} />
                    <RenderField
                      field={field}
                      fieldName={field.name}
                      onValuesChange={onValuesChange}
                    />
                  </div>
                ))}
              </div>
            )}

            <DateDiffWatcher />
            <ItemsTotalWatcher
              arrayFieldName={arrayFieldKey}
              arrayFields={arrayFields}
              topFields={topFields}
            />

            {/* ── Dynamic array fields ── */}
            {arrayFields.length > 0 && arrayFieldKey && (
              <FieldArray name={arrayFieldKey}>
                {({ push, remove }) => (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      {ItemTitle ? ItemTitle : "Item"}{" "}
                    </h3>

                    {values[arrayFieldKey].map((_: any, index: number) => (
                      <div key={index} className={topContainerClassName}>
                        {arrayFields.map((field) => (
                          <div key={field.name}>
                            <FieldLabel label={field.label} />
                            <RenderField
                              field={field}
                              fieldName={`${arrayFieldKey}.${index}.${field.name}`}
                            />
                          </div>
                        ))}

                        {/* Row action buttons */}
                        <div className="col-span-full flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => push(arrayItemDefaults)}
                            className={
                              "h-8 w-8 flex items-center justify-center rounded-full " +
                              "bg-orange-500 text-white text-lg font-medium leading-none " +
                              "hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                            }
                            aria-label="Add row"
                          >
                            +
                          </button>
                          {values[arrayFieldKey].length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className={
                                "h-8 w-8 flex items-center justify-center rounded-full " +
                                "bg-red-500 text-white text-lg font-medium leading-none " +
                                "hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                              }
                              aria-label="Remove row"
                            >
                              −
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </FieldArray>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className={
                "h-11 px-6 rounded-lg bg-orange-500 text-white text-sm font-semibold " +
                "hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 focus:outline-none transition"
              }
            >
              {buttonTitle}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
