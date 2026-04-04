import { bypass, http, HttpResponse } from "msw";
import { skillMockResponse } from "../data/skill";

const skillMockMode = "fallback";

export const skillHandlers = [
  http.get("*/user/skills", async ({ request }) => {
    console.log("✅ MSW intercepted: /user/skills");

    // 스킬 전체 조회도 상태 전환을 쉽게 해두면 연동 전 검증이 빨라집니다.
    if (skillMockMode === "unauthorized") {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "401",
          message: "mock-data-unauthorized",
          data: null,
        },
        { status: 401 },
      );
    }

    if (skillMockMode === "error") {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "500",
          message: "mock-data-internal-server-error",
          data: null,
        },
        { status: 500 },
      );
    }

    // 실서버 응답이 가능하면 그대로 사용하고, 네트워크 오류일 때만 mock 데이터로 대체합니다.
    if (skillMockMode === "fallback") {
      try {
        return await fetch(bypass(request));
      } catch (error) {
        console.warn("MSW fallback to mock for /user/skills:", error);
      }
    }

    return HttpResponse.json(skillMockResponse);
  }),
];
