import { bypass, http, HttpResponse } from "msw";
import { myPageMockResponse } from "../data/mypage";

const myPageMockMode = "fallback";
let myPageMockData = { ...myPageMockResponse.data };

export const mypageHandlers = [
  http.get("*/user/:userId/mypage", async ({ params, request }) => {
    const { userId } = params;

    console.log(`✅ MSW intercepted: /user/${userId}/mypage`);

    // 응답 상태를 한 곳에서 바꾸면 200/401/500 테스트를 빠르게 확인할 수 있습니다.
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

    // 실서버 응답이 가능하면 그대로 사용하고, 네트워크 오류일 때만 mock 데이터로 대체합니다.
    if (myPageMockMode === "fallback") {
      try {
        return await fetch(bypass(request));
      } catch (error) {
        console.warn(`MSW fallback to mock for /user/${userId}/mypage:`, error);
      }
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

    // 수정 API도 실서버를 우선 사용하고, 실패할 때만 mock 성공 응답으로 돌립니다.
    if (myPageMockMode === "fallback") {
      try {
        return await fetch(bypass(request.clone()));
      } catch (error) {
        console.warn(`MSW fallback to mock for PATCH /user/${userId}/mypage:`, error);
      }
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
