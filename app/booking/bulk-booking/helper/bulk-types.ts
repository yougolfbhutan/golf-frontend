import type { BulkState } from "../bulk-types/bulk-types";

// bulk-types.ts
export const SAARC_RATE = 160;      // USD per SAARC golfer
export const NON_SAARC_RATE = 220;  // USD per non-SAARC golfer

export const bulkAmounts = (b: Pick<BulkState, "saarcGolfers" | "nonSaarcGolfers">) => {
  const saarcAmount = b.saarcGolfers * SAARC_RATE;
  const nonSaarcAmount = b.nonSaarcGolfers * NON_SAARC_RATE;
  return { saarcAmount, nonSaarcAmount, total: saarcAmount + nonSaarcAmount };
};

export const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

