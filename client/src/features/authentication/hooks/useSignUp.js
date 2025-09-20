import authService from "../services/signUp";
import { useApi } from "../../../services/useApi";
import { useRouter } from "@tanstack/react-router";

export const useSignUp = () => {
  const router = useRouter();

  return useApi({
    endpoint: authService,
    onSuccess: (responseBody) => {
      console.log("SignUp successful:", responseBody);
      router.navigate({ to: "/signin" });
    },
  });
};
