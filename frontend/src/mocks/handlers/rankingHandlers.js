import { http, HttpResponse } from "msw";
import {
  getMyRankingResponse,
  getRankingListResponse,
  getRankingTop3Response,
} from "../data/ranking";

const shouldFail = false;

const createErrorResponse = (code, message, status) =>
  HttpResponse.json(
    {
      isSuccess: false,
      code,
      message,
      data: null,
    },
    { status },
  );

export const rankingHandlers = [
  http.get("*/rankings", ({ request }) => {
    console.log("✅ MSW intercepted: GET /rankings");

    if (shouldFail) {
      return createErrorResponse("500", "랭킹 목록을 불러오는 중 오류가 발생했습니다.", 500);
    }

    const filter = new URL(request.url).searchParams.get("filter") ?? "win";
    return HttpResponse.json(getRankingListResponse(filter));
  }),
  http.get("*/rankings/:userId", ({ params }) => {
    console.log(`✅ MSW intercepted: GET /rankings/${params.userId}`);

    if (shouldFail) {
      return createErrorResponse("500", "내 랭킹 정보를 불러오는 중 오류가 발생했습니다.", 500);
    }

    return HttpResponse.json(getMyRankingResponse());
  }),
  http.get("*/rankings/top3", () => {
    console.log("✅ MSW intercepted: GET /rankings/top3");

    if (shouldFail) {
      return createErrorResponse("500", "랭킹 사이드바를 불러오는 중 오류가 발생했습니다.", 500);
    }

    return HttpResponse.json(getRankingTop3Response());
  }),
];
