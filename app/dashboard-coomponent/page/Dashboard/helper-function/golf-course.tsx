import { DisplayForm } from "@/custom-components/display-form";
import type { GolfCourse } from "../../Booking/interface";

export default function GolfCourseDetails({ data }: { data: GolfCourse }) {
  return (
    <DisplayForm
      fields={[
        { name: "name", label: "Golf Course Name", type: "text" },
        { name: "price", label: "Price", type: "text" },
        { name: "email", label: "Email", type: "text" },
      ]}
      data={data}
    //   title="Party Details"
    />
  );
}
