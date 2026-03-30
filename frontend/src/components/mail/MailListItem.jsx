import React from "react";

const MailListItem = ({ item, active, onClick, onToggleStar }) => {
  // [해결 포인트 1] sender가 객체인 경우 userName을 추출, 문자열인 경우 그대로 사용
  const senderName =
    typeof item.sender === "object" ? item.sender.userName : item.sender;

  // [해결 포인트 2] ID 처리 (Messages는 id, Teams는 invitationId)
  const itemId = item.id || item.invitationId;

  // [참고] 즐겨찾기 상태 필드명 대응
  const isStarred = item.isStar || item.isStarred;

  return (
    <div
      onClick={() => onClick(itemId)}
      className={`relative cursor-pointer rounded-2xl border p-5 transition-all ${
        active
          ? "border-[#336DFE] bg-[#F6F9FF] shadow-md"
          : "border-[#E4E9F2] bg-white hover:border-[#D7DEEA]"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        {/* [중요] 여기서 sender 대신 senderName을 렌더링해야 에러가 안 납니다 */}
        <span
          className={`text-sm font-bold ${active ? "text-[#336DFE]" : "text-[#4C5568]"}`}
        >
          {senderName}
        </span>
        <span className="text-[11px] text-[#99A2B4]">
          {item.time || item.send_at}
        </span>
      </div>

      <h4 className="mb-2 truncate text-base font-black tracking-tight text-[#2F3645]">
        {item.subject ||
          (item.type === 1 ? "[팀 초대] 합류 요청" : "[합류 신청] 지원")}
      </h4>

      <p className="line-clamp-2 text-sm leading-relaxed text-[#656D7E]">
        {/* 본문 미리보기: content(문자열) 또는 preview 대응 */}
        {item.preview ||
          (item.content ? item.content.replace(/<[^>]*>?/gm, "") : "")}
      </p>

      {/* 즐겨찾기 버튼 (Messages 모드에서만 주로 사용) */}
      {item.id && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(item.id);
          }}
          className={`absolute bottom-4 right-4 text-lg ${
            isStarred ? "text-[#F5C542]" : "text-[#D7DEEA]"
          } hover:scale-110 transition-transform`}
        >
          {isStarred ? "★" : "☆"}
        </button>
      )}

      {/* 읽지 않음 표시 */}
      {(item.isRead === false || item.isUnread === true) && (
        <div className="absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#336DFE]" />
      )}
    </div>
  );
};

export default MailListItem;
