import { bypass, http, HttpResponse } from "msw";
import { temperatureMembersByTeamId } from "../data/temperature";

const temperatureMockMode = "fallback";

const getMockErrorResponse = () => {
  if (temperatureMockMode === "unauthorized") {
    return HttpResponse.json(
      {
        isSuccess: false,
        code: "401",
        message: "인증이 필요합니다.",
      },
      { status: 401 },
    );
  }

  if (temperatureMockMode === "error") {
    return HttpResponse.json(
      {
        isSuccess: false,
        code: "500",
        message: "mock-data-temperature-error",
      },
      { status: 500 },
    );
  }

  return null;
};

const tryPassThrough = async (request, warnMessage) => {
  if (temperatureMockMode !== "fallback") {
    return null;
  }

  try {
    const response = await fetch(bypass(request));
    const contentType = response.headers.get("content-type") || "";

    if (response.ok && contentType.includes("application/json")) {
      return response;
    }

    console.warn(warnMessage);
  } catch (error) {
    console.warn(warnMessage, error);
  }

  return null;
};

export const temperatureHandlers = [
  http.get("*/user/:userId/temperature/:hackathonId", async ({ params, request }) => {
    console.log("✅ MSW intercepted: GET /user/:userId/temperature/:hackathonId", params);

    const mockErrorResponse = getMockErrorResponse();
    if (mockErrorResponse) {
      return mockErrorResponse;
    }

    const passThroughResponse = await tryPassThrough(
      request,
      `MSW fallback to mock for GET /user/${params.userId}/temperature/${params.hackathonId}: 실서버 응답을 사용할 수 없습니다.`,
    );
    if (passThroughResponse) {
      return passThroughResponse;
    }

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
      data: {
        members: temperatureMembersByTeamId[Number(params.hackathonId)] ?? [],
      },
    });
  }),

  http.post("*/user/:userId/temperature/:hackathonId", async ({ params, request }) => {
    console.log("✅ MSW intercepted: POST /user/:userId/temperature/:hackathonId", params);

    const mockErrorResponse = getMockErrorResponse();
    if (mockErrorResponse) {
      return mockErrorResponse;
    }

    const passThroughResponse = await tryPassThrough(
      request,
      `MSW fallback to mock for POST /user/${params.userId}/temperature/${params.hackathonId}: 실서버 응답을 사용할 수 없습니다.`,
    );
    if (passThroughResponse) {
      return passThroughResponse;
    }

    await request.json();

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
    });
  }),
];
