"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import { showToast } from "nextjs-toast-notify";

import { SubmitButton } from "@/custom-components/ripple-button/submit-button";
import { useRegisterMutation } from "@/app/(auth)/register/tanstack";
import type { RegisterAttributes } from "@/app/(auth)/interface";
import {
  registerBottomFields,
  registerInitialValues,
  registerTopFields,
} from "@/app/(auth)/data";
import { FieldList } from "@/app/(auth)/style/field-list";
import { validationRegisterSchema } from "@/app/(auth)/validation";

type Props = {
  /** Called after the account is created, to open the Sign in tab/page */
  onSwitchToSignIn: () => void;
};

const toastOpts = {
  duration: 5000,
  position: "top-right",
  transition: "topBounce",
  icon: "",
  sound: true,
} as const;

export function RegisterForm({ onSwitchToSignIn }: Props) {
  const [error, setError] = useState<string | null>(null);
  const { register } = useRegisterMutation(); // must return mutateAsync

  async function handleSubmit(values: RegisterAttributes) {
    setError(null);
    try {
      const res = await register(values);
      showToast.success(
        res?.message ?? "Account created. Please sign in.",
        toastOpts,
      );
      onSwitchToSignIn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {

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

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="font-semibold text-[#1F4D36] hover:underline"
            >
              Sign in
            </button>
          </p>
        </Form>
      )}
    </Formik>
  );
}
