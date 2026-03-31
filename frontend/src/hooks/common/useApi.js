import { useState, useCallback } from "react";

export const useApi = (apiFunction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...params) => {
      setIsLoading(true);
      setError(null);
      try {
        //axios가 아닌 함수도 사용 가능
        const response = await apiFunction(...params);
        return response;
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction],
  );

  return { isLoading, error, execute };
};
