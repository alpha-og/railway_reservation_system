// src/services/useApiWithFallback.js
import { useState, useEffect, useCallback, useMemo } from "react";

export function useApiWithFallback({ endpoint, fallbackData }) {
  const [data, setData] = useState(fallbackData || null);
  const [isLoading, setIsLoading] = useState(!fallbackData);
  const [isError, setIsError] = useState(false);
  const [isFallback, setIsFallback] = useState(!!fallbackData);

  // Memoize fallback data to prevent unnecessary changes
  const memoizedFallbackData = useMemo(() => fallbackData, [fallbackData]);

  const resolve = useCallback(async () => {
    if (!endpoint) return;

    setIsLoading(true);
    setIsError(false);

    try {
      const result = await endpoint();
      // If result matches fallbackData, mark as fallback
      if (memoizedFallbackData && result === memoizedFallbackData) {
        setIsFallback(true);
      } else {
        setIsFallback(false);
      }
      setData(result);
    } catch (err) {
      console.error("API call failed:", err);
      setData(memoizedFallbackData || null);
      setIsFallback(!!memoizedFallbackData);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, memoizedFallbackData]);

  // Only call resolve once on mount unless resolve dependencies change
  useEffect(() => {
    resolve();
  }, [resolve]);

  return { data, isLoading, isError, isFallback, resolve };
}
