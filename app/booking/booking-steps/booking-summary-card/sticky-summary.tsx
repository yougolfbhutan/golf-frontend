type Props = {
  children: React.ReactNode;
  /** distance from the top of the viewport, in px (clear your header) */
  top?: number;
};

export default function StickySummary({ children, top = 96 }: Props) {
  return (
    <aside
      className="hidden w-[320px] self-start lg:sticky lg:block"
      style={{ top }}
    >
      {children}
    </aside>
  );
}