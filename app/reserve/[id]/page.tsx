import { BookYourRound } from "@/app/booking/booking/book-your-round";
import { coursesdata } from "@/app/homepagecomponents/golfcourse/courses";
import Footer from "@/custom-components/footer/footer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Reserve your tee time – YouGolfBhutan",
};

export default async function ReservePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const course = coursesdata.find((c) => String(c.id) === id);
  if (!course) notFound();

  // 👇 Change these field names to match your coursesdata
  const sources = course.image ?? (course.image ? [course.image] : []);

  const images = sources.map((src, i) => ({
    src,
    alt: `${course.name} photo ${i + 1}`, // use your real name field
  }));

  return (
    <main>
      <BookYourRound courseId={course.bookingId} images={images} coursename={course.name} />
            <Footer />

    </main>
  );
}