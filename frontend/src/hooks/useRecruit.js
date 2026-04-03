import { useCallback } from "react";
import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";

export const useRecruit = () => {
  const { execute, isLoading, error } = useApi(API.recruit.getList);

  const fetchList = useCallback(async () => {
    try {
      return await execute();
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || "팀원 모집 목록을 불러오지 못했습니다.",
        data: { posts: [] },
      };
    }
  }, [execute]);

  return {
    fetchList,
    isLoading,
    error,
  };
};
