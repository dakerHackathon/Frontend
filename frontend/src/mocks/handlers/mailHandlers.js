import { http, HttpResponse } from "msw";
import { mockMessages, mockInvitations } from "../data/mailData";

const BASE_URL = "http://13.125.160.175:8080";

let localMessages = [...mockMessages];
let localInvitations = [...mockInvitations];

export const mailHandlers = [
  // 1. 받은 쪽지 목록 보기
  http.get(`${BASE_URL}/user/:userId/message`, async ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get("filter") || "all";

    //  원본 mockMessages 대신 localMessages를 사용합니다.
    let filtered = [...localMessages];
    if (filter === "unread") filtered = filtered.filter((m) => !m.isRead);
    else if (filter === "star") filtered = filtered.filter((m) => m.isStar);

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      data: { messages: filtered, cnt: filtered.length },
    });
  }),

  // 2. 팀 신청/초대 메세지 조회
  http.get(`${BASE_URL}/user/:userId/invitations`, async ({ request }) => {
    try {
      const url = new URL(request.url);
      const type = url.searchParams.get("type"); // "1" 또는 "2" 문자열로 들어옴

      let filteredInvitations = [...localInvitations];

      if (type) {
        filteredInvitations = filteredInvitations.filter(
          (i) => i.type === Number(type),
        );
      }

      return HttpResponse.json({
        isSuccess: true,
        code: "200",
        message: "요청이 성공적입니다.",
        data: {
          invitations: filteredInvitations,
        },
      });
    } catch (error) {
      console.error("MSW Invitations Handler Error:", error);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  // 3. 쪽지 읽음 표시
  http.post(`${BASE_URL}/user/:userId/message/read`, async ({ request }) => {
    const { messageId } = await request.json();
    // 실제 데이터 수정
    localMessages = localMessages.map((m) =>
      m.id === messageId ? { ...m, isRead: true } : m,
    );
    return HttpResponse.json({ isSuccess: true });
  }),

  // 4 & 5. 쪽지 삭제
  http.delete(
    `${BASE_URL}/user/:userId/message/delete`,
    async ({ request }) => {
      const { messageId } = await request.json();
      localMessages = localMessages.filter((m) => m.id !== messageId);
      localInvitations = localInvitations.filter(
        (i) => i.invitationId !== messageId,
      );
      console.log(`[MSW] 삭제 완료: ${messageId}`);
      return HttpResponse.json({ isSuccess: true });
    },
  ),

  // 6. 쪽지 보내기
  http.post(`${BASE_URL}/user/:userId/message/send`, async ({ request }) => {
    const body = await request.json();
    console.log("[MSW] 서버가 받은 데이터:", body);

    //  새로운 쪽지 객체 생성 후 배열 앞에 추가
    const newMessage = {
      id: Date.now(), // 고유 ID 생성
      sender: "나 (테스트)",
      title: body.title,
      content: body.content,
      send_at: new Date().toLocaleString(),
      isRead: true,
      isStar: false,
    };
    localMessages = [newMessage, ...localMessages];
    console.log("[MSW] 현재 메일함 개수:", localMessages.length);

    return HttpResponse.json({ isSuccess: true });
  }),

  // 7. 즐겨찾기 토글
  http.post(`${BASE_URL}/user/:userId/message/star`, async ({ request }) => {
    const { messageId } = await request.json();
    localMessages = localMessages.map((m) =>
      m.id === messageId ? { ...m, isStar: !m.isStar } : m,
    );
    return HttpResponse.json({ isSuccess: true });
  }),

  //8. 팀 초대/제안 수락/거절
  http.post(`${BASE_URL}/camp/:userId/answer`, async ({ request }) => {
    try {
      const body = await request.json();
      const { invitationId, accept } = body;

      console.log("[MSW] 요청 받은 ID:", invitationId, "수락여부:", accept);

      // 1. 데이터가 있는지 먼저 확인 (500 에러 방지)
      if (!localInvitations) {
        throw new Error("localInvitations 데이터가 로드되지 않았습니다.");
      }

      // 2. 가짜 DB에서 해당 항목 삭제
      localInvitations = localInvitations.filter(
        (item) => item.invitationId !== invitationId,
      );

      return HttpResponse.json({
        isSuccess: true,
        code: "200",
        message: "성공적으로 처리되었습니다.",
      });
    } catch (error) {
      console.error("[MSW Handler Error]:", error);
      // 여기서 에러가 나면 사용자님이 보신 COMMON500 응답이 나갑니다.
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "COMMON500",
          message: "서버 내부 오류가 발생했습니다: " + error.message,
        },
        { status: 500 },
      );
    }
  }),
];
