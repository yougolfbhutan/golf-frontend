/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  initialBookingValues,
  parseFee,
  validateBooking,
  type BookingErrors,
  type BookingFormValues,
  type Course,
} from "./types";
import BookingDateField from "./booking-date";
import BookingSuccess from "./booking-success";
import BookingSummary, { calculateTotal } from "./booking-summary";
import ContactFields from "./contact-field";
import RoundOptions from "./round-options";
import TeeTimePicker from "./tee-time";
import { useCreateBookingMutation, type CreateBookingAttributes } from "./tanstack-function";
import { showToast } from "nextjs-toast-notify";

const BookingSuccessView = BookingSuccess as unknown as ComponentType<{
  courseName: string;
  date: Date;
  teeTime: string;
  players: number;
  email: string;
  onClose: () => void;
}>;

export interface BookingPayload extends BookingFormValues {
  courseId: Course["id"];
  total: number;
}

interface BookingDialogProps {
  course: Course;
  trigger: ReactNode;
  onSubmit?: (payload: BookingPayload) => Promise<void>;
}

export default function BookingDialog({
  course,
  trigger,
  onSubmit,
}: BookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<BookingFormValues>(initialBookingValues);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);
   const { createBooking } = useCreateBookingMutation({
    onSuccess: (data) => {
      showToast.success(data.message, {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
      
    },
    onError: (error) => {
      showToast.error(error?.data?.message, {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
    },
  });
  const feePerRound = parseFee(course.green_fee);

  function update<K extends keyof BookingFormValues>(
    key: K,
    value: BookingFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function reset() {
    setValues(initialBookingValues);
    setErrors({});
    setSubmitError("");
    setDone(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setTimeout(reset, 200); // wait for close animation
  }
  function toDateString(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}


  async function handleSubmit() {
  const found = validateBooking(values);
  setErrors(found);
  if (Object.keys(found).length > 0) return;

  setSubmitting(true);
  setSubmitError("");
  try {
    const { total } = calculateTotal({
      feePerRound,
      players: values.players,
      holes: values.holes,
      cartRental: values.cartRental,
    });

    // Adjust the left-side `values.xxx` names to match your BookingFormValues
    const payload: CreateBookingAttributes = {
      partyName: values.fullName,
      partyEmail: values.email,
      partyPhone: values.phone,
      teeTime: values.teeTime,
      teeOffDate: toDateString(values.date!),
      golfCourseName: course.name,
      numberOfPlayers: values.players,
      totalPrice: total,
      specialRequest: values.notes ?? "",
    };

    if (onSubmit) {
      await onSubmit({ ...values, courseId: course.id, total });
    }
    await createBooking(payload); // now actually awaits and throws on failure

    setDone(true);
  } catch (err: any) {
    console.error("Booking submission error:", err);
    setSubmitError(
      err?.response?.data?.message ?? // axios error (4xx/5xx)
        err?.message ??               // errorResponse thrown in createBooking
        "The booking didn't go through. Try again.",
    );
  } finally {
    setSubmitting(false);
  }
}

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden rounded-sm p-0 sm:max-w-[560px]">
        {done && values.date ? (
          <div className="overflow-y-auto px-6">
            <BookingSuccessView
              courseName={course.name}
              date={values.date}
              teeTime={values.teeTime}
              players={values.players}
              email={values.email}
              onClose={() => handleOpenChange(false)}
            />
          </div>
        ) : (
          <>
            {/* Header: fixed height */}
            <DialogHeader className="shrink-0 border-b border-neutral-200 px-6 pb-4 pt-6 text-left">
              <p className="text-xs font-medium tracking-widest text-black">
                {course.location}
              </p>
              <DialogTitle className="font-serif text-2xl font-semibold">
                {course.name}
              </DialogTitle>
              <DialogDescription>
                Reserve a tee time. You won&apos;t be charged until you check
                in.
              </DialogDescription>
            </DialogHeader>

            {/* Body: takes remaining space and scrolls */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="flex flex-col gap-5 px-6 py-5">
                <BookingDateField
                  value={values.date}
                  onChange={(d) => {
                    update("date", d);
                    update("teeTime", ""); // times depend on the date
                  }}
                  error={errors.date}
                />

                <TeeTimePicker
                  value={values.teeTime}
                  onChange={(t) => update("teeTime", t)}
                  disabled={!values.date}
                  error={errors.teeTime}
                />

                <RoundOptions
                  players={values.players}
                  holes={values.holes}
                  cartRental={values.cartRental}
                  courseHoles={course.holes}
                  onPlayersChange={(n) => update("players", n)}
                  onHolesChange={(h) => update("holes", h)}
                  onCartChange={(v) => update("cartRental", v)}
                />

                <ContactFields
                  values={values}
                  errors={errors}
                  onChange={(field, v) => update(field, v)}
                />
              </div>
            </div>

            {/* Footer: fixed height */}
            <DialogFooter className="shrink-0 flex-col gap-3 border-t border-neutral-200 px-6 py-4 sm:flex-col sm:space-x-0">
              <BookingSummary
                feePerRound={feePerRound}
                players={values.players}
                holes={values.holes}
                cartRental={values.cartRental}
              />
              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="h-11 w-full rounded-sm bg-[#10B759] text-sm font-semibold tracking-widest hover:bg-[#0e9f4d]"
              >
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {submitting ? "Reserving…" : "Reserve tee time"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
