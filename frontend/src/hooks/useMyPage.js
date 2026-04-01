import { useCallback } from "react";
import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";

export const useMyPage = () => {
  const {
    execute: executeGet,
    isLoading: isGetLoading,
    error: getError,
  } = useApi(API.mypage.get);
  const {
    execute: executeUpdate,
    isLoading: isUpdateLoading,
    error: updateError,
  } = useApi(API.mypage.update);

  const getMyPage = useCallback(
    async (userId) => {
      try {
        const result = await executeGet(userId);
        return result;
      } catch (e) {
        console.error("My page fetch error:", e);
        return {
          isSuccess: false,
          message: e.response?.data?.message || "Failed to fetch my page data.",
        };
      }
    },
    [executeGet],
  );

  const updateMyPage = useCallback(
    async (userId, data) => {
      try {
        const result = await executeUpdate(userId, data);
        return result;
      } catch (e) {
        console.error("My page update error:", e);
        return {
          isSuccess: false,
          message: e.response?.data?.message || "Failed to update my page data.",
        };
      }
    },
    [executeUpdate],
  );

  return {
    getMyPage,
    updateMyPage,
    isLoading: isGetLoading || isUpdateLoading,
    myPageError: getError || updateError,
  };
};
