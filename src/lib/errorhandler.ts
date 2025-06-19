import { AxiosError } from "axios";

export const handleErrorMessage = (errorResponse: any) => {
  if (errorResponse instanceof AxiosError) {
    const errorData = errorResponse.response?.data;

    if (Object?.keys(errorData).includes("data")) {
      return errorData.message;
    }

    if (typeof errorData === "string") return errorData;

    if (Object.keys(errorData).includes("errors")) {
      const errors = errorData.errors as Record<string, string[]>[];
      return Object.values(errors)[0][0];
    }

    if (Object.keys(errorData).includes("error")) return errorData.error;

    return errorData.message;
  }
  return "Unhandled Exception: Contact the administrator";
};