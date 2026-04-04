import { useCallback, useState } from "react";
import { API } from "../api/api_registry";
import {
  buildRecruitCreatePayload,
  getRecruitUserId,
  mapRecruitArticlesResponse,
  recruitSearchFilterMap,
} from "../utils/recruit";

export const useRecruit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchList = useCallback(async ({ open, position } = {}) => {
    const userId = getRecruitUserId();

    setIsLoading(true);
    setError("");

    try {
      // 모집 상태 "전체"는 명세상 별도 파라미터가 없어 open/closed 요청을 합쳐서 구성합니다.
      const responses =
        open === undefined
          ? await Promise.all([
              API.recruit.getList(userId, { open: 1, position }),
              API.recruit.getList(userId, { open: 0, position }),
            ])
          : [await API.recruit.getList(userId, { open: open ? 1 : 0, position })];

      const mergedArticles = responses.flatMap((response) => response.data?.articles ?? []);

      return {
        isSuccess: true,
        message: "요청이 성공적입니다.",
        data: {
          articles: mergedArticles,
          posts: mapRecruitArticlesResponse(mergedArticles),
        },
      };
    } catch (error) {
      const message = error.response?.data?.message || "팀원 모집 목록을 불러오지 못했습니다.";
      setError(message);

      return {
        isSuccess: false,
        message,
        data: { articles: [], posts: [] },
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchArticles = useCallback(async ({ filter, query }) => {
    const userId = getRecruitUserId();

    setIsLoading(true);
    setError("");

    try {
      const response = await API.recruit.search(userId, {
        filter: recruitSearchFilterMap[filter] ?? "title",
        query: query ?? "",
      });
      const articles = response.data?.articles ?? [];

      return {
        ...response,
        data: {
          ...response.data,
          posts: mapRecruitArticlesResponse(articles),
        },
      };
    } catch (error) {
      const message = error.response?.data?.message || "팀원 모집 검색에 실패했습니다.";
      setError(message);

      return {
        isSuccess: false,
        message,
        data: { articles: [], posts: [] },
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createArticle = useCallback(async ({ teamId, form }) => {
    const userId = getRecruitUserId();

    setIsSubmitting(true);
    setError("");

    try {
      return await API.recruit.create(userId, teamId, buildRecruitCreatePayload(form));
    } catch (error) {
      const message = error.response?.data?.message || "팀원 모집 글을 등록하지 못했습니다.";
      setError(message);

      return {
        isSuccess: false,
        message,
        data: null,
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateArticle = useCallback(async ({ articleId, form }) => {
    const userId = getRecruitUserId();

    setIsSubmitting(true);
    setError("");

    try {
      return await API.recruit.update(userId, articleId, buildRecruitCreatePayload(form));
    } catch (error) {
      const message = error.response?.data?.message || "팀원 모집 글을 수정하지 못했습니다.";
      setError(message);

      return {
        isSuccess: false,
        message,
        data: null,
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const removeArticle = useCallback(async (articleId) => {
    const userId = getRecruitUserId();

    setIsSubmitting(true);
    setError("");

    try {
      return await API.recruit.remove(userId, articleId);
    } catch (error) {
      const message = error.response?.data?.message || "팀원 모집 글을 삭제하지 못했습니다.";
      setError(message);

      return {
        isSuccess: false,
        message,
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const closeArticle = useCallback(async (articleId) => {
    const userId = getRecruitUserId();

    try {
      return await API.recruit.close(userId, articleId);
    } catch (error) {
      const message = error.response?.data?.message || "팀원 모집 글을 마감하지 못했습니다.";
      setError(message);

      return {
        isSuccess: false,
        message,
        data: null,
      };
    }
  }, []);

  return {
    fetchList,
    searchArticles,
    createArticle,
    updateArticle,
    removeArticle,
    closeArticle,
    isLoading,
    isSubmitting,
    error,
  };
};
