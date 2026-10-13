export default function Row({
  label,
  children,
  onChange,
}: {
  label: string;
  children: React.ReactNode;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <div className="mt-0.5 text-sm font-medium">{children}</div>
      </div>
      <button
        type="button"
        onClick={onChange}
        className="shrink-0 text-sm font-medium text-[#1F4D36] underline-offset-4 hover:underline"
      >
        Change
      </button>
    </div>
  );
}