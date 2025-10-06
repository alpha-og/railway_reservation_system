import { useEffect } from "react";
import profileService from "../services/profile.service.js";
import { useApi } from "../services/useApi";
import { useRouter } from "@tanstack/react-router";
import { useAuthStore } from "../store/useAuthStore.js";

export const useProfile = () => {
  const { userId, token } = useAuthStore();
  const router = useRouter();

  const {
    data: profile,
    error,
    isSuccess,
    isLoading,
    isError,
    resolve,
  } = useApi({
    endpoint: profileService.getProfile,
    onSuccess: (responseBody) => {
      return responseBody.data.profile;
    },
  });

  useEffect(() => {
    // Only make API call if both userId and token exist
    // Add extra checks to ensure we really have valid auth data
    if (
      userId &&
      token &&
      typeof userId === "string" &&
      typeof token === "string"
    ) {
      resolve(userId);
    }
  }, [userId, token, resolve]);

  useEffect(() => {
    if (isError && token) {
      console.log(error);
      router.navigate("/signin");
    }
  }, [isError, router, error, token]);

  // Don't return profile data if not authenticated
  const isAuthenticated = Boolean(userId && token);

  return {
    profile: isAuthenticated ? profile : null,
    isSuccess: isAuthenticated ? isSuccess : false,
    isLoading: isAuthenticated ? isLoading : false,
    isError: isAuthenticated ? isError : false,
    refetch: isAuthenticated ? resolve : () => {},
  };
};
