// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { Button } from "@/components/ui/button";
// import { useEffect, useMemo, useState } from "react";
// import { useFormikContext } from "formik";


// import { SetsGrid } from "./helper-component/set-grid";
// import type { BookingFormValues } from "../../booking-form-values";
// import { useCarrysetCaddie } from "./tanstack";
// import { mapCarrysetsToGolfSets } from "./datamapper";
// import type { Carryset } from "./interface";

// export function EquipmentStepContent({ onNext }: { onNext?: () => void }) {
//   const { values, setFieldValue } = useFormikContext<BookingFormValues>();
//   const { data: carrysetCaddie, isLoading, isError } = useCarrysetCaddie();

//   const allCarrysets: Carryset[] = carrysetCaddie?.data ?? [];

 

 

//   return (
//       <div className="rounded-xl border bg-card p-6 shadow-sm">
//         <div className="mb-4 flex items-center gap-2">

//           <SetsGrid
//             sets={filteredSets}
//             selectedSet={selectedSet}
//             onSelect={(v: string) => {
//               const set = filteredSets.find((s) => String(s.id) === v);
//               if (!set || !set.availability) return; // block selection when unavailable
//               setFieldValue("carrySetId", v);
//             }}
//           />
//           <div/>
//       <div/>

      
//       </div>

   
//   );
// }
