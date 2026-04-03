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

    // 실서버 응답이 가능하면 그대로 사용하고, 실패하거나 JSON이 아닐 때 mock으로 대체합니다.
    // baseURL이 localhost:5173이면 Vite가 HTML을 반환해 fetch가 성공해도 JSON이 아닌 경우가 있습니다.
    if (myPageMockMode === "fallback") {
      try {
        const res = await fetch(bypass(request));
        const contentType = res.headers.get("content-type") || "";
        if (res.ok && contentType.includes("application/json")) {
          return res;
        }
        console.warn(`MSW fallback to mock for /user/${userId}/mypage: 실서버 응답이 JSON이 아닙니다.`);
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

    // 수정 API도 실서버를 우선 사용하고, 실패하거나 JSON이 아닐 때 mock으로 대체합니다.
    if (myPageMockMode === "fallback") {
      try {
        const res = await fetch(bypass(request.clone()));
        const contentType = res.headers.get("content-type") || "";
        if (res.ok && contentType.includes("application/json")) {
          return res;
        }
        console.warn(`MSW fallback to mock for PATCH /user/${userId}/mypage: 실서버 응답이 JSON이 아닙니다.`);
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
