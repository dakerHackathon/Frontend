import { http, HttpResponse } from "msw";
import { getHackathonDetailResponse, getHackathonListResponse } from "../data/hackathons";

export const hackathonHandlers = [
  http.get("/hackathons", () => {
    return HttpResponse.json(getHackathonListResponse());
  }),
  http.get("/hackathons/:slug", ({ params }) => {
    const response = getHackathonDetailResponse(params.slug);

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
