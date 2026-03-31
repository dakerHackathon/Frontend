import React from "react";

const MailListItem = ({ item, active, onClick, onToggleStar }) => {
  const itemId = item.id || item.invitationId;
  const senderName =
    typeof item.sender === "object" ? item.sender.userName : item.sender;

  // 날짜와 제목 대응
  const displayDate = item.created_at || item.send_at || "";
  const displayTitle =
    item.title ||
    item.subject ||
    (item.type === 1 ? "[팀 초대] 합류 제안" : "[참가 신청] 지원");

  return (
    <div
      onClick={() => onClick(itemId)}
      className={`relative cursor-pointer rounded-2xl border p-5 transition-all mb-3 ${
        active
          ? "border-[#336DFE] bg-[#F6F9FF] shadow-md"
          : "border-[#E4E9F2] bg-white hover:border-[#D7DEEA]"
      }`}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span
          className={`text-sm font-bold ${active ? "text-[#336DFE]" : "text-[#4C5568]"}`}
        >
          {senderName}
        </span>
        <span className="text-[11px] text-[#99A2B4]">{displayDate}</span>
      </div>

      <h4
        className={`mb-2 truncate text-base ${!item.isRead && item.id ? "font-black text-[#2F3645]" : "font-semibold text-[#656D7E]"}`}
      >
        {displayTitle}
      </h4>

      <p className="truncate text-[13px] text-[#94A3B8] pr-10">
        {item.content
          ? item.content.replace(/<[^>]*>?/gm, " ").trim()
          : "내용 없음"}
      </p>

      {/* 쪽지 모드일 때만 별표 노출 */}
      {item.id && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(item.id);
          }}
          className={`absolute bottom-4 right-4 text-xl ${item.isStar ? "text-[#F5C542]" : "text-[#D7DEEA]"}`}
        >
          {item.isStar ? "★" : "☆"}
        </button>
      )}

      {/* 읽지 않음 표시 도트 */}
      {item.id && item.isRead === false && (
        <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#336DFE]" />
      )}
    </div>
  );
};

export default MailListItem;
