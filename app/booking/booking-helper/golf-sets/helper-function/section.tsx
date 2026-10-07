import { Skeleton } from "@heroui/react";
import type { FetchStatus } from "./types/booking-types";

/** Heading + loading skeletons + error message, shared by every section. */
export function EquipmentSection({
  title,
  status,
  emptyText,
  isEmpty,
  children,
}: {
  title: string;
  status: FetchStatus;
  emptyText: string;
  isEmpty: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h3 className="mb-4 text-lg font-bold">{title}</h3>

      {status === "loading" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
          We couldn&apos;t load {title.toLowerCase()} right now. Please try again in
          a moment.
        </p>
      )}

      {status === "ready" && (
        <>
          {children}
          {isEmpty && (
            <p className="mt-2 text-sm text-muted-foreground">{emptyText}</p>
          )}
        </>
      )}
    </section>
  );
}
