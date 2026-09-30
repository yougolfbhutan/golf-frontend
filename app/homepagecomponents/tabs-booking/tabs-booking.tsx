// "use client";

// import * as React from "react";
// import { Check } from "lucide-react";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { cn } from "@/lib/utils";
// import type { GolfSet } from "./tabs-component/golf-equiment/interface";
// import { STEPS } from "./data";
// import { EquipmentStepContent } from "./tabs-component/golf-equiment/golf-equiment";
// import { showToast } from "nextjs-toast-notify";

// import { bookingSchema } from "./booking-schema/booking-schema";
// import { Form, Formik, type FormikProps } from "formik";
// import AccessoriesGrid from "./tabs-component/golf-addons/golf-addons";
// import BookingDetailsStep from "./tabs-component/booking-confirmation/booking-confirmation";
// import ChooseGolfCourse from "./tabs-component/golf-course/golf-course";
// import {
//   INITIAL_BOOKING_VALUES,
//   type BookingFormValues,
// } from "./booking-form-values";
// import { useCreatBookingMutations } from "./tabs-component/tanstack-function";

// export interface GolfBookingEquipmentStepProps {
//   className?: string;
//   defaultValue?: string;
//   sets?: GolfSet[];
//   onNext?: () => void;
// }

// function isCourseStepComplete(values: BookingFormValues) {
//   return Boolean(values.golfCourseName);
// }

// function isEquipmentStepComplete(values: BookingFormValues) {
//   return Boolean(values.carrySetId);
// }

// export default function GolfBookingEquipmentStep({
//   className,
//   defaultValue = "course",
// }: GolfBookingEquipmentStepProps) {
//   const [activeTab, setActiveTab] = React.useState(defaultValue);
//   const formikRef = React.useRef<FormikProps<BookingFormValues>>(null);

//   const backStep = () => {
//     const currentIndex = STEPS.findIndex((s) => s.value === activeTab);
//     const back = STEPS[currentIndex - 1];
//     if (back) setActiveTab(back.value);
//   };

//   const { createBook, isCreating } = useCreatBookingMutations({
//     onSuccess: (data) => {
//       showToast.success(data.message, {
//         duration: 5000,
//         position: "top-right",
//         transition: "topBounce",
//         icon: "",
//         sound: true,
//       });
//       formikRef.current?.resetForm();
//       setActiveTab(STEPS[0].value);
//     },
//     onError: (error) => {
//       showToast.error(error?.data?.message, {
//         duration: 5000,
//         position: "top-right",
//         transition: "topBounce",
//         icon: "",
//         sound: true,
//       });
//     },
//   });

//   const onSubmit = async (values: BookingFormValues) => {
//     createBook(values);
//   };

//   return (
//     <div className={cn("mx-auto mt-10 w-full max-w-5xl", className)}>
//       <div className="mb-8 text-center">
//         <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
//           Step-by-step booking
//         </p>
//         <h1 className="mt-2 font-serif text-4xl text-emerald-950">
//           Book Your Golf Experience
//         </h1>
//         <p className="mt-2 text-sm text-emerald-900/70">
//           Complimentary tee-time booking included for all tourists{" "}
//           <Check className="inline h-3.5 w-3.5 text-amber-600" />
//         </p>
//         <div className="mx-auto mt-3 h-0.5 w-10 bg-amber-400" />
//       </div>

//       <Formik<BookingFormValues>
//         innerRef={formikRef}
//         initialValues={INITIAL_BOOKING_VALUES}
//         validationSchema={bookingSchema}
//         validateOnMount={false}
//         onSubmit={onSubmit}
//       >
//         {({ values }) => {
//           const courseDone = isCourseStepComplete(values);
//           const equipmentDone = isEquipmentStepComplete(values);
//           const confirmDisabled = !courseDone || !equipmentDone;

//           const warnBlocked = () => {
//             const missing = [
//               !courseDone && "Course",
//               !equipmentDone && "Golf Set",
//             ]
//               .filter(Boolean)
//               .join(" and ");
//             showToast.warning(`Please select your ${missing} before continuing`, {
//               duration: 4000,
//               position: "top-right",
//               transition: "topBounce",
//             });
//           };

//           // Central guard: EVERY navigation to "confirm" goes through here,
//           // whether triggered by clicking the tab or by a "Next" button.
//           const goTo = (value: string) => {
//             if (value === "confirm" && confirmDisabled) {
//               warnBlocked();
//               return;
//             }
//             setActiveTab(value);
//           };

//           const goToNextStep = () => {
//             const currentIndex = STEPS.findIndex((s) => s.value === activeTab);
//             const next = STEPS[currentIndex + 1];
//             if (next) goTo(next.value);
//           };

//           return (
//             <Form onSubmit={(e) => e.preventDefault()}>
//               <Tabs value={activeTab} onValueChange={goTo}>
//                 <TabsList
//                   className="grid min-h-20 w-full grid-cols-3 gap-px overflow-hidden rounded-xl rounded-b-none border bg-border p-0 sm:grid-cols-6"
//                   style={{
//                     gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))`,
//                   }}
//                 >
//                   {STEPS.map((step) => {
//                     const isConfirmStep = step.value === "confirm";
//                     const disabled = isConfirmStep && confirmDisabled;

//                     return (
//                       <TabsTrigger
//                         key={step.value}
//                         value={step.value}
//                         disabled={disabled}
//                         className={cn(
//                           "flex h-full min-w-0 flex-col items-center gap-1.5 rounded-none bg-card px-2 text-center",
//                           "data-[state=active]:bg-emerald-950 data-[state=active]:shadow-none",
//                           disabled && "cursor-not-allowed opacity-40"
//                         )}
//                       >
//                         <span
//                           className={cn(
//                             "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground",
//                             "[[data-state=active]_&]:bg-amber-400 [[data-state=active]_&]:text-emerald-950"
//                           )}
//                         >
//                           {step.number}
//                         </span>
//                         <span
//                           className={cn(
//                             "w-full break-words text-[11px] font-semibold uppercase leading-tight tracking-wide text-muted-foreground",
//                             "[[data-state=active]_&]:text-amber-50"
//                           )}
//                         >
//                           {step.label}
//                         </span>
//                       </TabsTrigger>
//                     );
//                   })}
//                 </TabsList>

//                 <div className="rounded-b-xl p-0">
//                   <TabsContent value="course" className="mt-6 py-6">
//                     <ChooseGolfCourse onNext={goToNextStep} onBack={backStep} />
//                   </TabsContent>
//                   <TabsContent value="equipment" className="mt-6 space-y-0 px-0">
//                     <EquipmentStepContent onNext={goToNextStep} />
//                   </TabsContent>
//                   <TabsContent value="addons" className="mt-6 py-4">
//                     <AccessoriesGrid onNext={goToNextStep} onBack={backStep} />
//                   </TabsContent>
//                   <TabsContent value="confirm" className="mt-6">
//                     <BookingDetailsStep isPending={isCreating} />
//                   </TabsContent>
//                 </div>
//               </Tabs>
//             </Form>
//           );
//         }}
//       </Formik>
//     </div>
//   );
// }