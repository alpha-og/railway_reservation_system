// src/hooks/useUserId.js
import { useAuthStore } from "../store/useAuthStore";

export const useUserId = () => {
  const token = useAuthStore((state) => state.token);
  const userIdFromStore = useAuthStore((state) => state.userId);

  if (!token) return null;

  try {
    if (userIdFromStore) return userIdFromStore;

    // Decode JWT manually: header.payload.signature
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    return payload.id || null; // matches backend user id
  } catch (err) {
    console.error("Failed to decode JWT:", err);
    return null;
  }
};
