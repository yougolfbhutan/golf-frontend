export default function Illustration({
  src,
  tag,
}: {
  src?: string;
  tag?: string;
}) {
  return (
    <div className="relative mb-3 flex h-24 items-center justify-center rounded-xl bg-slate-100">
      {src && <img src={src} alt="" className="h-full object-contain" />}
      {tag && (
        <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold">
          {tag}
        </span>
      )}
      <span className="absolute bottom-2 right-2 rounded bg-white/80 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-slate-500">
        ILLUSTRATION
      </span>
    </div>
  );
}