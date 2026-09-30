"use client";

import { useState } from "react";
import { format, startOfToday, addDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BookingDateFieldProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  error?: string;
  /** How many days ahead guests can book */
  maxDaysAhead?: number;
}

export default function BookingDateField({
  value,
  onChange,
  error,
  maxDaysAhead = 60,
}: BookingDateFieldProps) {
  const [open, setOpen] = useState(false);
  const today = startOfToday();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="booking-date">Date</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="booking-date"
            variant="outline"
            className={cn(
              "w-full justify-start rounded-sm text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "EEEE, d MMMM yyyy") : "Select a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d) => {
              onChange(d);
              setOpen(false);
            }}
            disabled={[{ before: today }, { after: addDays(today, maxDaysAhead) }]}
            // initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}