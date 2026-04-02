import { useCallback } from "react";
import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";

export const useSkill = () => {
  const {
    execute: executeGetAllSkills,
    isLoading,
    error,
  } = useApi(API.skill.getAll);

  const getAllSkills = useCallback(async () => {
    try {
      const result = await executeGetAllSkills();
      return result;
    } catch (e) {
      console.error("Skill list fetch error:", e);
      return {
        isSuccess: false,
        message: e.response?.data?.message || "Failed to fetch skill list.",
      };
    }
  }, [executeGetAllSkills]);

  return {
    getAllSkills,
    isLoading,
    skillError: error,
  };
};
