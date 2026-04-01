import { useState } from "react";
import deleteIcon from "../../assets/mailDeleteIcon.png";

// 공통 버튼 컴포넌트
const ActionCircle = ({ children, color = "#B8C1D2", onClick, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    // leading-none 추가: 텍스트의 상하 여백을 제거해 정중앙에 배치되도록 도움
    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D7DEEA] bg-white text-lg font-bold shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 active:scale-95 leading-none"
    style={{ color }}
  >
    {children}
  </button>
);

const MailViewer = ({ message, mode, onToggleStar, onDelete }) => {
  const [inviteDecisionById, setInviteDecisionById] = useState({});

  if (!message) {
    return (
      <section className="flex min-h-[700px] flex-1 items-center justify-center rounded-3xl border-2 border-dashed border-[#E4E9F2] bg-white text-xl font-medium text-[#99A2B4]">
        <div className="text-center">
          <p className="mb-2 text-4xl">📬</p>
          <p>내용을 확인하려면 목록에서 항목을 선택해 주세요.</p>
        </div>
      </section>
    );
  }

  // [데이터 파싱 핵심 수정]
  const isMessageMode = mode === "messages";
  const isTeamsMode = mode === "teams";
  const currentId = message.id || message.invitationId;

  // 1. 이름 처리
  const senderName =
    message.sender?.userName || message.sender || "알 수 없는 사용자";

  // 2. 제목 처리
  const displayTitle =
    message.title ||
    message.subject ||
    (message.type === 1 ? "[팀 초대] 합류 제안" : "[참가 신청] 팀 지원 알림");

  // 3. 날짜 처리
  const displayDate = message.created_at || message.send_at || "날짜 정보 없음";

  // 4. 포지션 매핑
  const positions = {
    1: "기획자",
    2: "프론트엔드",
    3: "백엔드",
    4: "디자이너",
  };
  const positionName = positions[message.position] || null;

  const isStarred = message.isStar || false;
  const isRead = message.isRead || false;
  const isTeamInvite = message.type === 1;
  const isJoinRequest = message.type === 2;
  const isDecisionMessage = isTeamsMode && (isTeamInvite || isJoinRequest);

  const inviteDecision = inviteDecisionById[currentId] ?? null;

  const decideInvite = (decision) => {
    setInviteDecisionById((prev) => ({ ...prev, [currentId]: decision }));
    alert(decision === "accept" ? "수락되었습니다." : "거절되었습니다.");
  };

  // 5. 본문 내용 (content가 있으면 그것을, 없으면 템플릿 사용)
  const displayContent =
    message.content ||
    (isTeamInvite
      ? `안녕하세요! 저희 팀의 <strong>${positionName || "개발자"}</strong> 파트로 당신을 초대하고 싶습니다.`
      : `${senderName} 님이 귀하의 팀에 <strong>${positionName || "개발자"}</strong> 파트로 합류하기를 신청했습니다.`);

  return (
    <section className="flex min-h-[700px] flex-1 flex-col rounded-3xl border border-[#E4E9F2] bg-white p-10 shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-3 text-[#2F3645]">
          {/* 보낸 사람 */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold w-16 shrink-0 text-[#656D7E]">
              보낸사람
            </span>
            <div className="inline-flex items-center rounded-full bg-[#E8F2FF] px-4 py-1.5 text-sm">
              <span className="font-semibold">{senderName}</span>
              {positionName && (
                <span className="ml-2 text-[#656D7E] text-xs font-normal">
                  &lt;{positionName}&gt;
                </span>
              )}
            </div>
          </div>

          {/* 보낸 날짜 */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold w-16 shrink-0 text-[#656D7E]">
              보낸날짜
            </span>
            <div className="inline-flex items-center rounded-full bg-[#E8F2FF] px-4 py-1.5 text-sm">
              <span className="font-semibold">{displayDate}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {isMessageMode && (
            <ActionCircle
              title="중요 표시"
              color={isStarred ? "#F5C542" : "#B8C1D2"}
              onClick={() => onToggleStar(currentId)}
            >
              <span className="-translate-y-[2px] text-xl">
                {isStarred ? "★" : "☆"}
              </span>
            </ActionCircle>
          )}
          <ActionCircle
            title="삭제하기"
            color="#F16A6A"
            onClick={() => onDelete(currentId)}
          >
            <img src={deleteIcon} alt="delete" />
          </ActionCircle>
        </div>
      </div>

      {/* 제목 영역 */}
      <div className="mt-12 mb-8">
        <h1 className="text-5xl font-black leading-tight tracking-tight text-[#2F3645]">
          {displayTitle}
        </h1>
        <div className="mt-8 h-[2px] w-full bg-[#F1F4F9]" />
      </div>

      {/* 본문 내용 */}
      <article className="flex-1 text-xl leading-[2] text-[#4C5568]">
        <div
          className="min-h-[200px] whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />

        {isDecisionMessage ? (
          <div className="mt-12 rounded-2xl border-2 border-[#D7E2FF] bg-[#F6F9FF] p-8">
            <p className="mb-4 text-lg font-bold text-[#336DFE]">
              {isTeamInvite
                ? `팀 초대 응답[${"팀명"}] - ${positionName}`
                : `합류 요청 검토[${"팀명"}] - ${positionName}`}
            </p>
            {inviteDecision ? (
              <div
                className={`flex items-center gap-2 text-2xl font-bold ${inviteDecision === "accept" ? "text-emerald-600" : "text-rose-600"}`}
              >
                <span>{inviteDecision === "accept" ? "✓" : "✕"}</span>
                {inviteDecision === "accept"
                  ? "수락을 완료했습니다."
                  : "요청을 거절했습니다."}
              </div>
            ) : (
              <div className="flex justify-start gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => decideInvite("accept")}
                  className="w-36 rounded-xl bg-emerald-600 py-2.5 text-base font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                >
                  수락하기
                </button>
                <button
                  type="button"
                  onClick={() => decideInvite("reject")}
                  className="w-36 rounded-xl border border-rose-200 bg-white py-2.5 text-base font-bold text-rose-600 transition hover:bg-rose-50 active:scale-95"
                >
                  거절하기
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-[#E4E9F2] bg-[#F8FAFC] p-6">
            <p className="mb-2 font-bold text-[#64748B]">💡 안내 사항</p>
            <ul className="list-disc space-y-1 pl-5 text-base text-[#94A3B8]">
              <li>본 메시지는 해커톤 운영 시스템을 통해 발송되었습니다.</li>
              <li>
                중요한 쪽지는 별표(★) 기능을 통해 따로 보관할 수 있습니다.
              </li>
            </ul>
          </div>
        )}
      </article>

      <div className="mt-12 flex items-end justify-between border-t border-[#F1F4F9] pt-6">
        <div className="text-[10px] text-[#D1D9E6]">
          © 2026 Hackathon Management System
        </div>
      </div>
    </section>
  );
};

export default MailViewer;
