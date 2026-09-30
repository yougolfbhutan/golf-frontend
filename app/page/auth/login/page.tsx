"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormikController from "@/custom-components/formik/formik-controller";
import { formloginFields, initialValues } from "@/form-fields/login-fields";
import { validationSignSchema } from "@/validation-schem/register-validationschema";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik, FormikHelpers } from "formik";
import { Checkbox } from "@/components/ui/checkbox";
import TextCompoment from "@/custom-components/text/custom-text";
import OrDivider from "@/custom-components/or-divider/or-divider";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { userSignIn } from "@/app/src/services/auth/signin/sign-in";
import { Alert } from "@heroui/alert";

export interface SignInResponseAttributes {
  status: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface SignInAttributes {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();

  const { mutateAsync: userSign, data } = useMutation({
    mutationFn: userSignIn,
    mutationKey: ["User Login"],
  });

  function OnSuccess() {
    router.push("/");
  }
  const onSubmit = async (
    values: SignInAttributes,
    { resetForm }: FormikHelpers<SignInAttributes>
  ) => {
    console.log("Submitting values:", values);
    try {
      const response = await userSign(values);
      console.log("Login success:", response);

      // Store token in localStorage (optional)
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      resetForm();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <div className="h-full">
      <div className="text-center flex justify-center items-center flex-col">
        <div className="w-16 h-16 rounded-full bg-text-green flex justify-center items-center text-2xl font-bold mx-auto mt-10">
          <span className="text-white">RG</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-5">Welcome back</h1>
        <p className="mt-2 text-gray-600">Sign in to your GolfBook account</p>
      </div>

      <div className="h-full flex justify-center mt-10">
        <Card className="rounded-sm w-[360px] h-full">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSignSchema}
              onSubmit={onSubmit}
            >
              {() => (
                <Form className="flex flex-col gap-4">
                  {formloginFields.map((field, index) => (
                    <FormikController
                      key={field.name ?? index}
                      fieldConfig={field}
                      className="flex flex-col"
                      inputWidthIconStyle="pl-10 w-full p-2 border rounded-md  focus:outline-none"
                      label={field.label}
                      name={field.name}
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
                  <div className="flex flex-row justify-between">
                    <div className="text-center flex items-center gap-4">
                      <Checkbox />
                      <span className="text-sm text-gray-900">Remember Me</span>
                    </div>
                    <button
                      type="button"
                      className="text-green-600 hover:text-green-500"
                      onClick={() => router.push("forgot-password")}
                    >
                      <TextCompoment
                        text="Forgot your password?"
                        className="text-sm"
                      />
                    </button>
                  </div>

                  <Button
                    className="mt-4 w-full h-[50px] rounded-lg text-lg bg-green-600 hover:bg-green-700  border shadow-md hover:shadow-lg transition"
                    type="submit"
                  >
                    <TextCompoment text="Login" className="text-white" />
                  </Button>
                  <div className="text-center">
                    <span className="text-gray-600">
                      Don&apos;t have an account?{" "}
                    </span>
                    <button
                      onClick={() => router.push("register")}
                      className="text-green-600 hover:text-green-500 font-medium"
                    >
                      Sign up
                    </button>
                  </div>

                  <OrDivider />
                  <Button
                    type="submit"
                    className=" mt-0 flex w-[300px] h-[50px] items-center justify-center space-x-3 rounded-lg border bg-white text-gray-700 shadow-md hover:bg-gray-100 hover:shadow-lg transition"
                  >
                    <FcGoogle size={28} />
                    <span className="text-base font-medium">
                      Sign in with Google
                    </span>
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
