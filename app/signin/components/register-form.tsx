"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import { showToast } from "nextjs-toast-notify";

import { SubmitButton } from "@/custom-components/ripple-button/submit-button";
import { useAuth, type User } from "@/app/context/auth-context";
import { useRegisterMutation } from "@/app/(auth)/register/tanstack";
import { useLoginMutation } from "@/app/(auth)/login/tanstack-function";
import type { RegisterAttributes } from "@/app/(auth)/interface";
import { registerBottomFields, registerInitialValues, registerTopFields } from "@/app/(auth)/data";
import { FieldList } from "@/app/(auth)/style/field-list";
import { validationRegisterSchema } from "@/app/(auth)/validation";



type Props = {
  onSuccess: (user: User) => void;
  onSwitchToSignIn?: () => void;
};

const toastOpts = {
  duration: 5000,
  position: "top-right",
  transition: "topBounce",
  icon: "",
  sound: true,
} as const;

export function RegisterForm({ onSuccess, onSwitchToSignIn }: Props) {
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const { register } = useRegisterMutation();
  const { login } = useLoginMutation();

  async function handleSubmit(values: RegisterAttributes) {
    setError(null);
    try {
      let user = (await register(values)) as User | undefined;

      // Log in automatically if register doesn't return a user
      if (!user?.id) {
        const res = await login({ email: values.email, password: values.password });
        user = res?.data as User | undefined;
      }

      if (!user?.id) {
        showToast.success("Account created. Please sign in.", toastOpts);
        onSwitchToSignIn?.();
        return;
      }

      setUser(user);
      showToast.success("Account created", toastOpts);
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

          <SubmitButton loading={isSubmitting}>Create account</SubmitButton>

          {onSwitchToSignIn && (
            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button type="button" onClick={onSwitchToSignIn} className="font-semibold text-[#1F4D36] hover:underline">
                Sign in
              </button>
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
}