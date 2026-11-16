/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Formik, Field, FieldProps, useFormikContext, getIn } from "formik";
import * as Yup from "yup";
import { Check, Search } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "date"
  | "select"
  | "checkbox"
  | "checkbox-group"
  | "number"
  | "image";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  storeLabel?: boolean;
  placeholder?: string;
  defaultValue?: any;
  validation?: any;
  disabled?: boolean;
  optionGroups?: {
    groupName: string;
    options: { label: string; value: string | number }[];
  }[];
  options?: { label: string; value: string | number }[];
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  calculation?: {
    dependsOn: string;
    formula: (value: any) => number;
  };
  // image field options
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
}

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FieldConfig[];
  OnSubmitTitle?: string;
  onSubmit: (values: Record<string, any>) => void;
  defaultValues?: Record<string, any>;
  CustomDialogBoxStyle?: string;
}

// ─────────────────────────────────────────────
//  BRAND COLORS  (change them here only)
//  dark  #1F4D36  -> header, buttons, selected text
//  light #10B759  -> focus rings, accents, toggles
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
//  SHARED FIELD STYLES  (one source of truth)
// ─────────────────────────────────────────────
const INPUT_BASE =
  "h-12 w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-900 shadow-sm " +
  "placeholder:text-slate-400 transition-all duration-150 hover:border-slate-300 " +
  "focus:outline-none focus:border-[#10B759] focus:ring-2 focus:ring-[#10B759]/25 " +
  "focus-visible:border-[#10B759] focus-visible:ring-2 focus-visible:ring-[#10B759]/25 " +
  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-100";

const ERROR_TEXT = "mt-1.5 ml-0.5 text-xs font-medium text-red-500";

// ─── Error text ───────────────────────────────────────────────────────────────

function ErrorText({
  errors,
  touched,
  name,
}: {
  errors: Record<string, any>;
  touched: Record<string, any>;
  name: string;
}) {
  const error = getIn(errors, name);
  const touch = getIn(touched, name);
  if (!error || !touch) return null;
  return <span className={ERROR_TEXT}>{String(error)}</span>;
}

// ─── FormikSelectField ────────────────────────────────────────────────────────

