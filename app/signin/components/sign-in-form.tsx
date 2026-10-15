"use client";

import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { showToast } from "nextjs-toast-notify";

import { SubmitButton } from "@/custom-components/ripple-button/submit-button";
import { useAuth, type User } from "@/app/context/auth-context";
import { useLoginMutation } from "@/app/(auth)/login/tanstack-function";

type Props = {
  onSuccess: (user: User) => void;
  onSwitchToRegister?: () => void;
};

type LoginValues = { email: string; password: string };

const initialValues: LoginValues = { email: "", password: "" };

const schema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const toastOpts = {
  duration: 5000,
  position: "top-right",
  transition: "topBounce",
  icon: "",
  sound: true,
} as const;

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1F4D36] focus:ring-2 focus:ring-[#1F4D36]/15";

export function SignInForm({ onSuccess, onSwitchToRegister }: Props) {
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const { login } = useLoginMutation();

  async function handleSubmit(values: LoginValues) {
    setError(null);
    try {
      const res = await login(values);
      const user = res?.data as User | undefined;

      if (!user?.id) throw { message: "Invalid email or password" };

      setUser(user);
      showToast.success("Signed in", toastOpts);
      onSuccess(user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.message ?? "Something went wrong";
      setError(msg);
      showToast.error(msg, toastOpts);
    }
  }

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-4" noValidate>
          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
            <Field id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputClass} />
            <ErrorMessage name="email" component="p" className="text-xs text-red-600" />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
            <Field id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" className={inputClass} />
            <ErrorMessage name="password" component="p" className="text-xs text-red-600" />
          </div>

          <SubmitButton loading={isSubmitting}>Sign in</SubmitButton>

          {onSwitchToRegister && (
            <p className="text-center text-sm text-slate-500">
              New here?{" "}
              <button type="button" onClick={onSwitchToRegister} className="font-semibold text-[#1F4D36] hover:underline">
                Create an account
              </button>
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
}