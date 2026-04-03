import { useMemo, useState } from "react";
import MiniCalendar from "../components/common/MiniCalendar";
import RankingSidebarCard from "../components/common/RankingSidebarCard";
import RankingTable from "../components/ranking/RankingTable";
import TopThreeCard from "../components/ranking/TopThreeCard";
import { rankingByPeriod, sidebarRankings } from "../mocks/data/ranking";
import { periodTabs } from "./rankingPage.constants";

const RankingPage = () => {
  const [activePeriod, setActivePeriod] = useState("temperature");
  const activeRows = useMemo(
    () =>
      [...(rankingByPeriod[activePeriod] ?? rankingByPeriod.temperature)].sort(
        (left, right) => right.points - left.points,
      ),
    [activePeriod],
  );

  const topThree = activeRows.slice(0, 3);
  const firstPlace = topThree[0] ?? null;
  const secondPlace = topThree[1] ?? null;
  const thirdPlace = topThree[2] ?? null;

  return (
    <div className="min-h-screen bg-[#F3F6FF]">
      <style>{`
        @keyframes rankingTopCardFlip {
          0% {
            opacity: 0;
            transform: perspective(1200px) translateY(24px) scale(0.92) rotateY(var(--ranking-enter-rotate-y));
            filter: blur(3px);
          }
          100% {
            opacity: 1;
            transform: perspective(1200px) translateY(0) scale(1) rotateY(0deg);
            filter: blur(0);
          }
        }
      `}</style>
      <div className="mx-auto flex max-w-[1640px] flex-col gap-8 px-4 py-8 lg:flex-row lg:gap-14 lg:px-8 lg:py-10">
        <aside className="w-full shrink-0 space-y-5 lg:sticky lg:top-28 lg:w-[294px] lg:self-start">
          <MiniCalendar />
          {sidebarRankings.map((ranking) => (
            <RankingSidebarCard key={ranking.title} {...ranking} />
          ))}
        </aside>

        <section className="min-w-0 flex-1 space-y-8">
          <div className="space-y-2 pt-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-[2.6rem]">
              랭킹
            </h1>
          </div>

          <section className="rounded-[30px] border border-slate-200 bg-white px-5 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-8 sm:py-8">
            <div className="flex justify-end">
              <div className="inline-flex rounded-full bg-[#F1F4FB] p-1">
                {periodTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActivePeriod(tab.key)}
                    className={`cursor-pointer rounded-full px-5 py-2 text-sm font-black transition ${
                      activePeriod === tab.key
                        ? "bg-[#336DFE] text-white shadow-[0_10px_24px_rgba(51,109,254,0.22)]"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {firstPlace && secondPlace && thirdPlace ? (
              <div className="mt-14 grid gap-8 xl:grid-cols-[1fr_1.12fr_1fr]">
                <TopThreeCard
                  key={`left-${activePeriod}-${secondPlace.rank}`}
                  player={secondPlace}
                  delay={0}
                  enterRotateY={-120}
                />
                <TopThreeCard
                  key={`center-${activePeriod}-${firstPlace.rank}`}
                  player={firstPlace}
                  highlighted
                  delay={90}
                  enterRotateY={90}
                />
                <TopThreeCard
                  key={`right-${activePeriod}-${thirdPlace.rank}`}
                  player={thirdPlace}
                  delay={180}
                  enterRotateY={120}
                />
              </div>
            ) : null}
          </section>

          <RankingTable
            rows={activeRows}
            title={periodTabs.find((t) => t.key === activePeriod)?.label ?? "랭킹"}
          />
        </section>
      </div>
    </div>
  );
};

export default RankingPage;
