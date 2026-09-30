import { APIURL } from "@/api/api";
import { RegisterFormValuesAttributes } from "@/app/page/auth/register/page";
import apiClient from "@/api-client/api-client";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const userSignUp = async (SignUpData: RegisterFormValuesAttributes) => {
  try {
    const response = await apiClient.post(APIURL.signUp, SignUpData);
    console.log("✅ Response from backend:", response.data);
    return response.data;
  } catch (error:unknown) {
    

    // ✅ This line extracts "Duplicate Email"
    // const errorMessage =
    //   error.response?.data?.error || "Something went wrong!";

    // console.log("🧩 Extracted error message:", errorMessage);

    // // ✅ Throw a clean Error so React Query gets it
    // throw new Error(errorMessage);
    if(axios.isAxiosError(error)){
      const errorMessage =
        error.response?.data?.error || "Something went wrong!";
      console.log("🧩 Extracted error message:", errorMessage);
      throw new Error(errorMessage);
    }

    
    throw new Error("Unexpected error occurred!");

  }
};

