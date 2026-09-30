"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BookingErrors, BookingFormValues } from "./types";

type ContactKeys = "fullName" | "email" | "phone" | "notes";

interface ContactFieldsProps {
  values: Pick<BookingFormValues, ContactKeys>;
  errors: BookingErrors;
  onChange: (field: ContactKeys, value: string) => void;
}

export default function ContactFields({ values, errors, onChange }: ContactFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          className="rounded-sm"
          value={values.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          aria-invalid={!!errors.fullName}
          autoComplete="name"
        />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="rounded-sm"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            aria-invalid={!!errors.email}
            autoComplete="email"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            className="rounded-sm"
            value={values.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            aria-invalid={!!errors.phone}
            autoComplete="tel"
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">
          Notes <span className="font-normal text-neutral-400">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          rows={2}
          className="resize-none rounded-sm"
          placeholder="Club rental, handicap, special requests…"
          value={values.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </div>
    </div>
  );
}