import { useState } from "react";

/**
 * Custom API hook with fallback support
 */
export const useApi = ({
  endpoint = async () => {},
  onSuccess = () => {},
  onError = () => {},
  fallbackData = null,
} = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFallback, setIsFallback] = useState(Boolean(fallbackData));
  const [error, setError] = useState(null);
  const [data, setData] = useState(fallbackData);

  const resolve = async (body) => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setError(null);

    try {
      const responseBody = await endpoint(body);
      setData(responseBody);
      setIsSuccess(true);
      setIsFallback(false);
      if (onSuccess) onSuccess(responseBody);
    } catch (err) {
      setData(fallbackData);
      setIsError(true);
      setIsFallback(true);
      setError(err);

      // Log warning only once per session
      const logKey =
        "__useApiFallbackLogged_" +
        (fallbackData ? JSON.stringify(fallbackData).slice(0, 10) : "default");
      if (!window[logKey]) {
        console.warn(
          `⚠️ API call failed: ${err.message}. Using fallback data.`
        );
        window[logKey] = true;
      }

      if (onError) onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { resolve, isLoading, isError, isSuccess, isFallback, error, data };
};
