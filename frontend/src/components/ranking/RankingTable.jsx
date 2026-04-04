import AvatarBadge from "./AvatarBadge";
import TemperatureBar from "./TemperatureBar";
import { rankBadgeTones } from "../../pages/rankingPage.constants";

// GitHub 아이콘 — RankingTable 내부 전용 (외부 미노출)
const GithubIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.58 2 12.24C2 16.77 4.87 20.61 8.84 21.97C9.34 22.07 9.52 21.75 9.52 21.48C9.52 21.23 9.51 20.39 9.51 19.5C6.73 20.12 6.14 18.29 6.14 18.29C5.68 17.08 5.03 16.76 5.03 16.76C4.12 16.12 5.1 16.13 5.1 16.13C6.1 16.2 6.64 17.18 6.64 17.18C7.53 18.76 8.97 18.31 9.55 18.04C9.64 17.38 9.89 16.93 10.17 16.67C7.95 16.41 5.62 15.52 5.62 11.56C5.62 10.43 6.01 9.51 6.65 8.79C6.55 8.53 6.2 7.46 6.75 6.01C6.75 6.01 7.59 5.73 9.5 7.06C10.31 6.83 11.18 6.72 12.05 6.72C12.92 6.72 13.79 6.83 14.6 7.06C16.51 5.73 17.35 6.01 17.35 6.01C17.9 7.46 17.55 8.53 17.45 8.79C18.09 9.51 18.48 10.43 18.48 11.56C18.48 15.53 16.14 16.4 13.92 16.67C14.27 16.99 14.58 17.63 14.58 18.61C14.58 20 14.57 21.13 14.57 21.48C14.57 21.75 14.75 22.08 15.26 21.97C19.23 20.61 22.1 16.77 22.1 12.24C22.1 6.58 17.62 2 12 2Z" />
  </svg>
);

const formatRankingValue = (value, suffix = "") => `${Number(value).toLocaleString("ko-KR")}${suffix}`;

const isSameRankingUser = (row, currentUser) => {
  if (!row || !currentUser) {
    return false;
  }

  if (row.id && currentUser.id) {
    return String(row.id) === String(currentUser.id);
  }

  if (row.github && currentUser.github) {
    return row.github === currentUser.github;
  }

  return row.name === currentUser.name;
};

const RankingRow = ({ row, highlighted = false, showTemperature = false }) => (
  <div
    className={`grid gap-5 px-5 py-5 text-sm sm:px-6 ${
      showTemperature
        ? "md:grid-cols-[72px_minmax(0,1.6fr)_minmax(180px,280px)] lg:grid-cols-[92px_minmax(0,1.9fr)_320px]"
        : "md:grid-cols-[72px_minmax(0,1.35fr)_120px] lg:grid-cols-[92px_minmax(0,1.6fr)_160px]"
    } md:items-center md:gap-6 lg:gap-10 ${
      highlighted ? "bg-[#F8FAFF]" : ""
    }`}
  >
    <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 md:flex md:justify-center">
      <span className="text-sm font-black tracking-[0.04em] whitespace-nowrap text-slate-400 md:hidden">
        순위
      </span>
      <span
        className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-base font-black md:h-9 md:w-9 md:text-sm ${
          rankBadgeTones[row.rank] ?? "text-slate-700"
        }`}
      >
        {row.rank}
      </span>
    </div>

    <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 md:flex md:min-w-0 md:justify-center">
      <span className="text-sm font-black tracking-[0.04em] whitespace-nowrap text-slate-400 md:hidden">
        닉네임
      </span>
      <div className="inline-flex max-w-full items-center gap-3 md:justify-center">
        <div className="shrink-0">
          <AvatarBadge player={row} />
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[1.35rem] font-extrabold leading-none text-slate-900 md:text-[1rem]">
            {row.name}
          </span>
          {row.github ? (
            <a
              href={row.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEF3FF] text-[#336DFE] transition hover:bg-[#336DFE] hover:text-white"
              aria-label={`${row.name} GitHub`}
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          ) : (
            <div className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full" />
          )}
        </div>
      </div>
    </div>

    {showTemperature ? (
      <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 md:flex md:justify-self-center">
        <span className="text-sm font-black tracking-[0.04em] whitespace-nowrap text-slate-400 md:hidden">
          온도
        </span>
        <TemperatureBar value={row.temperature} />
      </div>
    ) : null}

    {!showTemperature ? (
      <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 md:flex md:justify-self-center">
        <span className="text-sm font-black tracking-[0.04em] whitespace-nowrap text-slate-400 md:hidden">
          {row.valueLabel ?? "포인트"}
        </span>
        <div className="text-left text-[1.6rem] font-extrabold text-[#336DFE] md:text-[1rem]">
          {formatRankingValue(row.points, row.valueSuffix)}
        </div>
      </div>
    ) : null}
  </div>
);

// 랭킹 TOP 10 테이블 컴포넌트 — 순위, 닉네임, 온도, 포인트를 표시
const RankingTable = ({
  rows,
  title,
  currentUser,
  showTemperature = false,
  valueLabel = "포인트",
}) => {
  const matchedCurrentUserRow = currentUser
    ? rows.find((row) => isSameRankingUser(row, currentUser))
    : null;
  const shouldShowSeparatedCurrentUser = Boolean(currentUser && !matchedCurrentUserRow);

  return (
    <section className="rounded-[30px] border border-slate-200 bg-white px-5 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-8 sm:py-8">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-[1.45rem] font-black tracking-tight text-slate-950">{title} TOP 10</h2>
      </div>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200">
        <div
          className={`hidden bg-[#F8FAFF] px-6 py-4 text-sm font-black text-slate-700 md:grid md:items-center md:gap-6 lg:gap-10 ${
            showTemperature
              ? "md:grid-cols-[72px_minmax(0,1.6fr)_minmax(180px,280px)] lg:grid-cols-[92px_minmax(0,1.9fr)_320px]"
              : "md:grid-cols-[72px_minmax(0,1.35fr)_120px] lg:grid-cols-[92px_minmax(0,1.6fr)_160px]"
          }`}
        >
          <span className="justify-self-center font-extrabold text-slate-900">순위</span>
          <span className="justify-self-center font-extrabold text-slate-900">닉네임</span>
          {showTemperature ? (
            <span className="justify-self-center font-extrabold text-slate-900">온도</span>
          ) : (
            <span className="justify-self-center font-extrabold text-slate-900">{valueLabel}</span>
          )}
        </div>

        <div>
          {rows.map((row) => (
            <div key={`${row.rank}-${row.name}`} className="border-t border-slate-100">
              <RankingRow
                row={row}
                highlighted={Boolean(matchedCurrentUserRow && isSameRankingUser(row, currentUser))}
                showTemperature={showTemperature}
              />
            </div>
          ))}

          {shouldShowSeparatedCurrentUser ? (
            <div className="border-t border-slate-100">
              <div className="flex items-center justify-center px-6 py-4 text-lg font-black tracking-[0.2em] text-slate-300">
                ...
              </div>
              <div className="border-t border-dashed border-slate-200">
                <RankingRow row={currentUser} highlighted showTemperature={showTemperature} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default RankingTable;
