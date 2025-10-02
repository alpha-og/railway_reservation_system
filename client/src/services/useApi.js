import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Custom API hook for managing async operations
 */
export const useApi = ({
  endpoint = async () => {},
  onSuccess = () => {},
  onError = () => {},
} = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Use refs to store the latest versions of the functions
  const endpointRef = useRef(endpoint);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // Update refs when props change
  useEffect(() => {
    endpointRef.current = endpoint;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
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
      } catch (err) {
        setData(null);
        setIsError(true);
        setError(err);
        if (onErrorRef.current) onErrorRef.current(err);
      } finally {
        setIsLoading(false);
      }
    },
    [], // Empty dependency array since we're using refs
  );

  return { resolve, isLoading, isError, isSuccess, error, data };
};
