const MailListItem = ({ item, active, onClick, onToggleStar }) => {
  const isUnread = item.isUnread;
  const isStarred = item.isStarred;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(item.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick(item.id);
        }
      }}
      className={`w-full rounded-xl border p-4 text-left transition ${
        active
          ? "border-[#5A84FF] bg-[#F4F8FF] shadow-sm"
          : "border-[#E4E9F2] bg-white hover:border-[#B5C8FF]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          {isUnread ? <span className="h-2 w-2 rounded-full bg-[#336DFE]" aria-hidden="true" /> : null}
          <p className={`text-[15px] text-[#384052] ${isUnread ? "font-black" : "font-bold"}`}>
            {item.sender} <span className={`text-[#7B8497] ${isUnread ? "font-semibold" : "font-medium"}`}>({item.role})</span>
          </p>
        </div>
        <span className="text-xs text-[#98A1B3]">{item.time}</span>
      </div>

      <p className={`mt-2 line-clamp-1 text-[20px] text-[#2B3141] ${isUnread ? "font-black" : "font-semibold"}`}>
        {item.subject}
      </p>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B7280]">{item.preview}</p>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleStar(item.id);
          }}
          aria-label={isStarred ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          className={`text-lg leading-none ${isStarred ? "text-[#F5C542]" : "text-[#AAB2C5]"}`}
        >
          {isStarred ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
};

export default MailListItem;
