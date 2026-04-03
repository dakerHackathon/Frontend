const UserIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M4.5 19C5.6 15.7 8.4 14 12 14C15.6 14 18.4 15.7 19.5 19"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const TrophyIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M8 4.5H16V8.5C16 10.8 14.2 12.5 12 12.5C9.8 12.5 8 10.8 8 8.5V4.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M8 6H5.5C5.5 8.5 6.5 10 8.8 10.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M16 6H18.5C18.5 8.5 17.5 10 15.2 10.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 12.5V16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9.5 19.5H14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const RankingSidebarCard = ({ title, entries, currentUser }) => (
  <section className="rounded-[24px] border border-slate-300 bg-white px-5 py-5 shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
      <h2 className="text-[1.2rem] font-black text-[#336DFE]">{title}</h2>
    </div>

    <div className="space-y-3 py-4">
      {entries.map((entry) => (
        <div
          key={entry.rank}
          className="flex items-center justify-between gap-3 text-xs font-semibold sm:text-sm"
        >
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 leading-none text-slate-800">
              <TrophyIcon className="h-4 w-4 shrink-0" />
              <span className="font-black leading-none">{entry.rank}등</span>
            </span>
            <div className="flex h-4 items-center gap-1.5">
              <UserIcon className="h-[13px] w-[13px] shrink-0 text-[#9CB3FF]" />
              <span className="font-black leading-none text-[#336DFE]">{entry.name}</span>
            </div>
          </div>
          <span className="font-black leading-none text-[#F59E0B]">{entry.value}</span>
        </div>
      ))}
    </div>

    {currentUser ? (
      <div className="flex items-center justify-between rounded-2xl bg-[#DDE5FF] px-4 py-3 text-xs font-bold text-[#336DFE] sm:text-sm">
        <div className="flex h-4 items-center gap-1.5">
          <UserIcon className="h-[13px] w-[13px] shrink-0" />
          <span className="leading-none">{currentUser.name}</span>
        </div>
        <span className="leading-none">{currentUser.value}</span>
      </div>
    ) : null}
  </section>
);

export default RankingSidebarCard;
