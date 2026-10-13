import { useEffect, useState } from "react";
import type { TeeSlot } from "./time-slotpicker";

export function useTeeSlots(courseId: string | null, date: string | null) {
  const [slots, setSlots] = useState<TeeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !date) {
      setSlots([]);
      return;
    }
    setLoading(true);

    // FAKE DATA for testing. Replace with a fetch() to your API later.
    const t = setTimeout(() => {
      setSlots([
        { time: "06:30", spotsLeft: 2 },
        { time: "06:50", spotsLeft: 4 },
        { time: "07:10", spotsLeft: 3 },
        { time: "08:10", spotsLeft: 1 },
        { time: "08:30", spotsLeft: 0 },
        { time: "08:50", spotsLeft: 4 },
        { time: "12:10", spotsLeft: 3 },
        { time: "12:30", spotsLeft: 4 },
        { time: "14:10", spotsLeft: 4 },
        { time: "14:30", spotsLeft: 1 },
        { time: "15:10", spotsLeft: 4 },
      ]);
      setLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, [courseId, date]);

  return { slots, loading, error };
}
