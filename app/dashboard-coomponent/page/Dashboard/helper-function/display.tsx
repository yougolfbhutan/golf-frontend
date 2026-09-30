// booking-detail-card.tsx
import { DisplayForm } from "@/custom-components/display-form";
import type { BookingResult } from "../../Booking/interface";

export default function BookingDetailCard({ data }: { data: BookingResult }) {
  if (!data) return null;

  const { party, golfCourse, carrySet, order } = data;

  return (
    <div className="space-y-6">
      {/* Party */}
      <DisplayForm
        title="Party Details"
        fields={[
          { name: "name", label: "Name", type: "text" },
          { name: "phone", label: "Phone No", type: "text" },
          { name: "email", label: "Email", type: "text" },
        ]}
        data={party}
      />

      {/* Golf Course */}
      <DisplayForm
        title="Golf Course"
        fields={[
          { name: "name", label: "Course Name", type: "text" },
          { name: "price", label: "Price", type: "text" },
        ]}
        data={golfCourse}
      />

      {/* Carry Set */}
      <DisplayForm
        title="Carry Set"
        fields={[
          { name: "name", label: "Carryset Name", type: "text" },
          { name: "available", label: "Available", type: "text" },
        ]}
        data={carrySet}
      />

      {/* Order summary */}
      <DisplayForm
        title="Order"
        fields={[
          { name: "status", label: "Order Status", type: "text" },
          { name: "totalPrice", label: "Total Price", type: "text" },
          { name: "createdAt", label: "Created At", type: "text" },
        ]}
        data={order}
      />

      {/* Order items */}
      {order?.items?.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Order Items</h3>
          <div className="border rounded-md divide-y">
            {order.items.map((item, idx) => (
              <div
                key={`${item.sku}-${idx}`}
                className="flex items-center gap-4 p-3 text-sm"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">
                    {item.category} · {item.color} · {item.size}
                  </p>
                </div>
                <div className="text-right">
                  <p>Qty: {item.quantity}</p>
                  <p>{item.unitPrice} each</p>
                  <p className="font-medium">{item.subtotal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}