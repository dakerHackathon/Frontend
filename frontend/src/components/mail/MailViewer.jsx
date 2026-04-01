import { useEffect, useMemo, useState } from "react";
import deleteIcon from "../../assets/mailDeleteIcon.png";

const POSITION_LABELS = {
  1: "기획",
  2: "프론트엔드",
  3: "백엔드",
  4: "디자이너",
};

const ActionCircle = ({ children, color = "#B8C1D2", onClick, title, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#D7DEEA] bg-white text-lg font-bold leading-none shadow-sm transition hover:bg-gray-50 active:scale-95 ${className}`}
    style={{ color }}
  >
    {children}
  </button>
);

const MailViewer = ({ message, mode, onToggleStar, onDelete, feedbackMessage, onDismissFeedback }) => {
  const [inviteDecisionById, setInviteDecisionById] = useState({});
  const [decisionNotice, setDecisionNotice] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    if (!message) {
      setPendingDeleteId(null);
      return;
    }

    setPendingDeleteId((prev) => (prev === (message.id || message.invitationId) ? prev : null));
  }, [message]);

  const senderName = useMemo(() => {
    if (!message) return "";
    return message.sender?.userName || message.sender || "이름 없는 사용자";
  }, [message]);

  if (!message) {
    return (
      <section className="flex min-h-[700px] flex-1 items-center justify-center rounded-3xl border-2 border-dashed border-[#E4E9F2] bg-white text-xl font-medium text-[#99A2B4]">
        <div className="text-center">
          <p className="mb-2 text-4xl">✉</p>
          <p>내용을 확인하려면 목록에서 항목을 선택해 주세요.</p>
        </div>
      </section>
    );
  }

  const isMessageMode = mode === "messages";
  const isTeamsMode = mode === "teams";
  const currentId = message.id || message.invitationId;
  const positionName = POSITION_LABELS[message.position] || null;
  const isStarred = message.isStar || false;
  const isTeamInvite = message.type === 1;
  const isJoinRequest = message.type === 2;
  const isDecisionMessage = isTeamsMode && (isTeamInvite || isJoinRequest);
  const inviteDecision = inviteDecisionById[currentId] ?? null;
  const displayTitle =
    message.title || message.subject || (message.type === 1 ? "[팀 초대] 포지션 제안" : "[참가 요청] 팀 지원 알림");
  const displayDate = message.created_at || message.send_at || "날짜 정보 없음";
  const displayContent =
    message.content ||
    (isTeamInvite
      ? `안녕하세요. 우리 팀은 <strong>${positionName || "개발자"}</strong> 포지션으로 합류해 주실 분을 찾고 있습니다.`
      : `${senderName} 님이 <strong>${positionName || "개발자"}</strong> 포지션으로 팀에 지원했습니다.`);

  const handleDecision = (decision) => {
    setInviteDecisionById((prev) => ({ ...prev, [currentId]: decision }));
    setDecisionNotice(decision === "accept" ? "초대 요청을 수락했습니다." : "초대 요청을 거절했습니다.");
  };

  return (
    <section className="flex min-h-[700px] flex-1 flex-col rounded-3xl border border-[#E4E9F2] bg-white p-10 shadow-sm transition-all">
      {feedbackMessage ? (
        <div className="mb-6 flex items-start justify-between rounded-2xl border border-[#D8E4FF] bg-[#F5F8FF] px-5 py-4 text-sm font-semibold text-[#336DFE]">
          <span>{feedbackMessage}</span>
          <button type="button" onClick={onDismissFeedback} className="ml-4 shrink-0 text-[#7A96E8] hover:text-[#336DFE]">
            닫기
          </button>
        </div>
      ) : null}

      {decisionNotice ? (
        <div className="mb-6 flex items-start justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
          <span>{decisionNotice}</span>
          <button type="button" onClick={() => setDecisionNotice("")} className="ml-4 shrink-0 text-emerald-500 hover:text-emerald-700">
            닫기
          </button>
        </div>
      ) : null}

      <div className="flex items-start justify-between">
        <div className="space-y-3 text-[#2F3645]">
          <div className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-sm font-bold text-[#656D7E]">보낸 사람</span>
            <div className="inline-flex items-center rounded-full bg-[#E8F2FF] px-4 py-1.5 text-sm">
              <span className="font-semibold">{senderName}</span>
              {positionName ? (
                <span className="ml-2 text-xs font-normal text-[#656D7E]">&lt;{positionName}&gt;</span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-sm font-bold text-[#656D7E]">보낸 날짜</span>
            <div className="pl-1 text-[13px] font-medium text-[#656D7E]">{displayDate}</div>
          </div>
        </div>

        <div className="flex gap-3">
          {isMessageMode ? (
            <ActionCircle
              title="중요 표시"
              color={isStarred ? "#F5C542" : "#B8C1D2"}
              onClick={() => onToggleStar(currentId)}
            >
              <span className="-translate-y-[1px] text-xl">{isStarred ? "★" : "☆"}</span>
            </ActionCircle>
          ) : null}
          <ActionCircle title="삭제하기" color="#F16A6A" onClick={() => setPendingDeleteId(currentId)}>
            <img src={deleteIcon} alt="삭제" />
          </ActionCircle>
        </div>
      </div>

      <div className="mb-8 mt-12">
        <h1 className="text-5xl font-black leading-tight tracking-tight text-[#2F3645]">{displayTitle}</h1>
        <div className="mt-8 h-[2px] w-full bg-[#F1F4F9]" />
      </div>

      <article className="flex-1 text-xl leading-[2] text-[#4C5568]">
        <div className="min-h-[200px] whitespace-pre-line" dangerouslySetInnerHTML={{ __html: displayContent }} />

        {pendingDeleteId === currentId ? (
          <div className="mt-12 rounded-2xl border border-rose-200 bg-rose-50 p-6">
            <p className="text-lg font-bold text-rose-600">이 메시지를 삭제할까요?</p>
            <p className="mt-2 text-sm text-rose-500">삭제한 메시지는 다시 복구할 수 없습니다.</p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  onDelete(currentId);
                  setPendingDeleteId(null);
                }}
                className="rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600"
              >
                삭제하기
              </button>
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="rounded-xl border border-rose-200 bg-white px-5 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
              >
                취소
              </button>
            </div>
          </div>
        ) : null}

        {isDecisionMessage ? (
          <div className="mt-12 rounded-2xl border-2 border-[#D7E2FF] bg-[#F6F9FF] p-8">
            <p className="mb-4 text-lg font-bold text-[#336DFE]">{isTeamInvite ? "팀 초대 응답" : "참가 요청 검토"}</p>
            {inviteDecision ? (
              <div
                className={`flex items-center gap-2 text-2xl font-bold ${
                  inviteDecision === "accept" ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                <span>{inviteDecision === "accept" ? "✓" : "✕"}</span>
                {inviteDecision === "accept" ? "수락이 완료되었습니다." : "요청을 거절했습니다."}
              </div>
            ) : (
              <div className="mt-8 flex justify-start gap-3">
                <button
                  type="button"
                  onClick={() => handleDecision("accept")}
                  className="w-36 rounded-xl bg-emerald-600 py-2.5 text-base font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                >
                  수락하기
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision("reject")}
                  className="w-36 rounded-xl border border-rose-200 bg-white py-2.5 text-base font-bold text-rose-600 transition hover:bg-rose-50 active:scale-95"
                >
                  거절하기
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-[#E4E9F2] bg-[#F8FAFC] p-6">
            <p className="mb-2 font-bold text-[#64748B]">안내 사항</p>
            <ul className="list-disc space-y-1 pl-5 text-base text-[#94A3B8]">
              <li>이 메시지는 해커톤 플랫폼 테스트 환경에서 발송되었습니다.</li>
              <li>중요한 메시지는 별표 기능으로 빠르게 다시 확인할 수 있습니다.</li>
            </ul>
          </div>
        )}

        <div className="mt-12 text-[#99A2B4]">
          <p>감사합니다.</p>
          <p className="font-bold text-[#656D7E]">{senderName} 드림.</p>
        </div>
      </article>

      <div className="mt-12 flex items-end justify-between border-t border-[#F1F4F9] pt-6">
        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#B0B8C8]">
          <p className="font-black text-[#64748B]">System Verified</p>
          <p>Ref: {isTeamsMode ? `INV-${currentId}` : `MSG-${currentId}`}</p>
        </div>
        <div className="text-[10px] text-[#D1D9E6]">© 2026 Hackathon Management System</div>
      </div>
    </section>
  );
};

export default MailViewer;
