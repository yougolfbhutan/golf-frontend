import { CheckCircle2 } from "lucide-react";

interface ClubFacilitiesProps {
  items: string[];
}

export default function ClubFacilities({ items }: ClubFacilitiesProps) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-serif text-lg font-semibold text-neutral-900">
        Club Facilities
      </h3>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {items.map((item) => (
          <span
            key={item}
            className="flex items-center gap-2 text-sm text-neutral-700"
          >
            <CheckCircle2 className="h-4 w-4 text-[#10B759]" strokeWidth={2} />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}