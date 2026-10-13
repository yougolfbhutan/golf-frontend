export default function Price({ amount, unit }: { amount: number; unit: string }) {
  return (
    <p className="mt-auto pt-3">
      <span className="text-xl font-extrabold">
        Nu {amount.toLocaleString()}
      </span>{" "}
      <span className="text-xs text-slate-500">/ {unit}</span>
    </p>
  );
}