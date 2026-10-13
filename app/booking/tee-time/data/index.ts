export type FieldKey = "course" | "golferType" | "date" | "golfers";
 
// One entry per field: add, remove or reorder fields here only.
export const FIELDS: { key: FieldKey; label: string; className: string }[] = [
  { key: "course", label: "Course", className: "lg:flex-[1.6]" },
  { key: "golferType", label: "I am", className: "lg:flex-[1.2]" },
  { key: "date", label: "Date", className: "lg:flex-[1.2]" },
  { key: "golfers", label: "Golfers", className: "lg:flex-1" },
];