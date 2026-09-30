
import * as Yup from "yup";
 
// ---------------------------------------------------------------------------
// Rewritten to match the actual BookingFormValues fields collected across the
// tabs (equipment/addons/course/confirm) and the shape /api/bookings expects.
// The previous version (category/tier/rounds/addons/courseId/wantsCaddy/
// souvenirs) didn't correspond to any field this form or API actually uses —
// removed rather than merged, since keeping both would leave dead rules
// alongside real ones.
//
// Split by step so each tab CAN validate just its own slice for step-level
// errors, e.g. <Formik validationSchema={courseStepSchema}> per-tab if you
// want that later. `bookingSchema` below is the full-form schema used on the
// top-level <Formik> for the final submit gate.
// ---------------------------------------------------------------------------
 
export const equipmentStepSchema = Yup.object({
  carrySetId: Yup.number()
    .required("Please select a carry set")
    .positive()
    .integer(),
 
  // roundType: Yup.mixed<"standard" | "premium">()
  //   .oneOf(["standard", "premium"], "Round type must be standard or premium")
  //   .required("Please select a round type"),
 
  numberOfRounds: Yup.number()
    .required("Number of rounds is required")
    // .min(1, "At least 1 round is required")
    // .max(10, "Max 10 rounds per booking")
    // .integer("Rounds must be a whole number"),
});
 
export const addonsStepSchema = Yup.object({
  // Formik state is a map of variantId -> quantity, e.g. { "2": 2, "5": 0 }.
  // Not `accessories` — that array only exists after the submit-time
  // transform, so validating it here would silently do nothing.
  quantities: Yup.lazy((obj = {}) =>
    Yup.object(
      Object.keys(obj).reduce(
        (shape, variantId) => ({
          ...shape,
          [variantId]: Yup.number().min(0, "Quantity can't be negative").integer(),
        }),
        {} as Record<string, Yup.NumberSchema>,
      ),
    ),
  ),
});
 
// export const courseStepSchema = Yup.object({
//   golfCourseName: Yup.string().required("Please choose a golf course"),
 
//   teeOffDate: Yup.string()
//     .required("Tee-off date is required")
//     .test(
//       "not-in-past",
//       "Tee-off date can't be in the past",
//       (value) => !value || new Date(value) >= new Date(new Date().toDateString()),
//     ),
 
//   teeTime: Yup.string()
//     .required("Tee time is required")
//     .matches(/^([01]\d|2[0-3]):[0-5]\d$/, "Tee time must be in HH:mm format"),
// });
 
export const confirmStepSchema = Yup.object({
  partyName: Yup.string().required("Name is required").max(255),
 
  partyEmail: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address")
    .max(100),
 
  partyPhone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9+\-\s()]{6,20}$/, "Enter a valid phone number"),
 
  specialRequest: Yup.string().max(1000).optional(),
});
 
// Combined schema for the whole multi-step form — used on the top-level
// <Formik validationSchema={bookingSchema}>. This is what actually gates
// the final submit, so every field the API requires needs to be `.required()`
// somewhere in this chain, not just on whichever tab is visible when the
// user clicks submit.
export const bookingSchema = equipmentStepSchema
  .concat(addonsStepSchema)
  // .concat(courseStepSchema)
  .concat(confirmStepSchema);