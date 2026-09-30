"use client";

import * as React from "react";
import {
  User,
  ShieldCheck,
  ClipboardList,
  Info,
  CloudRain,
  Wrench,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormikContext } from "formik";
import type { BookingFormValues } from "../../booking-form-values";
import TeePage from "./helper-function/teepage";
import PhoneField from "./helper-function/country-feild";

/* ------------------------------ Section header ------------------------------ */

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white">
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="text-lg font-semibold text-emerald-900 font-serif">
        {title}
      </h2>
    </div>
  );
}

/* -------------------------------- Your details -------------------------------- */

function YourDetails() {
  const { values, handleChange, errors, touched } =
    useFormikContext<BookingFormValues>();

  return (
    <Card className="p-6">
      <SectionHeader icon={User} title="Your Details" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="partyName"
            value={values.partyName}
            onChange={handleChange}
            placeholder="Enter Your Full Name"
          />
          {touched.partyName && errors.partyName && (
            <span className="text-xs text-red-600">{errors.partyName}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="partyEmail"
            type="email"
            value={values.partyEmail}
            onChange={handleChange}
            placeholder="Enter Your Name"
          />
          {touched.partyEmail && errors.partyEmail && (
            <span className="text-xs text-red-600">{errors.partyEmail}</span>
          )}
        </div>

        
        <PhoneField/>
      </div>

      {/* Special requests */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Special Requests / Notes</Label>
        <Textarea
          id="notes"
          name="specialRequest"
          rows={3}
          value={values.specialRequest}
          onChange={handleChange}
          placeholder="Dietary, mobility, kids confirmation, equipment preferences..."
        />
      </div>
    </Card>
  );
}

/* ----------------------------- Cancellation policy ----------------------------- */

interface CancellationRow {
  window: string;
  fee: string;
  refund: string;
  tone: "free" | "low" | "mid" | "high" | "none";
}

const CANCELLATION_ROWS: CancellationRow[] = [
  {
    window: "8 or more days before",
    fee: "0% – Free",
    refund: "Full refund (100%)",
    tone: "free",
  },
  { window: "4 days before", fee: "5% fee", refund: "95% refund", tone: "low" },
  {
    window: "3 days before",
    fee: "15% fee",
    refund: "85% refund",
    tone: "mid",
  },
  {
    window: "2 days before",
    fee: "35% fee",
    refund: "65% refund",
    tone: "mid",
  },
  {
    window: "1 day before",
    fee: "20% fee",
    refund: "80% refund",
    tone: "high",
  },
  {
    window: "On booking date",
    fee: "No cancellation",
    refund: "No refund",
    tone: "none",
  },
];

const FEE_TONE_CLASSES: Record<CancellationRow["tone"], string> = {
  free: "text-emerald-700",
  low: "text-emerald-700",
  mid: "text-amber-700",
  high: "text-amber-700",
  none: "text-red-600 font-semibold",
};

function AccordionRow({
  icon: Icon,
  title,
  children,
  defaultOpen = false,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-emerald-900">
          <Icon className="h-4 w-4 text-emerald-700" />
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-border px-3 py-2.5 text-xs text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
}

function CancellationPolicy({
  selectedDateLabel,
  currentFee,
}: {
  selectedDateLabel?: string;
  currentFee?: string;
}) {
  return (
    <Card className="p-6">
      <SectionHeader icon={ShieldCheck} title="Cancellation Policy" />

      <div className="overflow-hidden rounded-lg border border-border mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-emerald-900 text-white">
              <th className="px-3 py-2 text-left text-xs font-medium">
                Days Before Booking
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium">
                Cancellation Fee
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium">
                You Receive Back
              </th>
            </tr>
          </thead>
          <tbody>
            {CANCELLATION_ROWS.map((row, i) => (
              <tr
                key={row.window}
                className={cn(
                  "border-t border-border",
                  i % 2 === 1 && "bg-muted/30",
                )}
              >
                <td className="px-3 py-2 text-emerald-900">{row.window}</td>
                <td className={cn("px-3 py-2", FEE_TONE_CLASSES[row.tone])}>
                  {row.fee}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {row.refund}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live cancellation fee checker */}
      <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-xs text-amber-800">
          <span className="font-medium">Live cancellation fee checker — </span>
          based on the date you selected in Step 3, here&apos;s your
          cancellation fee if you cancelled today.{" "}
          {selectedDateLabel ? (
            <>
              For <span className="font-medium">{selectedDateLabel}</span>, your
              fee today would be{" "}
              <span className="font-medium">{currentFee ?? "0%"}</span>.
            </>
          ) : (
            "Select a tee time in Step 3 to see your cancellation fee here."
          )}
        </p>
      </div>

      {/* Weather + equipment policy accordions */}
      <div className="flex flex-col gap-2">
        <AccordionRow icon={CloudRain} title="Weather Policy">
          If the course is closed due to weather, you receive a full refund or
          free rescheduling within 30 days.
        </AccordionRow>
        <AccordionRow icon={Wrench} title="Equipment Policy">
          Minor wear is acceptable. Significant damage will be assessed and
          charged at replacement cost.
        </AccordionRow>
      </div>
    </Card>
  );
}

/* -------------------------------- Order summary -------------------------------- */

function OrderSummary() {
  const { values } = useFormikContext<BookingFormValues>();

  const accessoriesTotal = values.accessories.reduce(
    (sum, a) => sum + a.quantity,
    0,
  );

  const lines = [
    {
      label: "Golf Set",
      value: values.carrySetId ? String(values.carrySetId) : "—",
      muted: !values.carrySetId,
    },
    { label: "Rounds", value: String(values.numberOfRounds), muted: false },
    {
      label: "Accessories selected",
      value: accessoriesTotal > 0 ? `${accessoriesTotal} item(s)` : "—",
      muted: accessoriesTotal === 0,
    },
    {
      label: "Course",
      value: values.golfCourseName || "—",
      muted: !values.golfCourseName,
    },
    {
      label: "Tee time",
      value: values.teeTime || "—",
      muted: !values.teeTime,
    },
  ];

  return (
    <Card className="p-6">
      <SectionHeader icon={ClipboardList} title="Order Summary" />

      <div className="flex flex-col divide-y divide-dashed divide-border">
        {lines.map((line) => (
          <div
            key={line.label}
            className="flex items-center justify-between py-2 text-sm"
          >
            <span className="text-muted-foreground">{line.label}</span>
            <span
              className={cn(
                "font-medium",
                line.muted ? "text-muted-foreground" : "text-emerald-900",
              )}
            >
              {line.value}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">
        Caddy gratuity ($5–15/round) not included. Full policy included above.
      </p>
    </Card>
  );
}

/* -------------------------------- Component -------------------------------- */

export function BookingDetailsStep({ onBack ,isPending}: { onBack?: () => void ,  isPending: boolean;
}) {
  const { handleSubmit, validateForm } = useFormikContext<BookingFormValues>();

  return (
    <>
      <div className="mx-auto flex flex-col gap-5 rounded-xl border bg-card shadow-sm">
        <YourDetails />
        <TeePage/>
        <CancellationPolicy
          selectedDateLabel="Jul 30, 6:00 AM"
          currentFee="0%"
        />
        <OrderSummary />
      </div>

      <div className="flex justify-between mt-2 p-2">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <Button
          className="bg-amber-500 text-white hover:bg-amber-600"
          onClick={async () => {
            const errs = await validateForm();
            console.log("validation errors:", errs);
            if (Object.keys(errs).length > 0) return; // don't submit if invalid
            handleSubmit();
          }}
          // disabled={isSubmitting}
        >
            {isPending ? "Booking..." : "submit"}

        </Button>
      </div>
    </>
  );
}

export default BookingDetailsStep;
