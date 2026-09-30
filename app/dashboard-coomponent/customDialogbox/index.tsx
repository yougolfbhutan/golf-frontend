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

// ─── FormikSelectField ────────────────────────────────────────────────────────

interface FormikSelectFieldProps {
  name: string;
  options: { label: string; value: any }[];
  storeLabel?: boolean;
  placeholder?: string;
  className?: string;
}

export function FormikSelectField({
  name,
  options,
  storeLabel = false,
  placeholder = "Select option",
  className = "",
}: FormikSelectFieldProps) {
  const { values, setFieldValue } = useFormikContext<any>();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fieldValue = getIn(values, name);
  const selectedOption = storeLabel
    ? fieldValue
    : options.find((o) => o.value === fieldValue);

  const handleSelect = (opt: { label: string; value: any }) => {
    setFieldValue(name, storeLabel ? opt : opt.value);
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
        onClick={() => setOpen((p) => !p)}
        className="h-12 w-full bg-white border-2 border-gray-300 rounded-xl px-4 pr-10 text-left text-gray-900 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
          {options.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-400">No options available</div>
          )}
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt)}
              className="w-full px-4 py-3 text-left text-sm hover:bg-blue-50 truncate"
              title={opt.label}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FormikImageUploadField ───────────────────────────────────────────────────
// `files` can now contain a mix of:
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
        key: typeof file === "string" ? file : `${file.name}-${file.size}-${file.lastModified}`,
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
    const withinSize = imagesOnly.filter((f) => f.size <= maxSizeMB * 1024 * 1024);
    const oversizedCount = imagesOnly.length - withinSize.length;

    let next: ImageItem[] = multiple ? [...files, ...withinSize] : withinSize.slice(-1);

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
        className={`cursor-pointer rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors duration-200 ${
          isDragging ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-white hover:border-gray-400"
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

        <svg
          className="mx-auto h-8 w-8 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16.5V18a2 2 0 002 2h12a2 2 0 002-2v-1.5M7 9l5-5m0 0l5 5m-5-5v12"
          />
        </svg>
        <p className="text-sm font-semibold text-gray-700 mt-2">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PNG or JPG, up to {maxSizeMB}MB{multiple ? ` · up to ${maxFiles} images` : ""}
        </p>
      </div>

      {error && (
        <span className="block text-xs text-red-500 mt-1.5 ml-1 font-medium">{error}</span>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
          {previews.map((p, i) => (
            <div
              key={p.key}
              className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={typeof p.file === "string" ? "Uploaded image" : p.file.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(i);
                }}
                aria-label="Remove image"
                className="absolute top-1.5 right-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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

  // ✅ useEffect is now safely inside a real React component
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
          <div key={field.name} className="flex flex-col">
            {field.type !== "checkbox" && field.type !== "checkbox-group" && (
              <label className="text-sm font-semibold text-gray-900 mb-2">
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
                              placeholder={field.placeholder}
                              className={`h-12 bg-white border-2 border-gray-300 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder:text-gray-500 ${
                                field.Icon ? "pl-12" : "pl-4"
                              }`}
                            />
                            {field.Icon && (
                              <field.Icon
                                className="absolute left-3 top-3 text-gray-500 pointer-events-none"
                                width={20}
                                height={20}
                              />
                            )}
                          </>
                        )}
                      </Field>
                      {errors[field.name] && touched[field.name] && (
                        <span className="text-xs text-red-500 mt-1.5 ml-1 font-medium">
                          {String(errors[field.name])}
                        </span>
                      )}
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
                              className={`h-12 bg-white border-2 border-gray-300 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 pr-4 ${
                                field.Icon ? "pl-12" : "pl-4"
                              } [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100`}
                            />
                            {field.Icon && (
                              <field.Icon
                                className="absolute left-3 top-3 text-gray-500 pointer-events-none"
                                width={20}
                                height={20}
                              />
                            )}
                          </>
                        )}
                      </Field>
                      {errors[field.name] && touched[field.name] && (
                        <span className="text-xs text-red-500 mt-1.5 ml-1 font-medium">
                          {String(errors[field.name])}
                        </span>
                      )}
                    </div>
                  );

                case "select":
                  return (
                    <FormikSelectField
                      name={field.name}
                      options={field.options || []}
                      storeLabel={field.storeLabel}
                      placeholder={`Select ${field.label}`}
                    />
                  );

                case "checkbox":
                  return (
                    <Field name={field.name}>
                      {({ field: f }: FieldProps) => (
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => setFieldValue(field.name, !f.value)}
                        >
                          <div
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                              f.value ? "bg-orange-500" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                f.value ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </div>
                          <span className="text-gray-800 font-medium">{field.label}</span>
                        </div>
                      )}
                    </Field>
                  );

                case "checkbox-group":
                  return (
                    <div className="border rounded-xl p-4 space-y-3 bg-white">
                      <Field name={field.name}>
                        {({ field: f }: FieldProps) => {
                          const valueArray: string[] = Array.isArray(f.value) ? f.value : [];
                          return (
                            <div className="space-y-6">
                              {field.optionGroups?.map((group) => (
                                <div key={group.groupName} className="space-y-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {group.options.map((opt: any) => {
                                      const checked = valueArray.includes(opt.value as string);
                                      return (
                                        <div key={opt.value} className="flex items-center space-x-2">
                                          <input
                                            type="checkbox"
                                            id={`${field.name}-${opt.value}`}
                                            checked={checked}
                                            onChange={() => {
                                              setFieldValue(
                                                field.name,
                                                checked
                                                  ? valueArray.filter((v) => v !== opt.value)
                                                  : [...valueArray, opt.value],
                                              );
                                            }}
                                            className="peer h-5 w-5 shrink-0 rounded border-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer appearance-none checked:bg-orange-500 checked:border-orange-500 relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:font-bold"
                                          />
                                          <label
                                            htmlFor={`${field.name}-${opt.value}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-900"
                                          >
                                            {opt.label}
                                          </label>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        }}
                      </Field>
                    </div>
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
                                  e.target.value === "" ? undefined : Number(e.target.value),
                                )
                              }
                              placeholder={field.placeholder}
                              className={`h-12 bg-white border-2 border-gray-300 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 ${
                                field.Icon ? "pl-12" : "pl-4"
                              }`}
                            />
                            {field.Icon && (
                              <field.Icon
                                className="absolute left-3 top-3 text-gray-500 pointer-events-none"
                                width={20}
                                height={20}
                              />
                            )}
                          </>
                        )}
                      </Field>
                      {errors[field.name] && touched[field.name] && (
                        <span className="text-xs text-red-500 mt-1.5 ml-1 font-medium">
                          {String(errors[field.name])}
                        </span>
                      )}
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
                      {errors[field.name] && touched[field.name] && (
                        <span className="text-xs text-red-500 mt-1.5 ml-1 font-medium">
                          {String(errors[field.name])}
                        </span>
                      )}
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
      <DialogFooter className="mt-0 flex justify-end gap-3 px-8 py-4 border-t border-gray-200 flex-shrink-0 bg-white">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="px-6 py-2.5 h-11 border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 rounded-xl font-semibold transition-all duration-200"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 h-11 bg-gradient-to-r from-orange-600 to-orange-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
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
              : f.type === "image"
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
        className="fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden transition-all duration-300 p-0 max-h-[90vh] flex flex-col"
        style={{ maxWidth: "800px" }}
      >
        {/* Header */}
        <div className="bg-orange-500 px-8 py-6 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold tracking-tight text-white m-0">
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
          {/* ✅ Render prop now just passes props to a real component */}
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