interface FormikSelectFieldProps {
  name: string;
  options: { label: string; value: any }[];
  storeLabel?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function FormikSelectField({
  name,
  options,
  storeLabel = false,
  placeholder = "Select option",
  className = "",
  disabled,
}: FormikSelectFieldProps) {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fieldValue = getIn(values, name);
  const selectedOption = storeLabel
    ? fieldValue
    : options.find((o) => o.value === fieldValue);

  const handleSelect = (opt: { label: string; value: any }) => {
    setFieldValue(name, storeLabel ? opt : opt.value);
    setFieldTouched(name, true, false);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={
          INPUT_BASE +
          " flex items-center justify-between px-4 pr-3 text-left " +
          (open ? "border-[#10B759] ring-2 ring-[#10B759]/25 " : "")
        }
      >
        <span
          className={`truncate ${selectedOption?.label ? "text-slate-900" : "text-slate-400"}`}
        >
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10">
          {options.length === 0 && (
            <div className="px-3 py-2.5 text-sm text-slate-400">
              No options available
            </div>
          )}
          {options.map((opt) => {
            const selected = selectedOption?.label === opt.label &&
              (storeLabel ? true : opt.value === fieldValue);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt)}
                title={opt.label}
                className={
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors " +
                  (selected
                    ? "bg-[#10B759]/10 font-medium text-[#1F4D36]"
                    : "text-slate-700 hover:bg-slate-50 hover:text-[#1F4D36]")
                }
              >
                <span className="truncate">{opt.label}</span>
                {selected && (
                  <svg
                    className="h-4 w-4 shrink-0 text-[#10B759]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── CheckboxGroupField ───────────────────────────────────────────────────────

type CheckboxOption = { label: string; value: string | number };

interface CheckboxGroupFieldProps {
  label?: string;
  groups: { groupName?: string; options: CheckboxOption[] }[];
  value: (string | number)[];
  onChange: (next: (string | number)[]) => void;
}

function CheckboxGroupField({
  label,
  groups,
  value,
  onChange,
}: CheckboxGroupFieldProps) {
  const [query, setQuery] = useState("");

  const options = groups.flatMap((g) => g.options ?? []);
  const visible = options.filter((o) =>
    o.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const visibleValues = visible.map((o) => o.value);
  const allVisibleSelected =
    visible.length > 0 && visibleValues.every((v) => value.includes(v));

  const toggle = (v: string | number) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  const toggleAll = () =>
    onChange(
      allVisibleSelected
        ? value.filter((v) => !visibleValues.includes(v))
        : Array.from(new Set([...value, ...visibleValues])),
    );

  if (options.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        No {label?.toLowerCase() ?? "options"} available
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-slate-800">{label}</h4>
          <span className="rounded-full bg-[#10B759]/10 px-2 py-0.5 text-xs font-semibold text-[#0B8A42]">
            {value.length} / {options.length} selected
          </span>
        </div>

        <div className="flex items-center gap-3">
          {options.length > 8 && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="h-8 w-40 rounded-md border border-slate-200 bg-white pl-8 pr-2 text-xs text-slate-800 outline-none focus:border-[#10B759] focus:ring-2 focus:ring-[#10B759]/20"
              />
            </div>
          )}
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs font-semibold text-[#0B8A42] hover:underline"
          >
            {allVisibleSelected ? "Clear all" : "Select all"}
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="max-h-64 overflow-y-auto p-3">
        {visible.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">
            No results for “{query}”
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((opt) => {
              const checked = value.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer select-none items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                    checked
                      ? "border-[#10B759]/50 bg-[#10B759]/10"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(opt.value)}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#10B759]/40 peer-focus-visible:ring-offset-2 ${
                      checked
                        ? "border-[#10B759] bg-[#10B759]"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {checked && (
                      <Check strokeWidth={3} className="h-3.5 w-3.5 text-white" />
                    )}
                  </span>
                  <span className="truncate text-sm font-medium text-slate-800">
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FormikImageUploadField ───────────────────────────────────────────────────
// `files` can contain a mix of:
//  - string  → an already-uploaded image URL (e.g. from the API on edit)
//  - File    → a newly selected image that hasn't been uploaded yet

interface FormikImageUploadFieldProps {
  name: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
}

type ImageItem = File | string;

export function FormikImageUploadField({
  name,
  multiple = true,
  maxFiles = 10,
  maxSizeMB = 5,
}: FormikImageUploadFieldProps) {
  const { values, setFieldValue } = useFormikContext<any>();
  const rawValue = getIn(values, name);
  const files: ImageItem[] = Array.isArray(rawValue) ? rawValue : [];
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Build previews: existing URLs are used as-is, new Files get an object URL
  const previews = useMemo(
    () =>
      files.map((file) => ({
        file,
        url: typeof file === "string" ? file : URL.createObjectURL(file),
        isExisting: typeof file === "string",
        key:
          typeof file === "string"
            ? file
            : `${file.name}-${file.size}-${file.lastModified}`,
      })),
    [files],
  );

  // Only revoke object URLs we actually created (never revoke real string URLs)
  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (!p.isExisting) URL.revokeObjectURL(p.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previews]);

  const addFiles = (incoming: FileList | File[]) => {
    const incomingArr = Array.from(incoming);
    const imagesOnly = incomingArr.filter((f) => f.type.startsWith("image/"));
    const withinSize = imagesOnly.filter(
      (f) => f.size <= maxSizeMB * 1024 * 1024,
    );
    const oversizedCount = imagesOnly.length - withinSize.length;

    let next: ImageItem[] = multiple
      ? [...files, ...withinSize]
      : withinSize.slice(-1);

    let message: string | null = null;
    if (next.length > maxFiles) {
      next = next.slice(0, maxFiles);
      message = `You can upload up to ${maxFiles} image${maxFiles === 1 ? "" : "s"}`;
    } else if (oversizedCount > 0) {
      message = `${oversizedCount} file${oversizedCount === 1 ? "" : "s"} exceeded ${maxSizeMB}MB and ${
        oversizedCount === 1 ? "was" : "were"
      } skipped`;
    }

    setError(message);
    setFieldValue(name, next);
  };

  const handleRemove = (index: number) => {
    setError(null);
    setFieldValue(
      name,
      files.filter((_, i) => i !== index),
    );
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all duration-200 ${
          isDragging
            ? "border-[#10B759] bg-[#10B759]/10"
            : "border-slate-300 bg-slate-50/50 hover:border-[#10B759] hover:bg-[#10B759]/5"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#10B759]/10 text-[#1F4D36]">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16.5V18a2 2 0 002 2h12a2 2 0 002-2v-1.5M7 9l5-5m0 0l5 5m-5-5v12"
            />
          </svg>
        </span>
        <p className="mt-2.5 text-sm font-semibold text-slate-700">
          <span className="text-[#1F4D36] underline-offset-2 hover:underline">
            Click to upload
          </span>{" "}
          or drag and drop
        </p>
        <p className="mt-1 text-xs text-slate-500">
          PNG or JPG, up to {maxSizeMB}MB
          {multiple ? ` · up to ${maxFiles} images` : ""}
        </p>
      </div>

      {error && <span className={"block " + ERROR_TEXT}>{error}</span>}

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {previews.map((p, i) => (
            <div
              key={p.key}
              className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={typeof p.file === "string" ? "Uploaded image" : p.file.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(i);
                }}
                aria-label="Remove image"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#1F4D36]/85 text-xs text-white opacity-0 shadow transition-opacity duration-200 hover:bg-red-600 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FormContent (extracted so useEffect is inside a real component) ──────────

interface FormContentProps {
  fields: FieldConfig[];
  onClose: () => void;
  OnSubmitTitle?: string;
  CustomDialogBoxStyle?: string;
  handleSubmit: () => void;
  errors: Record<string, any>;
  touched: Record<string, any>;
}

function FormContent({
  fields,
  onClose,
  OnSubmitTitle,
  CustomDialogBoxStyle,
  handleSubmit,
  errors,
  touched,
}: FormContentProps) {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    fields.forEach((field) => {
      if (!field.calculation) return;

      const inputValue = Number(getIn(values, field.calculation.dependsOn) || 0);
      const result = field.calculation.formula(inputValue);

      if (values[field.name] !== result) {
        setFieldValue(field.name, Number(result.toFixed(2)));
      }
    });
  }, [values, fields, setFieldValue]);

  return (
    <>
      {/* Scrollable Content Area */}
      <div className={CustomDialogBoxStyle}>
        {fields.map((field) => (
          // col-span-full lives on this wrapper (the real grid item) so
          // checkbox groups stretch across the whole dialog width
          <div
            key={field.name}
            className={`flex flex-col ${
              field.type === "checkbox-group" ? "col-span-full" : ""
            }`}
          >
            {field.type !== "checkbox" && field.type !== "checkbox-group" && (
              <label className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {field.label}
              </label>
            )}

            {(() => {
              switch (field.type) {
                case "text":
                  return (
                    <div className="relative">
                      <Field name={field.name}>
                        {({ field: f }: FieldProps) => (
                          <>
                            <Input
                              {...f}
                              disabled={field.disabled}
                              placeholder={field.placeholder}
                              className={`${INPUT_BASE} ${
                                field.Icon ? "pl-11" : "pl-4"
                              }`}
                            />
                            {field.Icon && (
                              <field.Icon
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                width={18}
                                height={18}
                              />
                            )}
                          </>
                        )}
                      </Field>
                      <ErrorText errors={errors} touched={touched} name={field.name} />
                    </div>
                  );

                case "date":
                  return (
                    <div className="relative">
                      <Field name={field.name}>
                        {({ field: f }: FieldProps) => (
                          <>
                            <Input
                              type="date"
                              {...f}
                              disabled={field.disabled}
                              className={`${INPUT_BASE} pr-4 ${
                                field.Icon ? "pl-11" : "pl-4"
                              } [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100`}
                            />
                            {field.Icon && (
                              <field.Icon
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                width={18}
                                height={18}
                              />
                            )}
                          </>
                        )}
                      </Field>
                      <ErrorText errors={errors} touched={touched} name={field.name} />
                    </div>
                  );

                case "select":
                  return (
                    <div>
                      <FormikSelectField
                        name={field.name}
                        options={field.options || []}
                        storeLabel={field.storeLabel}
                        placeholder={`Select ${field.label}`}
                        disabled={field.disabled}
                      />
                      <ErrorText errors={errors} touched={touched} name={field.name} />
                    </div>
                  );

                case "checkbox":
                  return (
                    <Field name={field.name}>
                      {({ field: f }: FieldProps) => (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={!!f.value}
                          onClick={() => setFieldValue(field.name, !f.value)}
                          className="flex w-fit items-center gap-3 rounded-xl py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B759]/40"
                        >
                          <span
                            className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors duration-200 ${
                              f.value ? "bg-[#10B759]" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                                f.value ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </span>
                          <span className="text-sm font-medium text-slate-800">
                            {field.label}
                          </span>
                        </button>
                      )}
                    </Field>
                  );

                case "checkbox-group":
                  return (
                    <Field name={field.name}>
                      {({ field: f }: FieldProps) => (
                        <CheckboxGroupField
                          label={field.label}
                          groups={field.optionGroups ?? []}
                          value={Array.isArray(f.value) ? f.value : []}
                          onChange={(next) => setFieldValue(field.name, next)}
                        />
                      )}
                    </Field>
                  );

                case "number":
                  return (
                    <div className="relative">
                      <Field name={field.name}>
                        {({ field: f }: FieldProps) => (
                          <>
                            <Input
                              type="number"
                              {...f}
                              value={f.value ?? ""}
                              disabled={field.disabled}
                              onChange={(e) =>
                                setFieldValue(
                                  field.name,
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value),
                                )
                              }
                              placeholder={field.placeholder}
                              className={`${INPUT_BASE} ${
                                field.Icon ? "pl-11" : "pl-4"
                              }`}
                            />
                            {field.Icon && (
                              <field.Icon
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                width={18}
                                height={18}
                              />
                            )}
                          </>
                        )}
                      </Field>
                      <ErrorText errors={errors} touched={touched} name={field.name} />
                    </div>
                  );

                case "image":
                  return (
                    <>
                      <FormikImageUploadField
                        name={field.name}
                        multiple={field.multiple}
                        maxFiles={field.maxFiles}
                        maxSizeMB={field.maxSizeMB}
                      />
                      <ErrorText errors={errors} touched={touched} name={field.name} />
                    </>
                  );

                default:
                  return null;
              }
            })()}
          </div>
        ))}
      </div>

      {/* Fixed Footer */}
      <DialogFooter className="mt-0 flex flex-shrink-0 justify-end gap-3 border-t border-slate-200 bg-slate-50/70 px-8 py-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-11 rounded-xl border border-slate-300 bg-white px-6 font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="h-11 rounded-xl bg-[#1F4D36] px-7 font-semibold text-white shadow-md shadow-[#1F4D36]/25 transition-all duration-200 hover:bg-[#173d2a] focus-visible:ring-2 focus-visible:ring-[#10B759]/40"
        >
          {OnSubmitTitle}
        </Button>
      </DialogFooter>
    </>
  );
}

// ─── CustomDialog ─────────────────────────────────────────────────────────────

export function CustomDialog({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  OnSubmitTitle,
  defaultValues = {},
  CustomDialogBoxStyle,
}: CustomDialogProps) {
  const initialValues = useMemo(
    () =>
      fields.reduce(
        (acc, f) => ({
          ...acc,
          [f.name]:
            defaultValues[f.name] ??
            (f.type === "checkbox"
              ? false
              : f.type === "number"
                ? undefined
                : f.type === "image" || f.type === "checkbox-group"
                  ? []
                  : ""),
        }),
        {} as Record<string, any>,
      ),
    [fields, defaultValues],
  );

  const validationSchema = useMemo(
    () =>
      Yup.object(
        fields.reduce(
          (acc, f) => {
            if (f.validation) acc[f.name] = f.validation;
            return acc;
          },
          {} as Record<string, any>,
        ),
      ),
    [fields],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-full -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-0 shadow-2xl shadow-slate-900/20 transition-all duration-300 [&>button]:z-10 [&>button]:text-white [&>button]:opacity-80 [&>button]:hover:opacity-100"
        style={{ maxWidth: "800px" }}
      >
        {/* Header */}
        <div
          className="relative flex-shrink-0 overflow-hidden px-8 py-6"
          style={{
            background: "linear-gradient(135deg, #1F4D36 0%, #2C6B4B 100%)",
          }}
        >
          {/* soft decorative circles */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-14 right-24 h-28 w-28 rounded-full bg-[#10B759]/20"
          />
          <DialogTitle className="relative m-0 text-2xl font-bold tracking-tight text-white">
            {title}
          </DialogTitle>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
        >
          {({ errors, touched, handleSubmit }) => (
            <FormContent
              fields={fields}
              onClose={onClose}
              OnSubmitTitle={OnSubmitTitle}
              CustomDialogBoxStyle={CustomDialogBoxStyle}
              handleSubmit={handleSubmit}
              errors={errors}
              touched={touched}
            />
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}