import { Info, Percent } from "lucide-react";

export function PromoBanner() {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg bg-emerald-950 px-4 py-3 text-amber-50">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-emerald-950">
        <Percent className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-semibold">
          5% off when you book 2 or more rounds!
        </p>
        <p className="text-xs text-amber-100/80">
          Discount applied automatically. All prices in USD.
        </p>
      </div>
    </div>
  );
}

export function EquipmentInfoPills() {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <span className="rounded-md border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
        Premium (New):{" "}
        <span className="font-semibold text-emerald-800">$60 / round</span>
      </span>
      <span className="rounded-md border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
        Regular (Used):{" "}
        <span className="font-semibold text-emerald-800">$40 / round</span>
      </span>
      <span className="flex items-center gap-1 rounded-md border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
        <Info className="h-3 w-3" /> Basis:{" "}
        <span className="font-semibold text-emerald-800">
          Per round (18 holes)
        </span>
      </span>
    </div>
  );
}