"use client";
import { userSignUp } from "@/app/src/services/auth/signup/sign-up";
import { Button } from "@/components/ui/button";
import { Alert } from "@heroui/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormikController from "@/custom-components/formik/formik-controller";
import OrDivider from "@/custom-components/or-divider/or-divider";
import TextCompoment from "@/custom-components/text/custom-text";

import {
  initialValues,
  RegisterFormFields,
} from "@/form-fields/register-fields";
import { validationSignUpSchema } from "@/validation-schem/register-validationschema";
import { useMutation } from "@tanstack/react-query";

import { Formik, Form, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface RegisterFormValuesAttributes {
  customer_name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface SignUpResponseAttributes {
  status: number;
}

export default function Register() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync: signUpMutate, data } = useMutation({
    mutationFn: userSignUp,
    mutationKey: ["User Registration"],
  });

  function OnSuccess() {
    router.push("login");
  }

  const onSubmit = async (
    values: RegisterFormValuesAttributes,
    { resetForm }: FormikHelpers<RegisterFormValuesAttributes>
  ) => {
   
    try {
      await signUpMutate(values);

      // ✅ Success: Clear error and reset form
      setServerError(null);
       resetForm()
      // Optional: Show success message or redirect
      // setTimeout(() => {
      //   router.push("/login");
      // }, 1500);
    } catch (err) {
      // ✅ Error: Set error message (don't reset form on error)
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setServerError(message);
    }
  };

  return (
    <div className="max-w-full bg-gray-50 min-h-screen w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full pt-16 md:flex">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-text-green flex justify-center items-center text-2xl font-bold mx-auto">
            <TextCompoment text="RG" className="text-white" />
          </div>

          <TextCompoment
            text="Create your account"
            className="text-3xl font-bold text-gray-90"
          />
          <p className="text-gray-600 mt-2">
            Join GolfBook and start booking amazing golf experiences
          </p>
        </div>
      </div>

      <div className="h-full flex justify-center mt-7">
        <Card className="rounded-sm w-[370px] md:w-[400px] h-full">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your account to access premium golf courses
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSignUpSchema}
              enableReinitialize={true}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-4">
                  {RegisterFormFields.map((field) => (
                    <FormikController
                      key={field.name}
                      fieldConfig={field}
                      className="flex flex-col"
                      inputWidthIconStyle="border w-full h-[50px] px-4 rounded-md bg-white pl-10 text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      label={field.label}
                      name={field.name || ""}
                    />
                  ))}
                  {data?.message && (
                    <Alert
                      onClose={() => OnSuccess()}
                      color="success"
                      variant="faded"
                      title="Success"
                      description={data?.message}
                      isVisible={true}
                      className="border border-green-300 bg-green-50 text-green-800 flex items-center gap-8 p-4 rounded-md"
                    />
                  )}
                  {/* ✅ Fixed: Show alert only if serverError exists */}
                  {serverError && (
                    <Alert
                      onClose={() => setServerError(null)}
                      color="danger"
                      variant="faded"
                      title="Error"
                      description={serverError}
                      isVisible={true}
                      className="border border-red-300 bg-red-50 text-red-800 flex items-center gap-8 p-4 rounded-md"
                    />
                  )}

                  <Button
                    className="mt-4 w-full h-[50px] rounded-lg text-lg bg-green-600 hover:bg-green-700 border shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <TextCompoment
                      text={isSubmitting ? "Submitting..." : "Submit"}
                      className="text-white"
                    />
                  </Button>

                  <div className="mb-5">
                    <OrDivider />
                    <div className="text-center">
                      <span className="text-gray-600">
                        Already have an account?{" "}
                      </span>
                      <button
                        onClick={() => router.push("login")}
                        className="text-green-600 hover:text-green-500 font-medium"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
