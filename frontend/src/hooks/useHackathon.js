import { useCallback } from "react";
import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";
import {
  getHackathonUserId,
  mapHackathonDetailResponse,
  mapHackathonListResponse,
} from "../utils/hackathon";

export const useHackathon = () => {
  const {
    execute: fetchListExecute,
    isLoading: isListLoading,
    error: listError,
  } = useApi(API.hackathon.getList);
  const {
    execute: fetchDetailExecute,
    isLoading: isDetailLoading,
    error: detailError,
  } = useApi(API.hackathon.getDetail);
  const {
    execute: toggleSaveExecute,
    isLoading: isSaveLoading,
    error: saveError,
  } = useApi(API.hackathon.toggleSave);

  // useCallback으로 참조를 안정화해 useEffect 무한 루프를 방지한다.
  const fetchList = useCallback(async () => {
    try {
      const response = await fetchListExecute();
      const hackathons = response?.data?.hackathons ?? [];

      return {
        ...response,
        data: {
          ...response.data,
          hackathons,
          items: mapHackathonListResponse(hackathons),
        },
      };
    } catch (err) {
      return {
        isSuccess: false,
        message: err.response?.data?.message || "해커톤 목록을 불러오지 못했습니다.",
        data: { hackathons: [], items: [] },
      };
    }
  }, [fetchListExecute]);

  const fetchDetail = useCallback(
    async (hackathonId, summaryItem) => {
      try {
        const response = await fetchDetailExecute(hackathonId);

        return {
          ...response,
          data: {
            ...response.data,
            detailView: mapHackathonDetailResponse({
              detail: response.data,
              summary: summaryItem,
            }),
          },
        };
      } catch (err) {
        return {
          isSuccess: false,
          message: err.response?.data?.message || "해커톤 상세 정보를 불러오지 못했습니다.",
          data: null,
        };
      }
    },
    [fetchDetailExecute],
  );

  const toggleSave = useCallback(
    async (hackathonId, userId = getHackathonUserId()) => {
      try {
        return await toggleSaveExecute(userId, hackathonId);
      } catch (err) {
        return {
          isSuccess: false,
          message: err.response?.data?.message || "해커톤 저장 상태를 변경하지 못했습니다.",
        };
      }
    },
    [toggleSaveExecute],
  );

  return {
    fetchList,
    fetchDetail,
    toggleSave,
    isLoading: isListLoading || isDetailLoading,
    isSaveLoading,
    error: listError || detailError || saveError,
  };
};
