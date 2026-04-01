import { http, HttpResponse } from "msw";
import { myPageMockResponse } from "../data/mypage";

const myPageMockMode = "success";
let myPageMockData = { ...myPageMockResponse.data };

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
        ...myPageMockData,
        userId,
      },
    });
  }),
  http.patch("*/user/:userId/mypage", async ({ request, params }) => {
    const { userId } = params;

    console.log(`✅ MSW intercepted: PATCH /user/${userId}/mypage`);

    if (myPageMockMode === "unauthorized") {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "401",
          message: "인증이 필요합니다.",
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
        },
        { status: 500 },
      );
    }

    const body = await request.json();
    myPageMockData = {
      ...myPageMockData,
      nickname: body.nickname,
      description: body.description,
      portfolio: body.portfolio,
      github: body.github,
      skills: body.skills,
    };

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
    });
  }),
];
