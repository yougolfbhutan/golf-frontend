// Add fields here as you build out each step's real UI.
// Every step reads/writes a slice of THIS one object — that's what

import type { Category, Tier } from "../tabs-component/golf-equiment/helper-component/equipmentoptions";

interface AccessoryItem {
  itemId: number;
  quantity: number;
}

export interface BookingFormValues {
  partyName: string;
  partyEmail: string;
  partyPhone: string;
  roundType: "premium" | "standard" | string; // adjust union based on actual valid values
  teeOffDate: string; // ISO date format: "YYYY-MM-DD"
  teeTime?: string;    // "HH:mm"
  golfCourseName: string;
  carrySetId: number;
  numberOfRounds: number;
  accessories: AccessoryItem[];
  specialRequest?: string;
    category?: Category;
  tier?: Tier;
  saarcStatus?:string
    countryName: string;
}
export const INITIAL_BOOKING_VALUES: BookingFormValues = {
  partyName: "",
  partyEmail: "",
  partyPhone: "",
  roundType: "premium",
  teeOffDate: "",
  teeTime: "",
  golfCourseName: "",
  carrySetId: 0,
  numberOfRounds: 1,
  accessories: [],
  specialRequest: "",
  saarcStatus:"",
    countryName:""
};