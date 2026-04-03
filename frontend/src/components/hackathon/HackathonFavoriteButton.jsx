const HackathonFavoriteButton = ({ active, onToggle }) => (
  <button
    type="button"
    aria-label={active ? "즐겨찾기 해제" : "즐겨찾기 추가"}
    aria-pressed={active}
    onClick={onToggle}
    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#F5B23A] transition hover:scale-105 hover:bg-white"
  >
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} className="h-4.5 w-4.5">
      <path
        d="M12 3.7L14.6 8.97L20.42 9.82L16.21 13.92L17.2 19.7L12 16.96L6.8 19.7L7.79 13.92L3.58 9.82L9.4 8.97L12 3.7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export default HackathonFavoriteButton;
