import roleService from "../services/role.service.js";
import { useApi } from "../services/useApi";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";

export const useRole = (id) => {
  const { token } = useAuthStore();
  
  const handleSuccess = (responseBody) => {
    return responseBody.data;
  };

  const {
    data: role,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: roleService.getRole,
    onSuccess: handleSuccess,
  });

  useEffect(() => {
    if (id && token) {
      resolve(id);
    }
  }, [id, token, resolve]);

  // Don't return role data if not authenticated
  const shouldShowRole = id && token;

  return { 
    role: shouldShowRole ? role : null, 
    isSuccess: shouldShowRole ? isSuccess : false, 
    isLoading: shouldShowRole ? isLoading : false, 
    isError: shouldShowRole ? isError : false, 
    isFallback: shouldShowRole ? isFallback : false 
  };
};
