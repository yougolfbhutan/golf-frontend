import { cn } from "@/lib/utils";

type Props = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export default function Choice({ selected, onClick, children }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 rounded-lg border p-4 text-left",
        selected && "border-primary ring-primary/30 ring-2",
      )}
    >
      {children}
    </button>
  );
}