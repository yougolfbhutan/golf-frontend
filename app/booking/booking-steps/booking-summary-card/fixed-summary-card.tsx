type Props = {
  children: React.ReactNode;
};

export default function FixedSummary({ children }: Props) {
  return (
    <aside className="hidden w-[320px] self-start lg:sticky lg:top-1/2 lg:block lg:-translate-y-1/2">
      {children}
    </aside>
  );
}