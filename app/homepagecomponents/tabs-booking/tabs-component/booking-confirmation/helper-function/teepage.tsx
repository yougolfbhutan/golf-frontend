import { Card } from "@/components/ui/card";
import { useFormikContext } from "formik";
import { Clock } from "lucide-react";
import type { BookingFormValues } from "../../../booking-form-values";
import { cn } from "@heroui/react";
type SlotStatus = "available" | "taken";

interface TimeSlot {
  time: string;
  status: SlotStatus;
}

const TIME_SLOTS: TimeSlot[] = [
  { time: "6:00 AM", status: "available" },
  { time: "6:30 AM", status: "available" },
  { time: "7:00 AM", status: "taken" },
  { time: "7:30 AM", status: "available" },
  { time: "8:00 AM", status: "available" },
  { time: "8:30 AM", status: "taken" },
  { time: "9:00 AM", status: "available" },
  { time: "9:30 AM", status: "available" },
  { time: "10:00 AM", status: "available" },
  { time: "10:30 AM", status: "available" },
  { time: "11:00 AM", status: "taken" },
  { time: "11:30 AM", status: "available" },
  { time: "12:00 PM", status: "available" },
  { time: "1:00 PM", status: "available" },
  { time: "2:00 PM", status: "taken" },
  { time: "3:00 PM", status: "available" },
  { time: "4:00 PM", status: "available" },
];
export function TeePage() {
  //   const { handleSubmit, validateForm } = useFormikContext<BookingFormValues>();
  const { values, setFieldValue } = useFormikContext<BookingFormValues>();
  const selectedTime = values.teeTime;

  return (
    <>
      {/* ---- Tee Time (time only) ---- */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white">
            <Clock className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-semibold text-emerald-900 font-serif">
            Tee Time
          </h2>
          <span className="ml-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            Complimentary for Tourists ✓
          </span>
        </div>

        {/* Time slots */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-3">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedTime === slot.time;
            const isTaken = slot.status === "taken";
            return (
              <button
                key={slot.time}
                type="button"
                disabled={isTaken}
                onClick={() => setFieldValue("teeTime", slot.time)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs font-medium transition-colors duration-150",
                  isTaken &&
                    "cursor-not-allowed border-border bg-muted text-muted-foreground line-through",
                  !isTaken &&
                    !isSelected &&
                    "border-border bg-white text-emerald-900 hover:border-emerald-400",
                  isSelected && "border-emerald-900 bg-emerald-900 text-white",
                )}
              >
                {slot.time}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-border bg-white" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-emerald-900" />
            Selected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-muted" />
            Taken
          </span>
        </div>
      </Card>
    </>
  );
}

export default TeePage;
