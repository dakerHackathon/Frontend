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

const MailViewer = ({ message, mode, onToggleStar, onDelete, onRespond }) => {
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

  // 1. 이름 처리 (객체 우선 체크)
  const senderName = message.sender?.userName || message.sender || "알 수 없는 사용자";

  // 2. 제목 처리 (백엔드 추가 필드 'title' 최우선 반영)
  const displayTitle =
    message.title ||
    message.subject ||
    (message.type === 1 ? "[팀 초대] 합류 제안" : "[참가 신청] 팀 지원 알림");

  // 3. 날짜 처리 (백엔드 추가 필드 'created_at' 최우선 반영)
  const displayDate = message.created_at || message.send_at || "날짜 정보 없음";

  // 4. 포지션 매핑
  const positions = {
    1: "기획자",
    2: "프론트엔드",
    3: "백엔드",
    4: "디자이너",
  };
  const positionName = positions[message.position] || null;

  //5. 팀명
  const teamName = message.sender?.teamName || message.sender || "알 수 없는 사용자";

  const isStarred = message.isStar || false;
  const isTeamInvite = message.type === 1;
  const isJoinRequest = message.type === 2;
  const isDecisionMessage = isTeamsMode && (isTeamInvite || isJoinRequest);

  const handleDecision = async (accept) => {
    // 1. 여기서 직접 확인
    const confirmMsg = accept ? "수락하시겠습니까?" : "거절하시겠습니까?";
    if (!window.confirm(confirmMsg)) return;

    // 2. 부모로부터 받은 함수를 실행하고 결과를 '직접' 기다림
    const res = await onRespond(currentId, accept);

    console.log("MailViewer 최종 도달 데이터:", res);

    // 3. 결과 처리
    if (res && res.isSuccess) {
      alert(accept ? "성공적으로 수락되었습니다." : "요청을 거절했습니다.");
      // 목록에서 지워지는 건 useMail 내부의 setInvitations가 처리함
    } else {
      alert(res?.message || "처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 5. 본문 내용 (content가 있으면 그것을, 없으면 템플릿 사용)
  const displayContent =
    message.content ||
    (isTeamInvite
      ? `안녕하세요. 우리 팀은 <strong>${positionName || "개발자"}</strong> 포지션으로 합류해 주실 분을 찾고 있습니다.`
      : `${senderName} 님이 <strong>${positionName || "개발자"}</strong> 포지션으로 팀에 지원했습니다.`);

  const handleDecision = (decision) => {
    setInviteDecisionById((prev) => ({ ...prev, [currentId]: decision }));
    setDecisionNotice(
      decision === "accept" ? "초대 요청을 수락했습니다." : "초대 요청을 거절했습니다.",
    );
  };

  return (
    <section className="flex min-h-[700px] flex-1 flex-col rounded-3xl border border-[#E4E9F2] bg-white p-10 shadow-sm transition-all">
      {feedbackMessage ? (
        <div className="mb-6 flex items-start justify-between rounded-2xl border border-[#D8E4FF] bg-[#F5F8FF] px-5 py-4 text-sm font-semibold text-[#336DFE]">
          <span>{feedbackMessage}</span>
          <button
            type="button"
            onClick={onDismissFeedback}
            className="ml-4 shrink-0 text-[#7A96E8] hover:text-[#336DFE]"
          >
            닫기
          </button>
        </div>
      ) : null}

      {decisionNotice ? (
        <div className="mb-6 flex items-start justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
          <span>{decisionNotice}</span>
          <button
            type="button"
            onClick={() => setDecisionNotice("")}
            className="ml-4 shrink-0 text-emerald-500 hover:text-emerald-700"
          >
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
                <span className="ml-2 text-xs font-normal text-[#656D7E]">
                  &lt;{positionName}&gt;
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold w-16 shrink-0 text-[#656D7E]">보낸날짜</span>
            <div className="inline-flex items-center rounded-full bg-[#E8F2FF] px-4 py-1.5 text-sm">
              <div className="text-[13px] font-medium">{displayDate}</div>
            </div>
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
          <ActionCircle
            title="삭제하기"
            color="#F16A6A"
            onClick={() => setPendingDeleteId(currentId)}
          >
            <img src={deleteIcon} alt="삭제" />
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

      <article className="flex-1 text-xl leading-[2] text-[#4C5568]">
        {/* 팀 초대/신청 모드일 때 보여주는 액션 박스 */}
        {isDecisionMessage ? (
          <div className="rounded-2xl border-2 border-[#D7E2FF] bg-[#F6F9FF] p-8">
            <p className="mb-4 text-lg font-bold text-[#336DFE]">
              {isTeamInvite
                ? `[${teamName} - ${positionName}]팀 초대 응답`
                : `[${teamName} - ${positionName}]합류 요청 검토`}
            </p>

            <div
              className="min-h-[200px] whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => handleDecision(true)}
                className="w-36 rounded-xl bg-emerald-600 py-2.5 text-base font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
              >
                수락하기
              </button>
              <button
                type="button"
                onClick={() => handleDecision(false)}
                className="w-36 rounded-xl border border-rose-200 bg-white py-2.5 text-base font-bold text-rose-600 transition hover:bg-rose-50 active:scale-95"
              >
                거절하기
              </button>
            </div>

            {/* 하단에 안내 문구를 추가 */}
            <p className="mt-4 text-sm text-[#8B95A7]">
              * 수락 또는 거절을 선택하면 해당 메시지는 자동으로 목록에서 제외됩니다.
            </p>
          </div>
        ) : (
          /* 일반 쪽지일 때 보여주는 안내 사항 */

          <div className="flex flex-col gap-8">
            <div
              className="min-h-[300px] whitespace-pre-line px-2"
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />

            {/* 기존 안내 사항 */}
            <div className="rounded-2xl border border-[#E4E9F2] bg-[#F8FAFC] p-8">
              <p className="mb-2 font-bold text-[#64748B] text-base">💡 안내 사항</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[#94A3B8]">
                <li>본 메시지는 해커톤 운영 시스템을 통해 발송되었습니다.</li>
                <li>중요한 쪽지는 별표(★) 기능을 통해 따로 보관할 수 있습니다.</li>
              </ul>
            </div>
          </div>
        )}
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
