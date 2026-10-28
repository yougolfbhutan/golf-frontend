"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import { SubmitButton } from "@/custom-components/ripple-button/submit-button";
import {
  registerInitialValues,
  registerTopFields,
  registerBottomFields,
} from "../data";
import type { RegisterAttributes } from "../interface";
import { validationRegisterSchema } from "../validation";
import { FieldList } from "../style/field-list";
import { useRegisterMutation } from "./tanstack";
import { showToast } from "nextjs-toast-notify";

type Props = {
  /** Called after the account is created. The modal uses it to open the Sign in tab */
  onRegistered: () => void;
};

const toastOpts = {
  duration: 5000,
  position: "top-right",
  transition: "topBounce",
  icon: "",
  sound: true,
} as const;

export function RegisterForm({ onRegistered }: Props) {
  const [error, setError] = useState<string | null>(null);
  const { register } = useRegisterMutation();
  async function handleSubmit(values: RegisterAttributes) {
    console.log('values',values)
    setError(null);
    try {
      const res = await register(values);

      showToast.success(
        res?.message ?? "Account created. Please sign in.",
        toastOpts,
      );
      onRegistered(); // switch to the Sign in tab
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.response?.data); // see what the backend actually says
      const msg = err?.response?.data?.message;
      setError(msg);
      showToast.error(msg, toastOpts);
    }
  }

  return (
    <Formik
      initialValues={registerInitialValues}
      validationSchema={validationRegisterSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-4" noValidate>
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
            >
              {error}
            </p>
          )}

          <FieldList fields={registerTopFields} />
          <FieldList fields={registerBottomFields} />

          <SubmitButton loading={isSubmitting}>Create account</SubmitButton>
          <p className="text-[12.5px] text-muted-foreground">
            Your golfer ID works at all four courses.
          </p>
        </Form>
      )}
    </Formik>
  );
}
