import { Circle, Globe } from "lucide-react";
import SelectableCard from "./selectable-card";
import type { Category, CategoryIcon } from "../booking-steps/course&golfers/data";

function CategoryBadge({ icon }: { icon: CategoryIcon }) {
  const base = "flex h-5 w-6 shrink-0 items-center justify-center rounded-[4px]";

  if (icon === "bhutan") {
    return (
      <span
        aria-hidden
        className={`${base} bg-[linear-gradient(to_bottom_right,#FFC72C_50%,#F26B21_50%)]`}
      />
    );
  }
  if (icon === "saarc") {
    return (
      <span aria-hidden className={`${base} bg-[#3B6FB6] text-white`}>
        <Circle className="h-3 w-3" strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span aria-hidden className={`${base} bg-slate-600 text-white`}>
      <Globe className="h-3.5 w-3.5" />
    </span>
  );
}

type Props = {
  category: Category;
  selected: boolean;
  onSelect: () => void;
};

export default function CategoryCard({ category, selected, onSelect }: Props) {
  const { label, description, price, currency, icon } = category;

  return (
    <SelectableCard selected={selected} onClick={onSelect} className="h-full">
      <div className="flex items-start gap-2 pr-7">
        <CategoryBadge icon={icon} />
        <span className="font-bold leading-tight">{label}</span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        {description}
      </p>

      <p className="mt-auto pt-4 text-base font-extrabold">
        {currency} {price.toLocaleString("en-US")}{" "}
        <span className="text-xs font-semibold text-slate-500">/ golfer / round</span>
      </p>
    </SelectableCard>
  );
}