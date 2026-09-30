import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BookingDateCard({
  teeOffDate,
  onTeeOffDateChange,
  rounds,
  onRoundsChange,
}: {
  teeOffDate: string;
  onTeeOffDateChange: (value: string) => void;
  rounds: number;
  onRoundsChange: (value: number) => void;
}) {
  return (
    <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-950 text-amber-50">
          <Calendar className="h-4 w-4" />
        </span>
        <h2 className="font-serif text-xl text-emerald-950">Booking Date</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label
            htmlFor="tee-off-date"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Tee-off date
          </Label>
          <Input
            id="tee-off-date"
            type="date"
            value={teeOffDate}
            onChange={(e) => onTeeOffDateChange(e.target.value)}
            className="bg-muted/40"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="rounds"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Number of rounds
          </Label>
          <Input
            id="rounds"
            type="number"
            min={1}
            value={rounds}
            onChange={(e) => onRoundsChange(Number(e.target.value))}
            className="bg-muted/40"
          />
          <p className="text-xs text-muted-foreground">
            1 round = 1 full game (18 holes)
          </p>
        </div>
      </div>
    </div>
  );
}