import { useEffect } from "react";
import profileService from "../services/profile.service.js";
import { useApi } from "../services/useApi";
import { useRouter } from "@tanstack/react-router";
import { useAuthStore } from "../store/useAuthStore.js";

export const useProfile = () => {
  const { userId } = useAuthStore();
  const router = useRouter();
  const {
    data: profile,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: profileService.getProfile,
    onSuccess: (responseBody) => {
      return responseBody.data.profile;
    },
    fallbackData: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123456789",
    },
  });

  useEffect(() => {
    if (userId) {
      resolve(userId);
    }
  }, [userId, resolve]);

  useEffect(() => {
    if (isError) {
      console.log(error);
      router.navigate("/signin");
    }
  }, [isError, router, error]);

  return { profile, isSuccess, isLoading, isError, isFallback };
};
