import { useEquipmentLines } from "../booking-helper/use-euipment-lines";
import {
  bookingLines,
  bookingTotal,
  courseOf,
  formatDate,
  formatMoney,
  type BookingState,
} from "./booking-logic";
import { cn } from "@/lib/utils";

export function Scorecard({ state, className }: { state: BookingState; className?: string }) {
  const { lines: equipmentLines, total: equipmentTotal } = useEquipmentLines(state);

  // Round/base rows + equipment rows, shown in one table
  const rows = [
    ...bookingLines(state).map((l) => ({ key: `base-${l.label}`, label: l.label, qty: l.qty, amount: l.amount })),
    ...equipmentLines.map((l) => ({ key: l.id, label: l.label, qty: l.qty, amount: l.amount })),
  ];
  const grandTotal = bookingTotal(state) + equipmentTotal;

const who =
  state.who === "Non-Bhutanese"
    ? state.passport === "saarc"
      ? "Visitor, SAARC"
      : "Visitor"
    : "Bhutanese";  const meta: [string, string][] = [
    ["Course", courseOf(state)?.short ?? "Unknown"],
    ["Golfers", String(state.players)],
    ["Date", formatDate(state.date)],
    ["Tee time", state.slot],
  ];

  return (
    <section
      aria-label="Your booking summary"
      className={cn(
        // sticky on desktop; self-start stops grid/flex parents from stretching it
        "self-start overflow-hidden rounded-3xl bg-white ",
        className,
      )}
    >
      {/* Header */}
      <header className="relative overflow-hidden  bg-emerald-500 via-emerald-600 to-teal-600 px-5 py-5 text-white">
        <div aria-hidden className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
        <div aria-hidden className="absolute -bottom-12 right-10 h-24 w-24 rounded-full bg-white/10" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-50/80">
              Booking summary
            </p>
            <h3 className="font-heading text-xl font-bold leading-tight">Your scorecard</h3>
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">{who}</span>
        </div>
      </header>

      <div className="space-y-4 p-4">
        {/* Meta tiles */}
        <dl className="grid grid-cols-2 gap-2.5">
          {meta.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-emerald-50/70 px-3.5 py-2.5 ring-1 ring-emerald-600/10">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700/80">{label}</dt>
              <dd className="mt-0.5 text-[15px] font-semibold text-slate-800">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Line items (round + equipment) */}
        <table className="w-full border-collapse text-[15px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400">
              <th className="pb-2 pl-1 font-semibold">Item</th>
              <th className="pb-2 text-center font-semibold">Qty</th>
              <th className="pb-2 pr-1 text-right font-semibold">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((l) => (
              <tr key={l.key} className="align-top">
                <td className="py-2.5 pl-1 text-slate-700">{l.label}</td>
                <td className="py-2.5 text-center">
                  <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    ×{l.qty}
                  </span>
                </td>
                <td className="whitespace-nowrap py-2.5 pr-1 text-right font-semibold text-slate-800">
                  {formatMoney(state.who, l.amount)}
                </td>
              </tr>
            ))}
            {state.ownGear && (
              <tr className="text-slate-400">
                <td className="py-2.5 pl-1 italic">Own equipment</td>
                <td className="py-2.5 text-center">–</td>
                <td className="py-2.5 pr-1 text-right">{formatMoney(state.who, 0)}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3.5 ring-1 ring-emerald-600/15">
          <span className="font-heading text-base font-semibold text-emerald-800">Total</span>
          <strong className="font-heading text-3xl font-extrabold tracking-tight text-emerald-700">
            {formatMoney(state.who, grandTotal)}
          </strong>
        </div>

        <p className="border-t border-dashed border-slate-200 pt-2 text-center text-xs text-slate-400">
          Marker&apos;s signature: YouGolfBhutan
        </p>
      </div>
    </section>
  );
}

/** Optional: fixed bottom bar for mobile. Render it once next to <Scorecard />. */
export function ScorecardTotalBar({ state }: { state: BookingState }) {
  const { total: equipmentTotal } = useEquipmentLines(state);
  const grandTotal = bookingTotal(state) + equipmentTotal;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-emerald-900/10 bg-white/90 px-5 py-3 backdrop-blur-md lg:hidden">
      <span className="font-heading font-semibold text-slate-600">Total</span>
      <strong className="font-heading text-2xl font-extrabold text-emerald-700">
        {formatMoney(state.who, grandTotal)}
      </strong>
    </div>
  );
}