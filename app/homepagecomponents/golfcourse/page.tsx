import CourseCard from "./course-card";
import Header from "./course-header";
import { coursesdata } from "./courses";


export default function GolfCourses() {
  return (
    <section id="golf-courses" className="min-h-screen scroll-mt-20 bg-white">
      <Header />

      <main className="mx-auto max-w-5xl px-6 pb-20">
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
        >
          {coursesdata.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

      </main>
    </section>
  );
}