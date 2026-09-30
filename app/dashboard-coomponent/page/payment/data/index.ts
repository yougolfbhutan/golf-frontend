import type { FieldConfig } from "@/custom-components/dynamic-array";
import * as Yup from "yup";

export const TopPaymentFieldsForms: FieldConfig[] = [
  {
    name: "paymentAmount",
    label: "Amount",
    type: "number",
    disabled: true,
  },
 
  {
    name: "PaymentMethod",
    label: "Payment Mode",
    type: "text", // ← new field
    // disabled: true,
  },
   {
    name: "paymentDate",
    label: "Payment Date",
    type: "date",
    validation: Yup.date().required("Payment Date is required"),
  },


  {
    name: "journalNumber",
    label: "Journal Number",
    type: "text",
    validation: Yup.string().required("Journal Number is required"),
  },
    {
    name: "referenceNumber",
    label: "Reference Number",
    type: "text",
    validation: Yup.string().required("Reference Number is required"),
  },
    {
    name: "description",
    label: "Description",
    type: "textarea", // ← new field
    validation: Yup.string().required("Description is required"),
  },
];
