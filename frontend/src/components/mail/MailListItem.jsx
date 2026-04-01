const MailListItem = ({ item, active, onClick, onToggleStar }) => {
  const itemId = item.id || item.invitationId;
  const senderName = typeof item.sender === "object" ? item.sender.userName : item.sender;
  const displayDate = item.created_at || item.send_at || "";
  const displayTitle =
    item.title || item.subject || (item.type === 1 ? "[팀 초대] 포지션 제안" : "[참가 요청] 팀 지원 알림");

  return (
    <div
      onClick={() => onClick(itemId)}
      className={`relative mb-3 cursor-pointer rounded-2xl border p-5 transition-all ${
        active ? "border-[#336DFE] bg-[#F6F9FF] shadow-md" : "border-[#E4E9F2] bg-white hover:border-[#D7DEEA]"
      }`}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className={`text-sm font-bold ${active ? "text-[#336DFE]" : "text-[#4C5568]"}`}>
          {senderName}
        </span>
        <span className="text-[11px] text-[#99A2B4]">{displayDate}</span>
      </div>

      <h4
        className={`mb-2 truncate text-base ${
          !item.isRead && item.id ? "font-black text-[#2F3645]" : "font-semibold text-[#656D7E]"
        }`}
      >
        {displayTitle}
      </h4>

      <p className="truncate pr-10 text-[13px] text-[#94A3B8]">
        {item.content ? item.content.replace(/<[^>]*>?/gm, " ").trim() : "내용 없음"}
      </p>

      {item.id ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleStar(item.id);
          }}
          className={`absolute bottom-4 right-4 text-xl ${item.isStar ? "text-[#F5C542]" : "text-[#D7DEEA]"}`}
          aria-label={item.isStar ? "즐겨찾기 해제" : "즐겨찾기"}
        >
          {item.isStar ? "★" : "☆"}
        </button>
      ) : null}

      {item.id && item.isRead === false ? (
        <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#336DFE]" />
      ) : null}
    </div>
  );
};

export default MailListItem;
