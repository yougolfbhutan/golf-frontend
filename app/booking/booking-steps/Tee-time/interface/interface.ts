// status values: add any others your backend sends
export type TeeTimeStatus = "AVAILABLE" | "FULL" | "BLOCKED" | "CLOSED";

export interface TeeTimeAttributes {
  id: number | null;     // null until a booking is saved for this slot
  teeDate: string;       // "YYYY-MM-DD", e.g. "2026-11-26"
  teeTime: string;       // "HH:mm", e.g. "07:00"
  maxGolfers: number;
  bookedGolfers: number;
  placesLeft: number;
  status: TeeTimeStatus;
}

export interface getTeeTimeResponse {
  success: boolean;
  message: string;
  data: TeeTimeAttributes[]; // list is directly under data
}