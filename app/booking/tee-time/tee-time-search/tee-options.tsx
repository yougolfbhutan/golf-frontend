"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  COURSES,
  GOLFER_COUNTS,
  GOLFER_TYPES,
} from "../tee-options";
import Field from "../select-festures";
import { FIELDS, type FieldKey } from "../data";
import { encodeTeeSearch } from "@/lib/tee-search";
export type Option = { value: string; label: string };

export type FieldProps = {
  label: string;
  value: string;
  options: Option[];
  onValueChange: (value: string) => void;
  className?: string;
};

export default function TeeTimeSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<FieldKey, string>>({
    course: COURSES[0].value,
    golferType: GOLFER_TYPES[0].value,
    golfers: "2",
  });

  const options: Record<FieldKey, Option[]> = {
    course: COURSES,
    golferType: GOLFER_TYPES,
    golfers: GOLFER_COUNTS,
  };



  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = encodeTeeSearch({ ...values, golfers: Number(values.golfers) });
    router.push(`/tee-times/${id}`);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full flex-col gap-3 rounded bg-white p-4 shadow-lg shadow-black/5 lg:flex-row lg:items-stretch",
        className,
      )}
    >
      {FIELDS.map(({ key, label, className }) => (
        <Field
          key={key}
          label={label}
          value={values[key]}
          options={options[key]}
          onValueChange={(v) => setValues((prev) => ({ ...prev, [key]: v }))}
          className={className}
        />
      ))}
      <Button
        type="submit"
        // disabled={!date}
        className="h-auto rounded-2xl bg-[#10B759] px-8 py-4 text-base font-semibold text-white hover:bg-[#10B759] lg:flex-[1.3]"
      >
        Find tee times
      </Button>
    </form>
  );
}

