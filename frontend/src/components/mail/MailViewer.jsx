import { useState } from "react";

const ActionCircle = ({ children, color = "#B8C1D2", onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D7DEEA] bg-white text-sm font-bold shadow-sm transition hover:-translate-y-0.5"
    style={{ color }}
  >
    {children}
  </button>
);

const MailViewer = ({ message, onToggleStar, onDelete }) => {
  const [inviteDecisionById, setInviteDecisionById] = useState({});

  if (!message) {
    return (
      <section className="flex min-h-[640px] flex-1 items-center justify-center rounded-2xl border border-[#E4E9F2] bg-white text-[#99A2B4]">
        메시지를 선택해 주세요.
      </section>
    );
  }

  const isStarred = message.isStarred;
  const isTeamInvite = message.type === "team-invite";
  const isJoinRequest = message.type === "team-join-request";
  const isDecisionMessage = isTeamInvite || isJoinRequest;
  const inviteDecision = inviteDecisionById[message.id] ?? null;

  const decideInvite = (decision) => {
    setInviteDecisionById((prev) => ({ ...prev, [message.id]: decision }));
  };

  return (
    <section className="flex min-h-[640px] flex-1 flex-col rounded-2xl border border-[#E4E9F2] bg-white p-8 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-xl border border-[#EDE6C8] bg-[#FFFDF2] px-4 py-3 text-base leading-7 text-[#656D7E]">
          <p>
            ✉ 보낸 사람: {message.sender} ({message.role})
          </p>
          <p>⏰ 날짜: {message.date}</p>
        </div>

        <div className="flex gap-2">
          <ActionCircle
            color={isStarred ? "#F5C542" : "#B8C1D2"}
            onClick={() => onToggleStar(message.id)}
          >
            {isStarred ? "★" : "☆"}
          </ActionCircle>
          <ActionCircle color="#F16A6A" onClick={() => onDelete(message.id)}>
            ✕
          </ActionCircle>
        </div>
      </div>

      <h1 className="mt-10 text-5xl font-black tracking-tight text-[#2F3645]">{message.subject}</h1>
      <div className="mt-6 h-px w-full bg-[#E7EBF4]" />

      <article className="mt-8 space-y-7 text-xl leading-[1.95] text-[#4C5568]">
        {message.body.map((paragraph, idx) => (
          <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))}

        {isDecisionMessage ? (
          <div className="rounded-xl border border-[#D7E2FF] bg-[#F6F9FF] p-5 text-[17px]">
            <p className="mb-3 font-bold text-[#336DFE]">
              {isTeamInvite ? "팀 초대 응답" : "합류 요청 검토"}
            </p>
            {inviteDecision ? (
              <p className={inviteDecision === "accept" ? "font-semibold text-emerald-700" : "font-semibold text-rose-600"}>
                {inviteDecision === "accept"
                  ? isTeamInvite
                    ? "팀 초대를 수락했습니다."
                    : "합류 요청을 수락했습니다."
                  : isTeamInvite
                    ? "팀 초대를 거절했습니다."
                    : "합류 요청을 거절했습니다."}
              </p>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => decideInvite("accept")}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  수락
                </button>
                <button
                  type="button"
                  onClick={() => decideInvite("reject")}
                  className="rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50"
                >
                  거절
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-[#C8D7FF] bg-[#ECF2FF] p-5 text-[17px]">
            <p className="mb-2 font-bold text-[#3E6BE2]">주요 안내 사항</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>팀원 전원 신분증 필참 (대리 참석 불가)</li>
              <li>개인 노트북 및 개발 장비 지참 필수</li>
              <li>본선 피치 자료는 전일 오후 6시까지 제출</li>
            </ul>
          </div>
        )}

        <p>
          감사합니다.<br />
          {isDecisionMessage ? `${message.sender} 드림.` : "해커톤 운영위원회 드림."}
        </p>
      </article>

      <div className="mt-auto flex justify-end pt-10 text-right text-[11px] uppercase tracking-[0.18em] text-[#B0B8C8]">
        <div>
          <p className="font-extrabold">Verified Message</p>
          <p>id: HC-2024-0310-AUTH</p>
        </div>
      </div>
    </section>
  );
};

export default MailViewer;
