import { useCallback } from "react";
import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";

export const useTemperature = () => {
  const {
    execute: getMembersExecute,
    isLoading: isGetMembersLoading,
    error: getMembersError,
  } = useApi(API.temperature.getMembers);
  const {
    execute: voteExecute,
    isLoading: isVoteLoading,
    error: voteError,
  } = useApi(API.temperature.vote);

  const getTemperatureMembers = useCallback(
    async (userId, hackathonId) => {
      try {
        return await getMembersExecute(userId, hackathonId);
      } catch (error) {
        console.error("온도 평가 대상 조회 중 에러:", error);
        return {
          isSuccess: false,
          message: error.response?.data?.message || "온도 평가 대상을 불러오는 중 오류가 발생했습니다.",
          data: { members: [] },
        };
      }
    },
    [getMembersExecute],
  );

  const submitTemperatureVote = useCallback(
    async (userId, hackathonId, data) => {
      try {
        return await voteExecute(userId, hackathonId, data);
      } catch (error) {
        console.error("온도 평가 제출 중 에러:", error);
        return {
          isSuccess: false,
          message: error.response?.data?.message || "온도 평가 제출 중 오류가 발생했습니다.",
        };
      }
    },
    [voteExecute],
  );

  return {
    getTemperatureMembers,
    submitTemperatureVote,
    isLoading: isGetMembersLoading || isVoteLoading,
    temperatureError: getMembersError || voteError,
  };
};
