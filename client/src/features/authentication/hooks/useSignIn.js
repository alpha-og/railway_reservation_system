import authService from "../services/signIn.js";
import { useAuthStore } from "../../../store/useAuthStore";
import { useApi } from "../../../services/useApi";
import { useRouter } from "@tanstack/react-router";

export const useSignIn = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useApi({
    endpoint: authService,
    onSuccess: (responseBody) => {
      let { token } = responseBody.data;
      let user = { id: null, roleId: null };

      try {
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        user.id = payload.userId;
        user.roleId = payload.roleId; // store roleId from JWT
      } catch (err) {
        console.error("Failed to decode JWT:", err);
      }

      setAuth(token, user.id, user.roleId);

      // redirect based on role
      if (user.roleId === "admin") {
        router.navigate({ to: "/admin" });
      } else {
        router.navigate({ to: "/dashboard" });
      }
    },
  });
};
