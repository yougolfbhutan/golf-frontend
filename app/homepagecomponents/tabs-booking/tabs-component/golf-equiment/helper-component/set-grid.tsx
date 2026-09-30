// import { GolfSetCard } from "./golf-setcard";
// import type { Carryset } from "../interface";

// export function SetsGrid({
//   sets,
//   selectedSet,
//   onSelect,
// }: {
//   sets: Carryset[];
//   selectedSet: number;
//   onSelect: (id: string) => void;
// }) {
//   if (sets.length === 0) {
//     return (
//       <p className="rounded-md border border-dashed bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
//         No sets available for this combination yet.
//       </p>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
//       {sets.map((set) => (
//         <GolfSetCard
//           key={set.id}
//           set={set}
//            selected={selectedSet === Number(set.id)}
//   onSelect={() => onSelect(String(set.id))}
//         />
//       ))}
//     </div>
//   );
// }