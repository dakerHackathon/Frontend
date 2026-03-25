import { useMemo, useState } from "react";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const sideRankingSections = [
  {
    key: "temperature",
    title: "블루밍 온도",
    metric: "온도",
    myScore: "36.5",
    entries: [
      { rank: 1, name: "강석진", value: "43.5" },
      { rank: 2, name: "김현호", value: "41.3" },
      { rank: 3, name: "김민준", value: "39.8" },
    ],
  },
  {
    key: "wins",
    title: "최다 우승",
    metric: "우승",
    myScore: "0회",
    entries: [
      { rank: 1, name: "강석진", value: "8회" },
      { rank: 2, name: "김현호", value: "7회" },
      { rank: 3, name: "김민준", value: "6회" },
    ],
  },
  {
    key: "attendance",
    title: "최다 참여",
    metric: "참여",
    myScore: "2회",
    entries: [
      { rank: 1, name: "강석진", value: "15회" },
      { rank: 2, name: "김현호", value: "14회" },
      { rank: 3, name: "김민준", value: "11회" },
    ],
  },
];

const spotlightCards = [
  { key: "attendance", label: "최다 참여 랭킹" },
  { key: "wins", label: "최다 우승 랭킹" },
  { key: "temperature", label: "온도 랭킹" },
];

const tableTabs = [
  { key: "wins", label: "최다 우승", valueLabel: "우승 횟수" },
  { key: "attendance", label: "최다 참여", valueLabel: "참여 횟수" },
  { key: "temperature", label: "온도 랭킹", valueLabel: "온도" },
];

const rankingRows = {
  wins: [
    { rank: 1, name: "강석진", value: "8회" },
    { rank: 2, name: "김현호", value: "7회" },
    { rank: 3, name: "김민준", value: "4회" },
    { rank: 4, name: "이승제", value: "4회" },
    { rank: 5, name: "김유진", value: "3회" },
    { rank: 6, name: "NicknameA", value: "3회" },
    { rank: 7, name: "NicknameB", value: "2회" },
    { rank: 8, name: "NicknameA", value: "1회" },
  ],
  attendance: [
    { rank: 1, name: "강석진", value: "15회" },
    { rank: 2, name: "김현호", value: "14회" },
    { rank: 3, name: "김민준", value: "11회" },
    { rank: 4, name: "이승제", value: "10회" },
    { rank: 5, name: "김유진", value: "9회" },
    { rank: 6, name: "NicknameA", value: "8회" },
    { rank: 7, name: "NicknameB", value: "7회" },
    { rank: 8, name: "NicknameC", value: "6회" },
  ],
  temperature: [
    { rank: 1, name: "강석진", value: "43.5" },
    { rank: 2, name: "김현호", value: "41.3" },
    { rank: 3, name: "김민준", value: "39.8" },
    { rank: 4, name: "이승제", value: "38.9" },
    { rank: 5, name: "김유진", value: "37.4" },
    { rank: 6, name: "NicknameA", value: "36.8" },
    { rank: 7, name: "NicknameB", value: "35.6" },
    { rank: 8, name: "NicknameC", value: "35.1" },
  ],
};

const medalColors = {
  1: "text-[#FFB547]",
  2: "text-slate-400",
  3: "text-[#D99950]",
};

const buildCalendar = (baseDate) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const days = [];
  const firstWeekday = firstDay.getDay();

  for (let index = firstWeekday - 1; index >= 0; index -= 1) {
    days.push({
      key: `prev-${index}`,
      date: prevLastDay.getDate() - index,
      muted: true,
    });
  }

  for (let date = 1; date <= lastDay.getDate(); date += 1) {
    days.push({
      key: `current-${date}`,
      date,
      muted: false,
      isToday: year === 2026 && month === 2 && date === 24,
    });
  }

  const remainder = (7 - (days.length % 7)) % 7;

  for (let date = 1; date <= remainder; date += 1) {
    days.push({
      key: `next-${date}`,
      date,
      muted: true,
    });
  }

  return days;
};

