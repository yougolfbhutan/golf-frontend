import type { BookingStep } from "../tabs-component/golf-equiment/interface";

export const STEPS: BookingStep[] = [
    { value: "course", number: 1, label: "Course" },

  { value: "equipment", number: 2, label: "Equipment" },
  { value: "addons", number: 3, label: "Add-ons" },
//   { value: "caddy", number: 4, label: "Caddy" },
//   { value: "souvenirs", number: 5, label: "Souvenirs" },
  { value: "confirm", number: 4, label: "Confirm" },
];