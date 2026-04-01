import { useCallback } from "react";
import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";

export const useHackathon = () => {
  const getListApi = useApi(API.hackathon.getList);

  // useCallback으로 참조를 안정화해 useEffect 무한 루프를 방지한다.
  const fetchList = useCallback(async () => {
    try {
      return await getListApi.execute();
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || "해커톤 목록을 불러오지 못했습니다.",
      };
    }
  }, [getListApi.execute]);

  return {
    fetchList,
    isLoading: getListApi.isLoading,
    error: getListApi.error,
  };
};
