// 섹션 아이콘 공통 클래스
const sectionIconClass = "h-4.5 w-4.5 text-[#336DFE]";

// 평가 항목 색상 목록
const evaluationColors = ["#4C6FFF", "#2EC5CE", "#FFB84D", "#FF6B8A"];

// 대회 개요 섹션 아이콘
const iconOverview = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 11V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </svg>
);

// 일정 섹션 아이콘
const iconClock = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7.8V12L15 13.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 평가 기준 섹션 아이콘
const iconScore = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <path d="M5 18.5H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M7 15L10 11L13 13L17 7.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="17" cy="7.5" r="1.1" fill="currentColor" />
  </svg>
);

// 상금 섹션 아이콘
const iconPrize = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <path
      d="M8 4.5H16V8C16 10.2 14.2 12 12 12C9.8 12 8 10.2 8 8V4.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path d="M10 12.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14 12.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 18.5H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 제출물 섹션 아이콘
const iconFile = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <path
      d="M8 4.5H14L18 8.5V18.5C18 19.6 17.1 20.5 16 20.5H8C6.9 20.5 6 19.6 6 18.5V6.5C6 5.4 6.9 4.5 8 4.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path d="M14 4.5V8.5H18" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

// 팀 현황 / 리더보드 섹션 아이콘
const iconTeam = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="16" cy="10.5" r="2.1" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M4.5 18.5C5.1 15.9 7 14.5 9.5 14.5C12 14.5 13.9 15.9 14.5 18.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M14.7 17.4C15.1 15.8 16.3 14.8 17.9 14.6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export { sectionIconClass, evaluationColors, iconOverview, iconClock, iconScore, iconPrize, iconFile, iconTeam };
