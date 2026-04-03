// 트로피 아이콘 — AvatarBadge 내부 전용 (외부 미노출)
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

// 플레이어 아바타 배지 — 순위 1위일 때 트로피 아이콘을 함께 표시
const AvatarBadge = ({ player, large = false }) => (
  <div
    className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br text-white ring-4 ${player.avatar.ring ?? "ring-white"} ${
      large ? "h-24 w-24 text-3xl" : "h-16 w-16 text-xl"
    } ${player.avatar.bg}`}
  >
    <span className="font-black">{player.avatar.initials}</span>
    {player.rank === 1 ? (
      <span className="absolute -right-1 -top-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F2C94C] text-white shadow-lg">
        <TrophyIcon className="h-4 w-4" />
      </span>
    ) : null}
  </div>
);

export default AvatarBadge;
