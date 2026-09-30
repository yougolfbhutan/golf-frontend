import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATEGORY_OPTIONS, type Category } from "./equipmentoptions";

export function CategoryToggle({
  value,
  onChange,
}: {
  value: Category;
  onChange: (value: Category) => void;
}) {
  return (
    <div className="mb-4 flex gap-2">
      {CATEGORY_OPTIONS.map((option) => (
        <Button
          key={option.key}
          type="button"
          size="sm"
          variant={value === option.key ? "default" : "outline"}
          className={cn(
            "rounded-full",
            value === option.key &&
              "bg-emerald-950 text-amber-50 hover:bg-emerald-900",
          )}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}