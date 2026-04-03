import axiosInstance from "./axiosInstance";

export const recruitApi = {
  // 백엔드 명세 수신 전까지 팀원 모집 목록은 임시 mock endpoint를 사용합니다.
  getList: () =>
    axiosInstance.get(
      typeof window === "undefined"
        ? "/recruits"
        : new URL("/recruits", window.location.origin).toString(),
    ),
};