const getOrdinalLabel = (rank) => {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
};

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

const CalendarArrowButton = ({ direction, onClick }) => (
  <button
    type="button"
    aria-label={direction === "left" ? "이전 달" : "다음 달"}
    onClick={onClick}
    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-white transition hover:bg-white/10"
  >
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`h-4 w-4 ${direction === "right" ? "rotate-180" : ""}`}
    >
      <path
        d="M11.5 5.5L7 10L11.5 14.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

const RankingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));
  const monthLabel = `${currentDate.getMonth() + 1}월`;
  const calendarDays = useMemo(() => buildCalendar(currentDate), [currentDate]);

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.10)]">
      <div className="flex items-center justify-between bg-[#336DFE] px-6 py-5 text-white">
        <CalendarArrowButton
          direction="left"
          onClick={() =>
            setCurrentDate(
              (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1),
            )
          }
        />
        <span className="text-[1.9rem] font-black">{monthLabel}</span>
        <CalendarArrowButton
          direction="right"
          onClick={() =>
            setCurrentDate(
              (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1),
            )
          }
        />
      </div>

      <div className="grid grid-cols-7 gap-y-3 px-5 py-5 text-center">
        {DAYS.map((day) => (
          <span key={day} className="text-sm font-medium text-slate-400">
            {day}
          </span>
        ))}

        {calendarDays.map((day, index) => {
          const isSunday = index % 7 === 0;
          const isSaturday = index % 7 === 6;

          return (
            <span
              key={day.key}
              className={`mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition hover:bg-[#EEF3FF] ${
                day.isToday
                  ? "bg-[#EAF0FF] text-[#336DFE]"
                  : day.muted
                    ? "text-slate-300"
                    : isSunday
                      ? "text-[#EB3B3B]"
                      : isSaturday
                        ? "text-[#336DFE]"
                        : "text-slate-900"
              }`}
            >
              {day.date}
            </span>
          );
        })}
      </div>
    </section>
  );
};

