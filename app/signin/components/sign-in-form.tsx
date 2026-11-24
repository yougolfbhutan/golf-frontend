"use client";

import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { showToast } from "nextjs-toast-notify";
import { AlertCircle, Eye, EyeOff, Lock, Mail, UserPlus } from "lucide-react";

import { SubmitButton } from "@/custom-components/ripple-button/submit-button";
import { useAuth, type User } from "@/app/context/auth-context";
import { useLoginMutation } from "@/app/(auth)/login/tanstack-function";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type Props = {
  onSuccess: (user: User) => void;
  onSwitchToRegister?: () => void;
  /** Text on the main button, e.g. "Sign in & send bulk booking" */
  submitLabel?: string;
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

const inputBase =
  "h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4";
const inputOk =
  "border-slate-300 focus:border-[#1F4D36] focus:ring-[#1F4D36]/15";
const inputBad =
  "border-red-400 focus:border-red-500 focus:ring-red-500/15";

// NEW: Google "G" logo
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function FieldShell({
  id,
  label,
  icon: Icon,
  hasError,
  trailing,
  children,
}: {
  id: string;
  label: string;
  icon: typeof Mail;
  hasError: boolean;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <div className="relative">
        <Icon
          className={`pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 ${
            hasError ? "text-red-500" : "text-slate-400"
          }`}
          aria-hidden="true"
        />
        {children}
        {trailing}
      </div>
      <ErrorMessage name={id}>
        {(msg) => (
          <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-red-600">
            {msg}
          </p>
        )}
      </ErrorMessage>
    </div>
  );
}

export function SignInForm({
  onSuccess,
  onSwitchToRegister,
  submitLabel = "Sign in ",
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // NEW
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

async function handleGoogleSignIn() {
  setGoogleLoading(true);
  const returnTo = `${window.location.pathname}?resume=review`;
  window.location.href =
    `/auth/google/login?origin=${encodeURIComponent(window.location.origin)}` +
    `&returnTo=${encodeURIComponent(returnTo)}`;
}

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign in with your golfer account to finish your booking.
        </p>
      </div>

      <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit}>
        {({ isSubmitting, errors, touched }) => (
          <Form className="flex flex-col gap-5" noValidate>
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <FieldShell
              id="email"
              label="Email"
              icon={Mail}
              hasError={Boolean(touched.email && errors.email)}
            >
              <Field
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(touched.email && errors.email)}
                aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                className={`${inputBase} ${touched.email && errors.email ? inputBad : inputOk}`}
              />
            </FieldShell>

            <FieldShell
              id="password"
              label="Password"
              icon={Lock}
              hasError={Boolean(touched.password && errors.password)}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D36]/40"
                >
                  {showPassword ? (
                    <EyeOff className="size-[18px]" aria-hidden="true" />
                  ) : (
                    <Eye className="size-[18px]" aria-hidden="true" />
                  )}
                </button>
              }
            >
              <Field
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={Boolean(touched.password && errors.password)}
                aria-describedby={touched.password && errors.password ? "password-error" : undefined}
                className={`${inputBase} pr-12 ${
                  touched.password && errors.password ? inputBad : inputOk
                }`}
              />
            </FieldShell>

            <SubmitButton loading={isSubmitting}>{submitLabel}</SubmitButton>

            {/* NEW: Google sign-in */}
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <Separator className="flex-1" />
              <span>or</span>
              <Separator className="flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || isSubmitting}
              className="h-[52px] w-full gap-3 rounded-full border-slate-300 bg-white text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              <GoogleIcon />
              {googleLoading ? "Redirecting..." : "Continue with Google"}
            </Button>

            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <Separator className="flex-1" />
              <span>New here?</span>
              <Separator className="flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={onSwitchToRegister}
              className="h-[52px] w-full gap-2 rounded-full border-[#1F4D36]/30 text-[15px] font-semibold text-[#1F4D36] hover:bg-[#1F4D36]/5 hover:text-[#1F4D36]"
            >
              <UserPlus className="size-4" aria-hidden="true" />
              Register for a golfer ID
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}