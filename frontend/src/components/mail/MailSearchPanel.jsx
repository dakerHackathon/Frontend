const MailSearchPanel = ({ tabs, activeTab, onTabChange }) => {
  return (
    <section className="rounded-2xl bg-white border border-[#E9EDF5] p-4 shadow-sm">
      <label className="sr-only" htmlFor="mail-search">
        메시지 검색
      </label>
      <input
        id="mail-search"
        type="text"
        placeholder="메시지 검색..."
        className="h-11 w-full rounded-lg border border-[#DCE3EF] px-4 text-sm text-[#6B7280] outline-none focus:border-[#336DFE]"
      />

      <div className="mt-4 flex items-center gap-5 text-[13px] font-semibold text-[#8B95A7]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`rounded-md px-2 py-1 transition ${
              activeTab === tab.id
                ? "bg-[#EAF0FF] text-[#336DFE]"
                : "hover:text-[#336DFE]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="mt-5 h-12 w-full rounded-lg bg-[#336DFE] text-base font-bold text-white shadow-sm transition hover:bg-[#2558D6]"
      >
        +새 메시지 작성하기
      </button>
    </section>
  );
};

export default MailSearchPanel;