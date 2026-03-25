const ActionCircle = ({ children, color = "#B8C1D2" }) => (
  <button
    type="button"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D7DEEA] bg-white text-sm font-bold shadow-sm transition hover:-translate-y-0.5"
    style={{ color }}
  >
    {children}
  </button>
);

const MailViewer = ({ message }) => {
  if (!message) {
    return (
      <section className="flex min-h-[640px] flex-1 items-center justify-center rounded-2xl border border-[#E4E9F2] bg-white text-[#99A2B4]">
        메시지를 선택해 주세요.
      </section>
    );
  }

  return (
    <section className="flex min-h-[640px] flex-1 flex-col rounded-2xl border border-[#E4E9F2] bg-white p-8 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-xl border border-[#EDE6C8] bg-[#FFFDF2] px-4 py-3 text-xs leading-6 text-[#656D7E]">
          <p>✉ 보낸사람: {message.sender} ({message.role})</p>
          <p>⏰ 날짜: {message.date}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#EAF0FF] px-2 py-0.5 text-[11px] font-semibold text-[#3E6BE2]">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <ActionCircle color="#F5C542">★</ActionCircle>
          <ActionCircle>↺</ActionCircle>
          <ActionCircle color="#F16A6A">✕</ActionCircle>
        </div>
      </div>

      <h1 className="mt-10 text-5xl font-black tracking-tight text-[#2F3645]">{message.subject}</h1>
      <div className="mt-6 h-px w-full bg-[#E7EBF4]" />

      <article className="mt-8 space-y-7 text-xl leading-[1.95] text-[#4C5568]">
        {message.body.map((paragraph, idx) => (
          <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))}

        <div className="rounded-xl border border-[#C8D7FF] bg-[#ECF2FF] p-5 text-[17px]">
          <p className="mb-2 font-bold text-[#3E6BE2]">주요 안내 사항</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>팀원 전원 신분증 필참 (대리 참석 불가)</li>
            <li>개인 노트북 및 개발 장비 지참 필수</li>
            <li>본선 피치 자료는 전일 오후 6시까지 제출</li>
          </ul>
        </div>

        <p>
          감사합니다.<br />
          해커톤 운영위원회 드림.
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