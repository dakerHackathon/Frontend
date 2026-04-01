import { http, HttpResponse } from "msw";
import { myPageMockResponse } from "../data/mypage";

const myPageMockMode = "success";

export const mypageHandlers = [
  http.get("*/user/:userId/mypage", ({ params }) => {
    const { userId } = params;

    console.log(`✅ MSW intercepted: /user/${userId}/mypage`);

    // 응답 상태를 한 곳에서 바꿔서 200/401/500 흐름을 빠르게 테스트합니다.
    if (myPageMockMode === "unauthorized") {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "401",
          message: "인증이 필요합니다.",
          data: null,
        },
        { status: 401 },
      );
    }

    if (myPageMockMode === "error") {
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

    return HttpResponse.json({
      ...myPageMockResponse,
      data: {
        ...myPageMockResponse.data,
        userId,
      },
    });
  }),
];
