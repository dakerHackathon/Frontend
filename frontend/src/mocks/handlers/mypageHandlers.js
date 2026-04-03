import { http, HttpResponse } from "msw";
import { myPageMockResponse } from "../data/mypage";

const myPageMockMode = "success";
let myPageMockData = { ...myPageMockResponse.data };

export const mypageHandlers = [
  http.get("*/user/:userId/mypage", ({ params }) => {
    const { userId } = params;

    console.log(`??MSW intercepted: /user/${userId}/mypage`);
    console.log("[MSW][mypage][GET] current mock nickname:", myPageMockData.nickname);

    // ?묐떟 ?곹깭瑜???怨녹뿉??諛붽퓭??200/401/500 ?먮쫫??鍮좊Ⅴ寃??뚯뒪?명빀?덈떎.
    if (myPageMockMode === "unauthorized") {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "401",
          message: "?몄쬆???꾩슂?⑸땲??",
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

    console.log(`??MSW intercepted: PATCH /user/${userId}/mypage`);

    if (myPageMockMode === "unauthorized") {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "401",
          message: "?몄쬆???꾩슂?⑸땲??",
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
    console.log("[MSW][mypage][PATCH] request body:", body);
    myPageMockData = {
      ...myPageMockData,
      nickname: body.nickname,
      description: body.description,
      portfolio: body.portfolio,
      github: body.github,
      skills: body.skills,
    };
    console.log("[MSW][mypage][PATCH] next mock nickname:", myPageMockData.nickname);

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "?붿껌???깃났?곸엯?덈떎.",
    });
  }),
];
