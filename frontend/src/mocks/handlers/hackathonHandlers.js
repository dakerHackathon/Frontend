import { http, HttpResponse } from "msw";
import { getHackathonDetailResponse, getHackathonListResponse } from "../data/hackathons";

// axiosInstance의 baseURL과 일치시켜야 MSW가 요청을 가로챌 수 있다.
const BASE_URL = "http://localhost:5173";

// true로 바꾸면 500 응답을 반환해 에러 UI를 테스트할 수 있다.
const shouldFail = false;

export const hackathonHandlers = [
  http.get(`${BASE_URL}/hackathons`, () => {
    console.log("✅ MSW intercepted: GET /hackathons");

    if (shouldFail) {
      return HttpResponse.json(
        { isSuccess: false, code: "500", message: "서버 오류가 발생했습니다.", data: null },
        { status: 500 },
      );
    }

    return HttpResponse.json(getHackathonListResponse());
  }),

  http.get(`${BASE_URL}/hackathons/:id`, ({ params }) => {
    console.log(`✅ MSW intercepted: GET /hackathons/${params.id}`);

    const response = getHackathonDetailResponse(params.id);

    if (!response) {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "404",
          message: "해커톤을 찾을 수 없습니다.",
          data: null,
        },
        { status: 404 },
      );
    }

    return HttpResponse.json(response);
  }),
];
