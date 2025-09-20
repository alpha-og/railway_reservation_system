// src/services/useApiWithFallback.js
import { useState, useEffect, useCallback } from "react";

export function useApiWithFallback({ endpoint, fallbackData }) {
  const [data, setData] = useState(fallbackData || null);
  const [isLoading, setIsLoading] = useState(!fallbackData);
  const [isError, setIsError] = useState(false);
  const [isFallback, setIsFallback] = useState(!!fallbackData); // auto true if fallback exists

  const resolve = useCallback(async () => {
    if (!endpoint) return;

    setIsLoading(true);
    setIsError(false);

    try {
      const result = await endpoint();
      // If result matches fallbackData, mark as fallback
      if (fallbackData && result === fallbackData) {
        setIsFallback(true);
      } else {
        setIsFallback(false);
      }
      setData(result);
    } catch (err) {
      console.error("API call failed:", err);
      setData(fallbackData || null);
      setIsFallback(!!fallbackData);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, fallbackData]);

  // Auto-fetch on mount
  useEffect(() => {
    resolve();
  }, [resolve]);

  return { data, isLoading, isError, isFallback, resolve };
}
