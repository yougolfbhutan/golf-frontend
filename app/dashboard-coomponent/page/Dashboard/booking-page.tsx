/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CheckCircle, Clock, Eye, Search, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { showToast } from "nextjs-toast-notify";
import { DataTable, type ActionConfig, type Column } from "../../table/table";
import type { Booking } from "../Booking/interface";
import { formatDate } from "date-fns";
import { type PanelMode, formatTime, formatMoney, StatusBadge, BookingDetailsPanel } from "./booking-ui/booking-ui";
import { useGetBookings } from "./teesheet page/tanstack";

/* ---------- page ---------- */

type StatusFilter = "all" | "pending" | "completed" | "cancelled";

export default function DashboardBookingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");


  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: bookingData, isFetching } = useGetBookings(page, limit);

  const paginated = bookingData?.data;
  const bookings: Booking[] = paginated?.data ?? [];
  const totalPages = paginated?.totalPages ?? 1;
  const totalBookings = paginated?.total ?? bookings.length;

  const counts = useMemo(() => {
    const c = (...s: string[]) => bookings.filter((b) => s.includes(b.status ?? "")).length;
    return {
      pending: c("pending"),
      completed: c("completed", "confirmed", "approved"),
      cancelled: c("cancelled"),
    };
  }, [bookings]);

  const toastOptions = {
    duration: 3000,
    position: "top-right" as const,
    transition: "topBounce" as const,
    icon: "",
    sound: true,
  };


  /* Only the columns you need at a glance. Everything else lives in "View details". */
  const columns: Column<Booking>[] = [
    {
      header: "Customer",
      render: (_v, row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-stone-900">{row.customer?.name || "—"}</p>
          {row.customer?.phone_no && (
            <p className="truncate text-xs text-stone-500">
              {`${row.customer.country_code ?? ""} ${row.customer.phone_no}`.trim()}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Course",
      render: (_v, row) => (
        <span className="text-stone-800">{row.golfCourse?.name || "—"}</span>
      ),
    },
    {
      header: "Tee time",
      render: (_v, row) => (
        <div className="whitespace-nowrap">
          <p className="text-stone-900">{(row.teeDate)}</p>
          <p className="text-xs text-stone-500">{formatTime(row.teeTime) || "—"}</p>
        </div>
      ),
    },
    {
      header: "Players",
      render: (_v, row) => (
        <span className="tabular-nums text-stone-800">{row.numberOfGolfers ?? "—"}</span>
      ),
    },
    {
      header: "Amount",
      render: (_v, row) => (
        <span className="whitespace-nowrap font-medium tabular-nums text-stone-900">
          {formatMoney(row.currency, row.totalAmount)}
        </span>
      ),
    },
    {
      header: "Status",
      render: (_v, row) => <StatusBadge status={row.status} />,
    },
  ];



  const filteredBookings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed"
          ? ["completed", "confirmed", "approved"].includes(b.status ?? "")
          : b.status === statusFilter);
      if (!matchesStatus) return false;
      if (!q) return true;
      return [b.customer?.name, b.customer?.email, b.customer?.phone_no, b.golfCourse?.name]
        .some((v) => v?.toLowerCase().includes(q));
    });
  }, [bookings, searchQuery, statusFilter]);

  const filters: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: bookings.length },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "completed", label: "Confirmed", count: counts.completed },
    { key: "cancelled", label: "Cancelled", count: counts.cancelled },
  ];


  return (
    <div className="w-full px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Bookings</h1>
          <p className="text-sm text-stone-500">
            {totalBookings} tee-time {totalBookings === 1 ? "request" : "requests"} in total
          </p>
        </header>

        {/* The one thing that needs attention */}
        {counts.pending > 0 && (
          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className="mb-6 flex w-full items-center gap-3 rounded-lg bg-amber-50 px-4 py-3 text-left ring-1 ring-inset ring-amber-200 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Clock className="h-5 w-5 shrink-0 text-amber-600" />
            <span className="text-sm text-amber-900">
              <span className="font-semibold text-amber-950">{counts.pending}</span>{" "}
              {counts.pending === 1 ? "booking is" : "bookings are"} waiting for your approval on this page.
            </span>
            <span className="ml-auto hidden text-sm font-medium text-amber-800 sm:inline">
              Show pending
            </span>
          </button>
        )}

        {/* Toolbar */}
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              type="text"
              placeholder="Search name, phone or course"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border-stone-200 bg-white pl-9 text-sm text-stone-900 placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-emerald-300"
            />
          </div>

          <nav className="flex gap-1 overflow-x-auto" aria-label="Filter by status">
            {filters.map((f) => {
              const active = statusFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  aria-pressed={active}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                    active
                      ? "bg-emerald-800 text-white"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {f.label}
                  <span className={`ml-1.5 tabular-nums ${active ? "text-emerald-200" : "text-stone-400"}`}>
                    {f.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <DataTable
            data={filteredBookings}
            columns={columns}
            serverPagination={{
              currentPage: page,
              totalPages,
              onPageChange: setPage,
              isFetching,
            }}
          />
          {!isFetching && filteredBookings.length === 0 && (
            <p className="px-6 py-10 text-center text-sm text-stone-500">
              No bookings match. Try another filter or clear the search.
            </p>
          )}
        </div>
      </div>

      
    </div>
  );
}