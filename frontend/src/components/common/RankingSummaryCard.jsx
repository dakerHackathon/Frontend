import SidebarPanel from "./SidebarPanel";

const medalByRank = {
  1: "1st",
  2: "2nd",
  3: "3rd",
};

const RankingSummaryCard = ({ title, label, entries, currentUser }) => {
  return (
    <SidebarPanel title={title} action={label}>
      <div className="space-y-3 border-t border-slate-200 pt-4">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className="flex items-center justify-between gap-3 rounded-2xl px-2 py-2 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-[#F4F7FF]"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 text-base">
                {medalByRank[entry.rank] ?? `${entry.rank}위`}
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF0FF] text-[#336DFE]">
                {entry.name.slice(0, 1)}
              </span>
              <span className="text-[#336DFE]">{entry.name}</span>
            </div>
            <span className="font-black text-[#F59E0B]">{entry.value}</span>
          </div>
        ))}
      </div>

      {currentUser ? (
        <div className="rounded-2xl bg-[#DDE5FF] px-4 py-3 text-sm font-bold text-[#336DFE] transition duration-200 group-hover:bg-[#D2DDFF]">
          <div className="flex items-center justify-between gap-3">
            <span>{currentUser.name}</span>
            <span>{currentUser.value}</span>
          </div>
        </div>
      ) : null}
    </SidebarPanel>
  );
};

export default RankingSummaryCard;
