import { useCallback } from "react";
import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";
import {
  applyHackathonFavoriteOverride,
  applyHackathonFavoriteOverrides,
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
  const {
    execute: uploadSubmissionExecute,
    isLoading: isUploadLoading,
    error: uploadError,
  } = useApi(API.hackathon.uploadSubmission);

  // useCallback으로 참조를 안정화해 useEffect 무한 루프를 방지한다.
  const fetchList = useCallback(async () => {
    const userId = getHackathonUserId();

    try {
      const response = await fetchListExecute(userId);
      const hackathons = applyHackathonFavoriteOverrides(response?.data?.hackathons ?? [], userId);

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
      const userId = getHackathonUserId();

      try {
        const response = await fetchDetailExecute(userId, hackathonId);
        const detail = applyHackathonFavoriteOverride(response.data, userId);

        return {
          ...response,
          data: {
            ...detail,
            detailView: mapHackathonDetailResponse({
              detail,
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

  const uploadSubmission = useCallback(
    async (hackathonId, memo, userId = getHackathonUserId()) => {
      try {
        return await uploadSubmissionExecute(userId, hackathonId, { memo });
      } catch (err) {
        return {
          isSuccess: false,
          message: err.response?.data?.message || "제출 링크를 불러오지 못했습니다.",
          data: null,
        };
      }
    },
    [uploadSubmissionExecute],
  );

  return {
    fetchList,
    fetchDetail,
    toggleSave,
    uploadSubmission,
    isLoading: isListLoading || isDetailLoading,
    isSaveLoading,
    isUploadLoading,
    error: listError || detailError || saveError || uploadError,
  };
};
