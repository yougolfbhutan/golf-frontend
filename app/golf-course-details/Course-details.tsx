interface CourseDetailsProps {
  items: string[];
}

export default function CourseDetails({ items }: CourseDetailsProps) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-serif text-lg font-semibold text-neutral-900">
        Course Details
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-sm border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}