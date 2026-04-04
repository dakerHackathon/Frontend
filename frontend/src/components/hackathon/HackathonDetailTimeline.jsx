// 타임라인 컴포넌트 (일정 단계별 세로 목록 표시)
const HackathonDetailTimeline = ({ items }) => (
  <div className="space-y-0">
    {items.map((item, index) => (
      <div key={`${item.title}-${item.period}`} className="relative flex gap-4 pb-5 last:pb-0">
        <div className="relative flex w-5 shrink-0 justify-center">
          <span
            className={`relative z-10 mt-1.5 h-3 w-3 rounded-full ${
              item.active ? "bg-[#336DFE]" : "bg-slate-300"
            }`}
          />
          {index !== items.length - 1 ? (
            <span className="absolute top-5 h-[calc(100%-0.25rem)] w-[2px] rounded-full bg-slate-200" />
          ) : null}
        </div>
        <div className="pb-0.5">
          <p className={`text-sm font-bold ${item.active ? "text-[#336DFE]" : "text-slate-700"}`}>
            {item.title}
          </p>
          <p className="mt-1 text-sm text-slate-500">{item.period}</p>
        </div>
      </div>
    ))}
  </div>
);

export default HackathonDetailTimeline;
