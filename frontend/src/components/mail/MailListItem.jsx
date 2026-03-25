const MailListItem = ({ item, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(item.id)}
      className={`w-full rounded-xl border p-4 text-left transition ${
        active
          ? "border-[#5A84FF] bg-[#F4F8FF] shadow-sm"
          : "border-[#E4E9F2] bg-white hover:border-[#B5C8FF]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-[15px] font-bold text-[#384052]">
          {item.sender} <span className="font-medium text-[#7B8497]">({item.role})</span>
        </p>
        <span className="text-xs text-[#98A1B3]">{item.time}</span>
      </div>

      <p className="mt-2 line-clamp-1 text-[20px] font-black text-[#2B3141]">{item.subject}</p>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B7280]">{item.preview}</p>

      <div className="mt-3 flex justify-end text-[#AAB2C5]">☆</div>
    </button>
  );
};

export default MailListItem;