const SidebarRankingCard = ({ title, metric, entries, myScore }) => (
  <section className="rounded-[24px] border border-slate-300 bg-white px-5 py-5 shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
      <h2 className="text-[1.2rem] font-black text-[#336DFE]">{title}</h2>
      <span className="text-sm font-black text-slate-900">{metric}</span>
    </div>

    <div className="space-y-3 py-4">
      {entries.map((entry) => (
        <div
          key={entry.rank}
          className="flex items-center justify-between gap-3 text-xs font-semibold sm:text-sm"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1 leading-none ${medalColors[entry.rank] ?? "text-slate-800"}`}
            >
              <TrophyIcon className="h-4 w-4 shrink-0" />
              <span className="font-black leading-none">{getOrdinalLabel(entry.rank)}</span>
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

    <div className="flex items-center justify-between rounded-2xl bg-[#DDE5FF] px-4 py-3 text-xs font-bold text-[#336DFE] sm:text-sm">
      <div className="flex h-4 items-center gap-1.5">
        <UserIcon className="h-[13px] w-[13px] shrink-0" />
        <span className="leading-none">My NickName·18th</span>
      </div>
      <span className="leading-none">{myScore}</span>
    </div>
  </section>
);

const PodiumIllustration = () => (
  <div className="mx-auto mt-14 flex w-full max-w-[220px] items-end justify-center">
    <div className="relative flex h-10 w-[66px] items-start justify-center bg-[#FFD21E]">
      <UserIcon className="absolute -top-8 h-9 w-9 text-slate-950" />
    </div>
    <div className="relative flex h-[70px] w-[66px] items-start justify-center bg-[#FFD21E]">
      <UserIcon className="absolute -top-9 h-10 w-10 text-slate-950" />
    </div>
    <div className="relative flex h-8 w-[66px] items-start justify-center bg-[#FFD21E]">
      <UserIcon className="absolute -top-8 h-9 w-9 text-slate-950" />
    </div>
  </div>
);

const SpotlightCard = ({ label }) => (
  <article className="rounded-[30px] border border-slate-200 bg-white px-6 py-7 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-8 sm:py-8">
    <h2 className="mb-4 text-center text-[1.55rem] font-black tracking-tight text-[#336DFE] sm:text-[1.75rem]">
      {label}
    </h2>
    <PodiumIllustration />
  </article>
);

const RankingTable = ({ tab, rows, onChangeTab }) => (
  <section className="rounded-[30px] border border-slate-200 bg-white px-5 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-8 sm:py-8 lg:px-10 lg:py-9">
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-slate-200 pb-6 sm:gap-x-8">
      <span className="text-lg font-black text-[#5B6B8C] sm:text-xl">랭킹</span>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
        {tableTabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onChangeTab(item.key)}
            className={`text-lg font-black transition sm:text-xl ${
              item.key === tab ? "text-[#336DFE]" : "text-slate-300 hover:text-slate-500"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>

    <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200">
      <div className="grid grid-cols-[112px_1fr_100px] items-center bg-[#336DFE] px-4 py-4 text-xs font-black text-white sm:grid-cols-[160px_1fr_140px] sm:px-5 sm:text-base lg:grid-cols-[180px_1fr_180px] lg:px-6 lg:text-lg">
        <span />
        <span>닉네임</span>
        <span className="text-center">
          {tableTabs.find((item) => item.key === tab)?.valueLabel}
        </span>
      </div>

      <div>
        {rows.map((row) => (
          <div
            key={`${tab}-${row.rank}-${row.name}`}
            className={`grid grid-cols-[112px_1fr_100px] items-center px-4 py-4 text-xs font-bold sm:grid-cols-[160px_1fr_140px] sm:px-5 sm:text-sm lg:grid-cols-[180px_1fr_180px] lg:px-6 lg:text-lg ${
              row.rank % 2 === 1 ? "bg-[#F5F8FF]" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              {row.rank <= 3 ? (
                <TrophyIcon
                  className={`h-4 w-4 shrink-0 self-center sm:h-5 sm:w-5 ${medalColors[row.rank]}`}
                />
              ) : (
                <span className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              )}
              <span className="text-sm font-black leading-none text-slate-950 sm:text-xl lg:text-[1.45rem]">
                {getOrdinalLabel(row.rank)}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5">
              <UserIcon className="h-[18px] w-[18px] shrink-0 text-[#A7BBFF] sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              <span className="font-black leading-none text-[#336DFE]">{row.name}</span>
            </div>
            <span className="text-center font-black leading-none text-slate-950">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const RankingPage = () => {
  const [activeTab, setActiveTab] = useState("wins");
  const activeRows = useMemo(() => rankingRows[activeTab] ?? rankingRows.wins, [activeTab]);

  return (
    <div className="min-h-screen bg-[#F3F6FF]">
      <div className="mx-auto flex max-w-[1640px] flex-col gap-8 px-4 py-8 lg:flex-row lg:gap-14 lg:px-8 lg:py-10">
        <aside className="w-full shrink-0 space-y-5 lg:sticky lg:top-28 lg:w-[294px] lg:self-start">
          <RankingCalendar />
          {sideRankingSections.map((section) => (
            <SidebarRankingCard key={section.key} {...section} />
          ))}
        </aside>

        <section className="min-w-0 flex-1 space-y-8">
          <div className="space-y-2 pt-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-[2.6rem]">
              랭킹
            </h1>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {spotlightCards.map((card) => (
              <SpotlightCard key={card.key} {...card} />
            ))}
          </div>

          <RankingTable tab={activeTab} rows={activeRows} onChangeTab={setActiveTab} />
        </section>
      </div>
    </div>
  );
};

export default RankingPage;
