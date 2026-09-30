import { DisplayForm } from "@/custom-components/display-form";
import type { OrderItem } from "../../Booking/interface";

export default function AccesoriesDetails({ data }: { data: OrderItem }) {
  return (
    <DisplayForm
      fields={[
        { name: "name", label: "Accesories Name", type: "text" },
        { name: "quantity", label: "Accesories Quantity", type: "text" },
        { name: "unitPrice", label: "per/Price", type: "text" },

        { name: "subtotal", label: "Total Prive", type: "text" },
      ]}
      data={data}
      //   title="Party Details"
    />
  );
}
