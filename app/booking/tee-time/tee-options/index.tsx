export type Option = { value: string; label: string };

export const COURSES: Option[] = [
  { value: "1", label: "Drakpoi Golf Course" },
  { value: "2", label: "Royal Thimphu Golf Course" },
];

export const GOLFER_TYPES: Option[] = [
  { value: "1", label: "SAARC" },
  { value: "2", label: "Bhutanese" },
  { value: "3", label: "Non-SAARC" },
];

export const GOLFER_COUNTS: Option[] = [1, 2, 3, 4].map((n) => ({
  value: String(n),
  label: String(n),
}));

