import { useState, useCallback, useRef, useEffect } from "react";

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

  // Use refs to store the latest versions of the functions
  const endpointRef = useRef(endpoint);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const fallbackDataRef = useRef(fallbackData);

  // Update refs when props change
  useEffect(() => {
    endpointRef.current = endpoint;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    fallbackDataRef.current = fallbackData;
  });

  const resolve = useCallback(
    async (body) => {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);
      setError(null);
      try {
        const responseBody = await endpointRef.current(body);
        const processedResponseBody = onSuccessRef.current
          ? onSuccessRef.current(responseBody)
          : responseBody;
        setData(processedResponseBody);
        setIsSuccess(true);
        setIsFallback(false);
      } catch (err) {
        setData(fallbackDataRef.current);
        setIsError(true);
        setIsFallback(true);
        setError(err);
        // Log warning only once per session
        const logKey =
          "__useApiFallbackLogged_" +
          (fallbackDataRef.current
            ? JSON.stringify(fallbackDataRef.current).slice(0, 10)
            : "default");
        if (!window[logKey]) {
          console.warn(
            `⚠️ API call failed: ${err.message}. Using fallback data.`,
          );
          window[logKey] = true;
        }
        if (onErrorRef.current) onErrorRef.current(err);
      } finally {
        setIsLoading(false);
      }
    },
    [], // Empty dependency array since we're using refs
  );

  return { resolve, isLoading, isError, isSuccess, isFallback, error, data };
};
