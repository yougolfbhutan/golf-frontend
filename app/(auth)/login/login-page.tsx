"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { validationSignSchema } from "./validation";
import type { SignInAttributes } from "./interface";
import { formloginFields, signInInitialValues } from "../data";
import { FieldList } from "../style/field-list";
import { SubmitButton } from "@/custom-components/ripple-button/submit-button";
import { useLoginMutation } from "./tanstack-function";
import { showToast } from "nextjs-toast-notify";
import { useAuth, type User } from "@/app/context/auth-context";
import { GoogleButton } from "@/custom-components/google-button/google-button";

type Props = {
  onSuccess: (user: User) => void;
  onSwitchToRegister: () => void;
};

const toastOpts = {
  duration: 5000,
  position: "top-right",
  transition: "topBounce",
  icon: "",
  sound: true,
} as const;

export function SignInForm({ onSuccess, onSwitchToRegister }: Props) {
  const [error, setError] = useState<string | null>(null);
  const { refreshAuth } = useAuth();
  const { login } = useLoginMutation(); // returns mutateAsync

  async function handleSubmit(values: SignInAttributes) {
   setError(null);
  try {
    const res = await login(values);
    const raw = res?.data;

    if (!raw?.id) throw { message: "Invalid email or password" };

    // Keep only what the app needs (never pass the password hash around)
    const user: User = {
      id: String(raw.id),
      email:raw.email,
      name: raw.name ?? raw.email?.split("@")[0] ?? "Guest",
      roles: [],
      phone_no:raw.phone_no,
      permissions: [],
            is_verified:raw.is_verified

    };

    await refreshAuth(); // refetches the profile so the navbar updates
    showToast.success("Signed in", toastOpts);
    onSuccess(user);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const msg = err?.message ?? "Something went wrong";
    setError(msg);
    showToast.error(msg, toastOpts);
  }
  }

  // inside SignInForm
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    const returnTo = `${window.location.pathname}?resume=review`;
    window.location.href =
      `/api/auth/google/login?origin=${encodeURIComponent(window.location.origin)}` +
      `&returnTo=${encodeURIComponent(returnTo)}`;
  }

  return (
    <Formik
      initialValues={signInInitialValues}
      validationSchema={validationSignSchema}
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

          <FieldList fields={formloginFields} />

          <SubmitButton loading={isSubmitting}>
            Sign in and confirm booking
          </SubmitButton>
          <GoogleButton onClick={handleGoogleSignIn} loading={googleLoading} />

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Separator className="flex-1" /> new here?{" "}
            <Separator className="flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onSwitchToRegister}
            className="h-[52px] w-full rounded-full text-[15px] font-semibold"
          >
            Register for a golfer ID
          </Button>
        </Form>
      )}
    </Formik>
  );
}
