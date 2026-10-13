export function StepBody({ title, sub, action, children }: { title: string; sub: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div><h2 className="font-display text-2xl font-bold">{title}</h2><p className="text-muted-foreground mt-1">{sub}</p></div>
        {action}
      </div>
      <div className="grid gap-6">{children}</div>
    </div>
  );
}