import { useCallback } from "react";
import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";

export const useMyPage = () => {
  const { execute, isLoading, error } = useApi(API.mypage.get);

  const getMyPage = useCallback(
    async (userId) => {
      try {
        const result = await execute(userId);
        return result;
      } catch (e) {
        console.error("My page fetch error:", e);
        return {
          isSuccess: false,
          message: e.response?.data?.message || "Failed to fetch my page data.",
        };
      }
    },
    [execute],
  );

  return {
    getMyPage,
    isLoading,
    myPageError: error,
  };
};
