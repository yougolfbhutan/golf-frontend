import { DisplayForm } from "@/custom-components/display-form";
import type { CarrySet } from "../../Booking/interface";

export default function CarrysetDetails({ data }: { data: CarrySet }) {
  return (
    <DisplayForm
      fields={[
        { name: "name", label: "Carryset Name", type: "text" },
       
      ]}
      data={data}
    //   title="Party Details"
    />
  );
}
