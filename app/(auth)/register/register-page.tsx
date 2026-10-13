"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import { SubmitButton } from "@/custom-components/ripple-button/submit-button";
import { registerInitialValues, registerTopFields, registerBottomFields } from "../data";
import type { RegisterAttributes } from "../interface";
import { validationRegisterSchema } from "../validation";
import { FieldList } from "../style/field-list";
import { useRegisterMutation } from "./tanstack";
import { useLoginMutation } from "../login/tanstack-function";
import { showToast } from "nextjs-toast-notify";
import { useAuth, type User } from "@/app/context/auth-context";

type Props = {
  onSuccess: (user: User) => void;
};

const toastOpts = {
  duration: 5000,
  position: "top-right",
  transition: "topBounce",
  icon: "",
  sound: true,
} as const;

export function RegisterForm({ onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const { register } = useRegisterMutation(); // must return mutateAsync
  const { login } = useLoginMutation();

  async function handleSubmit(values: RegisterAttributes) {
    setError(null);
    try {
      const regRes = await register(values);
      let user = regRes as User | undefined;

      // If register doesn't log the user in, log in now
      if (!user?.id) {
        const loginRes = await login({
          email: values.email,
          password: values.password,
        });
        user = loginRes?.data as User | undefined;
      }

      if (!user?.id) {
        throw { message: "Account created. Please sign in." };
      }

      setUser(user);
      showToast.success( "Account created", toastOpts);
      onSuccess(user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.message ?? "Something went wrong";
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
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <FieldList fields={registerTopFields} />
          <FieldList fields={registerBottomFields} />

          <SubmitButton loading={isSubmitting}>Create account and confirm booking</SubmitButton>
          <p className="text-[12.5px] text-muted-foreground">
            Your golfer ID works at all four courses.
          </p>
        </Form>
      )}
    </Formik>
  );
}