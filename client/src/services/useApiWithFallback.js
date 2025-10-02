// src/services/useApiWithFallback.js
import { useState, useEffect, useCallback } from "react";

export function useApiWithFallback({ endpoint }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  const resolve = useCallback(async () => {
    if (!endpoint) return;

    setIsLoading(true);
    setIsError(false);

    try {
      const result = await endpoint();
      setIsFallback(false);
      setData(result);
    } catch (err) {
      console.error("API call failed:", err);
      setData(null);
      setIsFallback(false);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  // Only call resolve once on mount unless resolve dependencies change
  useEffect(() => {
    resolve();
  }, [resolve]);

  return { data, isLoading, isError, isFallback, resolve };
}
