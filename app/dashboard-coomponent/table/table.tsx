/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MoreVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (value: T[keyof T] | undefined, row: T) => React.ReactNode;
};

export type ActionConfig<T> = {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T, event?: React.MouseEvent) => void;
  show?: (row: T) => boolean;
  title?: string;
};

// NEW: when provided, the table stops slicing `data` itself and instead
// trusts the caller to already hand it just the current page's rows.
export type ServerPaginationConfig = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  caption?: string;
  footer?: React.ReactNode;
  actions?: ActionConfig<T>[];
  selectable?: boolean;
  onSelectionChange?: (rows: T[]) => void;
  pageSize?: number;
  topControls?: React.ReactNode;
  onRowClick?: (row: T) => void;
  serverPagination?: ServerPaginationConfig; // NEW
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  caption,
  footer,
  actions = [],
  selectable = false,
  onSelectionChange,
  pageSize = 6,
  topControls,
  onRowClick,
  serverPagination,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [internalPage, setInternalPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);

  const hasActions = actions.length > 0;
  const isServerMode = !!serverPagination;

  // In server mode, `data` is already just the current page's rows —
  // don't slice it again. In client mode, slice locally as before.
  const currentPage = isServerMode ? serverPagination.currentPage : internalPage;
  const totalPages = isServerMode
    ? Math.max(serverPagination.totalPages, 1)
    : Math.ceil(data.length / pageSize);

  const startIdx = (internalPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentData = isServerMode ? data : data.slice(startIdx, endIdx);

  // Sorting (applies to whatever page of data is currently shown)
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return currentData;

    const sorted = [...currentData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig?.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return sorted;
  }, [currentData, sortConfig]);

  const toggleRow = (index: number) => {
    const updated = new Set(selectedRows);
    if (updated.has(index)) {
      updated.delete(index);
    } else {
      updated.add(index);
    }
    setSelectedRows(updated);
    onSelectionChange?.(sortedData.filter((_, i) => updated.has(i)));
  };

  const toggleAll = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const all = new Set(sortedData.map((_, i) => i));
      setSelectedRows(all);
      onSelectionChange?.(sortedData);
    }
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (isServerMode) {
      serverPagination.onPageChange(page);
    } else {
      setInternalPage(page);
    }
    setSelectedRows(new Set());
  };

  return (
    <div className="w-full border border-slate-200 rounded-md overflow-x-auto">
      {/* Top Controls + Pagination */}
      <div className="flex justify-between items-center p-2 flex-wrap gap-2">
        <div>{topControls}</div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || (isServerMode && serverPagination.isFetching)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant={currentPage === 1 ? "default" : "ghost"}
              onClick={() => goToPage(1)}
            >
              1
            </Button>

            {currentPage > 3 && (
              <span className="px-2">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => page > 1 && page < totalPages)
              .filter(
                (page) =>
                  page === currentPage ||
                  page === currentPage - 1 ||
                  page === currentPage + 1,
              )
              .map((page) => (
                <motion.div
                  key={page}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    size="sm"
                    variant={currentPage === page ? "default" : "ghost"}
                    onClick={() => goToPage(page)}
                    className={`transition-transform duration-200 ${currentPage === page ? "scale-105" : ""}`}
                  >
                    {page}
                  </Button>
                </motion.div>
              ))}

            {currentPage < totalPages - 2 && (
              <span className="px-2 text-center flex justify-center">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            )}

            {totalPages > 1 && (
              <Button
                size="sm"
                variant={currentPage === totalPages ? "default" : "ghost"}
                onClick={() => goToPage(totalPages)}
              >
                {totalPages}
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || (isServerMode && serverPagination.isFetching)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Table className="w-full border-collapse">
        {caption && <TableCaption>{caption}</TableCaption>}

        <TableHeader>
          <TableRow className="border-slate-50 bg-slate-100 dark:bg-green-800">
            {selectable && (
              <TableHead className="w-12 py-4">
                <Checkbox
                  checked={
                    selectedRows.size === sortedData.length &&
                    sortedData.length > 0
                  }
                  onCheckedChange={toggleAll}
                />
              </TableHead>
            )}
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                className="text-sm font-medium text-slate-700 py-4 cursor-pointer select-none"
                onClick={() => {
                  if (!col.accessor) return;
                  setSortConfig((prev) => ({
                    key: col.accessor!,
                    direction:
                      prev?.key === col.accessor && prev!.direction === "asc"
                        ? "desc"
                        : "asc",
                  }));
                }}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {sortConfig?.key === col.accessor ? (
                    sortConfig?.direction === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : null}
                </div>
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className="text-right py-4">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={
                  columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)
                }
                className="text-center py-10 text-slate-500"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, rowIdx) => (
              <motion.tr
                key={rowIdx}
                className="border-b border-slate-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: rowIdx * 0.05 }}
                whileHover={{ backgroundColor: "rgba(255, 165, 0, 0.1)" }}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <TableCell className="py-4">
                    <Checkbox
                      checked={selectedRows.has(rowIdx)}
                      onCheckedChange={() => toggleRow(rowIdx)}
                    />
                  </TableCell>
                )}

                {columns.map((col, colIdx) => (
                  <TableCell
                    key={colIdx}
                    className="text-sm text-slate-800 py-4"
                  >
                    {col.render
                      ? col.render(
                          col.accessor ? row[col.accessor] : undefined,
                          row,
                        )
                      : col.accessor && row[col.accessor]}
                  </TableCell>
                ))}

                {hasActions && (
                  <TableCell className="text-right py-4">
                    <div className="flex justify-end items-center gap-2">
                      {actions
                        .filter((action) => !action.show || action.show(row))
                        .slice(0, 2)
                        .map((action, idx) => (
                          <Button
                            key={idx}
                            variant="ghost"
                            size="sm"
                            title={action.title}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row, e);
                            }}
                            className="h-8 w-8 p-0 bg-white dark:bg-gray-800 shadow-lg text-orange-500"
                          >
                            {action.icon ?? action.title}
                          </Button>
                        ))}

                      {actions.filter(
                        (action) => !action.show || action.show(row),
                      ).length > 2 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 ml-2 flex items-center justify-center
                               bg-white dark:bg-gray-800 shadow-sm rounded-md hover:bg-orange-100 transition-colors
                               border-0"
                              title="More actions"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More actions</span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            sideOffset={5}
                            className="bg-white shadow-lg rounded-md p-1 z-50 min-w-[150px] border-0"
                          >
                            {actions
                              .filter(
                                (action) => !action.show || action.show(row),
                              )
                              .slice(2)
                              .map((action, idx) => (
                                <DropdownMenuItem
                                  key={idx}
                                  title={action.title}
                                  onClick={() => action.onClick(row)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-orange-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                >
                                  {action.icon && (
                                    <span className="h-8 w-8 p-0 bg-white shadow-lg text-orange-500 flex items-center justify-center">
                                      {action.icon}
                                    </span>
                                  )}
                                  <span className="text-sm">
                                    {action.title}
                                  </span>
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </TableCell>
                )}
              </motion.tr>
            ))
          )}
        </TableBody>

        {footer && (
          <TableFooter>
            <TableRow className="border-t border-slate-200">
              <TableCell
                colSpan={
                  columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)
                }
                className="py-4 font-medium"
              >
                {footer}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}