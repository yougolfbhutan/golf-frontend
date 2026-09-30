// src/lib/email-templates/booking.ts
export function bookingConfirmationEmail(params: {
  partyName: string;
  golfCourseName: string;
  teeOffDate: Date;
  totalPrice: string;
  bookingId: number;
}) {
  return `
    <h2>Booking Confirmed</h2>
    <p>Hi ${params.partyName},</p>
    <p>Your booking at <strong>${params.golfCourseName}</strong> is confirmed.</p>
    <ul>
      <li>Booking ID: ${params.bookingId}</li>
      <li>Tee-off: ${params.teeOffDate.toLocaleString()}</li>
      <li>Total: $${params.totalPrice}</li>
    </ul>
    <p>See you on the course!</p>
  `;
}

export function newBookingAdminAlertEmail(params: {
  partyName: string;
  partyEmail: string;
  partyPhone: string;
  golfCourseName: string;
  teeOffDate: Date;
  totalPrice: string;
  bookingId: number;
}) {
  return `
    <h2>New Booking Received</h2>
    <ul>
      <li>Booking ID: ${params.bookingId}</li>
      <li>Course: ${params.golfCourseName}</li>
      <li>Tee-off: ${params.teeOffDate.toLocaleString()}</li>
      <li>Party: ${params.partyName} (${params.partyEmail}, ${params.partyPhone})</li>
      <li>Total: $${params.totalPrice}</li>
    </ul>
  `;
}