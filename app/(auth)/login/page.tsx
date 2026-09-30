/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
// import { formloginFields, initialValues } from "../data";
import { Form, Formik } from "formik";
import { useState, useEffect } from "react";
import { useLoginMutation } from "./tanstack-function";
import { showToast } from "nextjs-toast-notify";
import type { SignInAttributes } from "./interface";
import FormikController from "@/custom-components/formik-controller";
import { RippleWaveButton } from "@/custom-components/ripple-button/ripple-button";
import { validationSignSchema } from "./validation";
import { formloginFields, initialValues } from "./data";

// Mock WaveBackground component - replace with actual import if available
const WaveBackground = () => <div className="absolute inset-0 opacity-10" />;

export default function Login() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const { login } = useLoginMutation({
    onSuccess: (data) => {
      showToast.success(data.message, {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
      console.log("data",data.data.accessToken)
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
       window.dispatchEvent(new Event("auth-changed"));
      
      // ✅ Small delay to ensure auth context updates before navigation
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    },
    onError: (error) => {
      showToast.error(error?.data?.message, {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
    },
  });
  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsLoaded(true), 100);
  }, []);
  const handleSubmit = (values: Record<string, any>) => {
    login(values as SignInAttributes);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-orange-50 via-gray-50 to-orange-100 flex flex-col items-center justify-center relative py-10">
      <WaveBackground />

      <div
        className={`bg-white rounded-2xl shadow-none p-8 max-w-md w-full relative z-10 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* <AuthLogoHeader
          Title="Sign In"
          subTitle="Welcome back! Please sign in to your account"
        /> */}

        <div className="flex justify-center mb-9">
          <Card className="w-[360px] border-none shadow-none">
            <CardHeader>
              <CardTitle className="font-(--font-poppins) text-center">
                Sign In
              </CardTitle>
              <CardDescription className="text-center text-sm font-(--font-inter)">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSignSchema}
                onSubmit={handleSubmit}
              >
                {() => (
                  <Form className="flex flex-col gap-4">
                    {formloginFields.map((field, index) => (
                      <FormikController
                        key={field.name ?? index}
                        fieldConfig={field}
                        className="flex flex-col"
                        inputWidthIconStyle="pl-10 w-full p-2 border border-gray-200 shadow-sm rounded-md focus:outline-none"
                        label={field.label}
                        name={field.name}
                      />
                    ))}

                    <div className="flex flex-row justify-between">
                      <button
                        type="button"
                        className="text-orange-500 font-medium"
                        onClick={() => router.push("forgot-password")}
                      >
                        <span className="text-sm">Forgot Password?</span>
                      </button>
                    </div>

                    <RippleWaveButton
                      type="submit"
                      variant="default"
                      enableWave
                      enableRipple
                      className="mt-4 w-full h-[50px] rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                    >
                      Sign In
                    </RippleWaveButton>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
