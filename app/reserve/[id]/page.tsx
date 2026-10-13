
import CustomerBookingPage from "@/app/booking/booking-page";
import { coursesdata } from "@/app/homepagecomponents/golfcourse/courses";
import Footer from "@/custom-components/footer/footer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Reserve your tee time – YouGolfBhutan",
};
export function generateStaticParams() {
  return coursesdata.map((c) => ({ id: String(c.id) }));
}

// eslint-disable-next-line @next/next/no-async-client-component
export default async function ReservePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = coursesdata.find((c) => String(c.id) === id);
  if (!course) notFound();

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
              <CustomerBookingPage />

      </div>
      <Footer />
    </main>
  );
}