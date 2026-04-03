import BaseInfoCard from "../common/BaseInfoCard";
import PrimaryActionButton from "../common/PrimaryActionButton";
import StatusBadge from "../common/StatusBadge";
import HackathonFavoriteButton from "./HackathonFavoriteButton";

const detailsIcons = {
  period: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current">
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" strokeWidth="1.8" />
      <path d="M7 3.5V7.5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 3.5V7.5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3.5 9.5H20.5" strokeWidth="1.8" />
    </svg>
  ),
  location: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current">
      <path
        d="M12 20C15.5 16.4 18 13.7 18 10.5C18 6.9 15.3 4.5 12 4.5C8.7 4.5 6 6.9 6 10.5C6 13.7 8.5 16.4 12 20Z"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10.5" r="2.3" strokeWidth="1.8" />
    </svg>
  ),
};

const HackathonCard = ({ hackathon, onToggleFavorite, onOpenDetail }) => {
  const details = [
    { key: "period", text: hackathon.period },
    { key: "location", text: hackathon.location },
  ];

  return (
    <div
      role="button"
      tabIndex={0}
      className="outline-none"
      onClick={onOpenDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetail();
        }
      }}
    >
      <BaseInfoCard className="group cursor-pointer space-y-4">
        <div className="relative rounded-2xl bg-slate-200 p-4 transition duration-200 group-hover:bg-[#DCE6FF]">
          <div className="flex items-start justify-between gap-3">
            <StatusBadge
              label={hackathon.statusLabel}
              tone={hackathon.status}
              withDot={hackathon.status === "active"}
            />
            <span className="rounded-lg bg-[#FF3B30] px-3 py-1 text-xs font-black text-white">
              {hackathon.dDay}
            </span>
          </div>
          <div className="mt-16 h-24 rounded-xl bg-gradient-to-br from-white/60 to-white/0 transition duration-200 group-hover:from-white/80" />
          <div className="absolute bottom-3 right-3">
            <HackathonFavoriteButton
              active={hackathon.isStar}
              onToggle={(event) => {
                event.stopPropagation();
                onToggleFavorite();
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 transition duration-200 group-hover:text-[#2458E6]">
            {hackathon.title}
          </h2>
        </div>

        <div className="space-y-2 text-sm text-slate-600 transition duration-200 group-hover:text-slate-700">
          {details.map((detail) => (
            <div key={`${hackathon.id}-${detail.key}`} className="flex items-center gap-2">
              <span className="flex w-10 items-center justify-center text-slate-400">
                {detailsIcons[detail.key]}
              </span>
              <span>{detail.text}</span>
            </div>
          ))}
        </div>

        <PrimaryActionButton
          fullWidth
          onClick={(event) => {
            event.stopPropagation();
            onOpenDetail();
          }}
        >
          상세보기 -&gt;
        </PrimaryActionButton>
      </BaseInfoCard>
    </div>
  );
};

export default HackathonCard;
