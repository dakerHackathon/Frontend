import { useCallback } from "react";
import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";
import {
  getRankingUserId,
  mapCurrentUserRow,
  mapMyRankingResponse,
  mapRankingRowsResponse,
  mapRankingSidebarResponse,
  rankingFilterMap,
} from "../utils/ranking";

export const useRanking = () => {
  const {
    execute: fetchListExecute,
    isLoading: isListLoading,
    error: listError,
  } = useApi(API.ranking.getList);
  const {
    execute: fetchMineExecute,
    isLoading: isMineLoading,
    error: mineError,
  } = useApi(API.ranking.getMine);
  const {
    execute: fetchTop3Execute,
    isLoading: isTop3Loading,
    error: top3Error,
  } = useApi(API.ranking.getTop3);

  const fetchList = useCallback(
    async (periodKey) => {
      const filter = rankingFilterMap[periodKey] ?? "temp";

      try {
        const response = await fetchListExecute(filter);
        const ranks = response?.data?.ranks ?? [];

        return {
          ...response,
          data: {
            ...response.data,
            ranks,
            rows: mapRankingRowsResponse(ranks, filter),
          },
        };
      } catch (err) {
        return {
          isSuccess: false,
          message: err.response?.data?.message || "랭킹 목록을 불러오지 못했습니다.",
          data: { ranks: [], rows: [] },
        };
      }
    },
    [fetchListExecute],
  );

  const fetchMine = useCallback(async (periodKey) => {
    try {
      const response = await fetchMineExecute(getRankingUserId());
      const myRanking = mapMyRankingResponse(response?.data ?? {});

      return {
        ...response,
        data: {
          ...response.data,
          myRanking,
          currentUserRow: mapCurrentUserRow(myRanking, periodKey),
        },
      };
    } catch (err) {
      return {
        isSuccess: false,
        message: err.response?.data?.message || "내 랭킹 정보를 불러오지 못했습니다.",
        data: { myRanking: null, currentUserRow: null },
      };
    }
  }, [fetchMineExecute]);

  const fetchSidebar = useCallback(async (myRanking) => {
    try {
      const response = await fetchTop3Execute();

      return {
        ...response,
        data: {
          ...response.data,
          cards: mapRankingSidebarResponse(response?.data ?? {}, myRanking),
        },
      };
    } catch (err) {
      return {
        isSuccess: false,
        message: err.response?.data?.message || "랭킹 사이드바 정보를 불러오지 못했습니다.",
        data: { cards: [] },
      };
    }
  }, [fetchTop3Execute]);

  return {
    fetchList,
    fetchMine,
    fetchSidebar,
    isLoading: isListLoading || isMineLoading || isTop3Loading,
    error: listError || mineError || top3Error,
  };
};
