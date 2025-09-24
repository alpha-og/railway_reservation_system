import roleService from "../services/role.service.js";
import { useApi } from "../services/useApi";
import { useEffect } from "react";

export const useRole = (id) => {
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
    fallbackData: "customer",
  });

  useEffect(() => {
    if (id) {
      resolve(id);
    }
  }, [id, resolve]);

  return { role, isSuccess, isLoading, isError, isFallback };
};
