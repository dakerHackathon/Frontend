// 즐겨찾기 버튼 컴포넌트 (별 아이콘, 활성/비활성 상태)
const HackathonDetailFavoriteButton = ({ active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition ${
      active
        ? "border-[#F2C14E] bg-[#FFF8E4] text-[#D28A00]"
        : "border-slate-200 bg-white text-slate-500 hover:border-[#F2C14E] hover:text-[#D28A00]"
    }`}
  >
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} className="h-5 w-5">
      <path
        d="M12 3.7L14.6 8.97L20.42 9.82L16.21 13.92L17.2 19.7L12 16.96L6.8 19.7L7.79 13.92L3.58 9.82L9.4 8.97L12 3.7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export default HackathonDetailFavoriteButton;
