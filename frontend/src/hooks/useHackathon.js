import { useCallback } from "react";
import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";

export const useHackathon = () => {
  const { execute, isLoading, error } = useApi(API.hackathon.getList);

  // useCallback으로 참조를 안정화해 useEffect 무한 루프를 방지한다.
  const fetchList = useCallback(async () => {
    try {
      return await execute();
    } catch (err) {
      return {
        isSuccess: false,
        message: err.response?.data?.message || "해커톤 목록을 불러오지 못했습니다.",
      };
    }
  }, [execute]);

  return {
    fetchList,
    isLoading,
    error,
  };
};
