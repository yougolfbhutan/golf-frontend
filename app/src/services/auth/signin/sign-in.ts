import apiClient from "@/api-client/api-client";
import { APIURL } from "@/api/api";
import { SignInAttributes, SignInResponseAttributes } from "@/app/page/auth/login/page";
import axios from "axios";

export const userSignIn = async (
  body: SignInAttributes
): Promise<SignInResponseAttributes> => {
  try {
    const res = await apiClient.post(APIURL.signin, body);
    return res.data; // ✅ Always return the backend data only
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong!";
      throw new Error(errorMessage);
    }
    throw new Error("Unexpected error occurred!");
  }
};
