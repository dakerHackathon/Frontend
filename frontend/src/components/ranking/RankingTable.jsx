import AvatarBadge from "./AvatarBadge";
import TemperatureBar from "./TemperatureBar";
import { rankBadgeTones } from "../../pages/rankingPage.constants";

// GitHub 아이콘 — RankingTable 내부 전용 (외부 미노출)
const GithubIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.58 2 12.24C2 16.77 4.87 20.61 8.84 21.97C9.34 22.07 9.52 21.75 9.52 21.48C9.52 21.23 9.51 20.39 9.51 19.5C6.73 20.12 6.14 18.29 6.14 18.29C5.68 17.08 5.03 16.76 5.03 16.76C4.12 16.12 5.1 16.13 5.1 16.13C6.1 16.2 6.64 17.18 6.64 17.18C7.53 18.76 8.97 18.31 9.55 18.04C9.64 17.38 9.89 16.93 10.17 16.67C7.95 16.41 5.62 15.52 5.62 11.56C5.62 10.43 6.01 9.51 6.65 8.79C6.55 8.53 6.2 7.46 6.75 6.01C6.75 6.01 7.59 5.73 9.5 7.06C10.31 6.83 11.18 6.72 12.05 6.72C12.92 6.72 13.79 6.83 14.6 7.06C16.51 5.73 17.35 6.01 17.35 6.01C17.9 7.46 17.55 8.53 17.45 8.79C18.09 9.51 18.48 10.43 18.48 11.56C18.48 15.53 16.14 16.4 13.92 16.67C14.27 16.99 14.58 17.63 14.58 18.61C14.58 20 14.57 21.13 14.57 21.48C14.57 21.75 14.75 22.08 15.26 21.97C19.23 20.61 22.1 16.77 22.1 12.24C22.1 6.58 17.62 2 12 2Z" />
  </svg>
);

// 랭킹 TOP 10 테이블 컴포넌트 — 순위, 닉네임, 온도, 포인트를 표시
const RankingTable = ({ rows }) => (
  <section className="rounded-[30px] border border-slate-200 bg-white px-5 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-8 sm:py-8">
    <div className="border-b border-slate-200 pb-5">
      <h2 className="text-[1.45rem] font-black tracking-tight text-slate-950">랭킹 TOP 10</h2>
    </div>

    <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200">
      <div className="grid grid-cols-[92px_minmax(0,1.5fr)_240px_160px] items-center gap-10 bg-[#F8FAFF] px-6 py-4 text-sm font-black text-slate-700">
        <span className="justify-self-center font-extrabold text-slate-900">순위</span>
        <span className="justify-self-center font-extrabold text-slate-900">닉네임</span>
        <span className="justify-self-center font-extrabold text-slate-900">온도</span>
        <span className="justify-self-center font-extrabold text-slate-900">포인트</span>
      </div>

      <div>
        {rows.map((row) => (
          <div
            key={`${row.rank}-${row.name}`}
            className="grid grid-cols-[92px_minmax(0,1.5fr)_240px_160px] items-center gap-10 border-t border-slate-100 px-6 py-5 text-sm"
          >
            <div className="flex items-center justify-center">
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                  rankBadgeTones[row.rank] ?? "text-slate-700"
                }`}
              >
                {row.rank}
              </span>
            </div>

            <div className="flex min-w-0 items-center justify-center">
              <div className="inline-flex max-w-full items-center justify-center gap-3">
                <div className="shrink-0">
                  <AvatarBadge player={row} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="truncate text-[1rem] font-extrabold leading-none text-slate-900">
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

            <div className="justify-self-center">
              <TemperatureBar value={row.temperature} />
            </div>

            <div className="justify-self-center text-[1rem] font-extrabold text-[#336DFE]">
              {row.points}점
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default RankingTable;
