import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";

export const useHackathon = () => {
  const getListApi = useApi(API.hackathon.getList);

  // 해커톤 목록을 불러온다.
  const fetchList = async () => {
    try {
      return await getListApi.execute();
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || "해커톤 목록을 불러오지 못했습니다.",
      };
    }
  };

  return {
    fetchList,
    isLoading: getListApi.isLoading,
    error: getListApi.error,
  };
};
