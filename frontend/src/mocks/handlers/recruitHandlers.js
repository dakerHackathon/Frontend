import { http, HttpResponse } from "msw";
import { recruitPosts } from "../data/recruits";

// 현재 팀원 모집 목록을 MSW로 내려주고, 추후 실제 API 명세를 받으면 동일한 응답 shape로 교체합니다.
const shouldFail = false;

export const recruitHandlers = [
  http.get("/recruits", () => {
    console.log("MSW intercepted: GET /recruits");

    if (shouldFail) {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "500",
          message: "팀원 모집 목록을 불러오는 중 오류가 발생했습니다.",
          data: null,
        },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
      data: {
        posts: recruitPosts,
      },
    });
  }),
];
