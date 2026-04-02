import { bypass, http, HttpResponse } from "msw";
import { skillMockResponse } from "../data/skill";

const skillMockMode = "fallback";

export const skillHandlers = [
  http.get("*/user/skills", async ({ request }) => {
    console.log("✅ MSW intercepted: /user/skills");

    // ?ㅽ궗 ?꾩껜 議고쉶???곹깭 ?꾪솚??媛?ν빐???ㅻⅨ ?붾㈃ ?곕룞 ?꾩뿉 鍮좊Ⅴ寃?寃利앺븷 ???덉뒿?덈떎.
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
