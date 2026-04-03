import { useEffect, useMemo, useState } from "react";
import MiniCalendar from "../components/common/MiniCalendar";

const periodTabs = [
  { key: "weekly", label: "주간" },
  { key: "monthly", label: "월간" },
  { key: "cumulative", label: "누적" },
];

const rankingByPeriod = {
  weekly: [
    {
      rank: 1,
      name: "이민호",
      github: "https://github.com/minho-dev",
      temperature: 96.5,
      points: 142,
      avatar: { initials: "이", bg: "from-slate-900 to-slate-700", ring: "ring-[#F2C94C]" },
    },
    {
      rank: 2,
      name: "박서준",
      github: "https://github.com/seojun-lab",
      temperature: 92.1,
      points: 138,
      avatar: { initials: "박", bg: "from-[#8C6239] to-[#D7B48A]", ring: "ring-[#CFD8E8]" },
    },
    {
      rank: 3,
      name: "남주혁",
      github: null,
      temperature: 88.4,
      points: 125,
      avatar: { initials: "남", bg: "from-[#2A2525] to-[#5B433B]", ring: "ring-[#E2871A]" },
    },
    {
      rank: 4,
      name: "김유정",
      github: "https://github.com/yujeong-kim",
      temperature: 94.0,
      points: 112,
      avatar: { initials: "김", bg: "from-[#8F2D56] to-[#D65D8E]" },
    },
    {
      rank: 5,
      name: "송강",
      github: "https://github.com/songkang-dev",
      temperature: 85.2,
      points: 108,
      avatar: { initials: "송", bg: "from-[#5B7083] to-[#AFC3D6]" },
    },
    {
      rank: 6,
      name: "한지민",
      github: null,
      temperature: 89.9,
      points: 98,
      avatar: { initials: "한", bg: "from-[#3D4E3E] to-[#8AA47B]" },
    },
    {
      rank: 7,
      name: "임윤아",
      github: "https://github.com/yoona-dev",
      temperature: 91.3,
      points: 94,
      avatar: { initials: "임", bg: "from-[#5B6EFF] to-[#9EA9FF]" },
    },
    {
      rank: 8,
      name: "차은우",
      github: null,
      temperature: 97.2,
      points: 89,
      avatar: { initials: "차", bg: "from-[#4E5A67] to-[#A0AFBE]" },
    },
    {
      rank: 9,
      name: "수지",
      github: "https://github.com/suji-lab",
      temperature: 87.5,
      points: 82,
      avatar: { initials: "수", bg: "from-[#006B8F] to-[#48A7C7]" },
    },
    {
      rank: 10,
      name: "박보검",
      github: null,
      temperature: 93.8,
      points: 77,
      avatar: { initials: "박", bg: "from-[#7A4A35] to-[#DAB39F]" },
    },
  ],
  monthly: [
    {
      rank: 1,
      name: "김현호",
      github: "https://github.com/hyunho-dev",
      temperature: 95.2,
      points: 514,
      avatar: { initials: "김", bg: "from-[#1C3D6E] to-[#537FBA]", ring: "ring-[#F2C94C]" },
    },
    {
      rank: 2,
      name: "강석진",
      github: "https://github.com/seokjin-dev",
      temperature: 93.8,
      points: 498,
      avatar: { initials: "강", bg: "from-[#765D45] to-[#C5A180]", ring: "ring-[#CFD8E8]" },
    },
    {
      rank: 3,
      name: "김민준",
      github: null,
      temperature: 89.2,
      points: 472,
      avatar: { initials: "김", bg: "from-[#362525] to-[#6F5353]", ring: "ring-[#E2871A]" },
    },
    {
      rank: 4,
      name: "이승제",
      github: "https://github.com/seungje-lab",
      temperature: 90.4,
      points: 455,
      avatar: { initials: "이", bg: "from-[#744A77] to-[#B784BE]" },
    },
    {
      rank: 5,
      name: "김유진",
      github: null,
      temperature: 87.6,
      points: 432,
      avatar: { initials: "김", bg: "from-[#495E34] to-[#9FBC80]" },
    },
    {
      rank: 6,
      name: "정우성",
      github: "https://github.com/woosung-dev",
      temperature: 91.7,
      points: 420,
      avatar: { initials: "정", bg: "from-[#39424E] to-[#7D90A5]" },
    },
    {
      rank: 7,
      name: "유인나",
      github: "https://github.com/inna-yu",
      temperature: 88.1,
      points: 408,
      avatar: { initials: "유", bg: "from-[#7757A4] to-[#B49CDA]" },
    },
    {
      rank: 8,
      name: "주지훈",
      github: null,
      temperature: 86.9,
      points: 401,
      avatar: { initials: "주", bg: "from-[#5F5E5A] to-[#B7B6B0]" },
    },
    {
      rank: 9,
      name: "배수지",
      github: "https://github.com/bae-suji",
      temperature: 90.9,
      points: 388,
      avatar: { initials: "배", bg: "from-[#0E738A] to-[#63C2D6]" },
    },
    {
      rank: 10,
      name: "최민우",
      github: null,
      temperature: 85.4,
      points: 375,
      avatar: { initials: "최", bg: "from-[#6E4A2A] to-[#C7A27D]" },
    },
  ],
  cumulative: [
    {
      rank: 1,
      name: "강석진",
      github: "https://github.com/seokjin-dev",
      temperature: 98.2,
      points: 1280,
      avatar: { initials: "강", bg: "from-[#14213D] to-[#4361EE]", ring: "ring-[#F2C94C]" },
    },
    {
      rank: 2,
      name: "김현호",
      github: "https://github.com/hyunho-dev",
      temperature: 96.7,
      points: 1214,
      avatar: { initials: "김", bg: "from-[#8A5C2B] to-[#E7BD8C]", ring: "ring-[#CFD8E8]" },
    },
    {
      rank: 3,
      name: "김민준",
      github: null,
      temperature: 94.3,
      points: 1176,
      avatar: { initials: "김", bg: "from-[#2D2025] to-[#7C5E67]", ring: "ring-[#E2871A]" },
    },
    {
      rank: 4,
      name: "이승제",
      github: "https://github.com/seungje-lab",
      temperature: 92.4,
      points: 1108,
      avatar: { initials: "이", bg: "from-[#5B3B6A] to-[#AE8CC3]" },
    },
    {
      rank: 5,
      name: "김유진",
      github: null,
      temperature: 91.2,
      points: 1060,
      avatar: { initials: "김", bg: "from-[#425534] to-[#8FB174]" },
    },
    {
      rank: 6,
      name: "임윤아",
      github: "https://github.com/yoona-dev",
      temperature: 95.8,
      points: 1002,
      avatar: { initials: "임", bg: "from-[#5C68E8] to-[#B0B8FF]" },
    },
    {
      rank: 7,
      name: "한지민",
      github: null,
      temperature: 90.5,
      points: 978,
      avatar: { initials: "한", bg: "from-[#3D4E3E] to-[#8AA47B]" },
    },
    {
      rank: 8,
      name: "차은우",
      github: null,
      temperature: 97.6,
      points: 956,
      avatar: { initials: "차", bg: "from-[#4E5A67] to-[#A0AFBE]" },
    },
    {
      rank: 9,
      name: "배수지",
      github: "https://github.com/bae-suji",
      temperature: 93.1,
      points: 921,
      avatar: { initials: "배", bg: "from-[#006B8F] to-[#48A7C7]" },
    },
    {
      rank: 10,
      name: "박보검",
      github: null,
      temperature: 92.6,
      points: 905,
      avatar: { initials: "박", bg: "from-[#7A4A35] to-[#DAB39F]" },
    },
  ],
};

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

const medalTones = {
  1: {
    ring: "ring-[#F2C94C]",
    line: "bg-[#F2C94C]",
    badge: "bg-[#F2C94C] text-white",
    card: "bg-[#EEF3FF]",
  },
  2: {
    ring: "ring-[#CFD8E8]",
    line: "bg-[#CFD8E8]",
    badge: "bg-[#CFD8E8] text-slate-700",
    card: "bg-white",
  },
  3: {
    ring: "ring-[#E2871A]",
    line: "bg-[#E2871A]",
    badge: "bg-[#E2871A] text-white",
    card: "bg-white",
  },
};

const rankBadgeTones = {
  1: "bg-[#F2C94C] text-white",
  2: "bg-[#CFD8E8] text-slate-700",
  3: "bg-[#E2871A] text-white",
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

const GithubIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.58 2 12.24C2 16.77 4.87 20.61 8.84 21.97C9.34 22.07 9.52 21.75 9.52 21.48C9.52 21.23 9.51 20.39 9.51 19.5C6.73 20.12 6.14 18.29 6.14 18.29C5.68 17.08 5.03 16.76 5.03 16.76C4.12 16.12 5.1 16.13 5.1 16.13C6.1 16.2 6.64 17.18 6.64 17.18C7.53 18.76 8.97 18.31 9.55 18.04C9.64 17.38 9.89 16.93 10.17 16.67C7.95 16.41 5.62 15.52 5.62 11.56C5.62 10.43 6.01 9.51 6.65 8.79C6.55 8.53 6.2 7.46 6.75 6.01C6.75 6.01 7.59 5.73 9.5 7.06C10.31 6.83 11.18 6.72 12.05 6.72C12.92 6.72 13.79 6.83 14.6 7.06C16.51 5.73 17.35 6.01 17.35 6.01C17.9 7.46 17.55 8.53 17.45 8.79C18.09 9.51 18.48 10.43 18.48 11.56C18.48 15.53 16.14 16.4 13.92 16.67C14.27 16.99 14.58 17.63 14.58 18.61C14.58 20 14.57 21.13 14.57 21.48C14.57 21.75 14.75 22.08 15.26 21.97C19.23 20.61 22.1 16.77 22.1 12.24C22.1 6.58 17.62 2 12 2Z" />
  </svg>
);

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
            <span className="inline-flex items-center gap-1 leading-none text-slate-800">
              <TrophyIcon className="h-4 w-4 shrink-0" />
              <span className="font-black leading-none">{entry.rank}위</span>
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

const TopThreeCard = ({
  player,
  highlighted = false,
  visible = false,
  delay = 0,
  enterRotateY = 0,
}) => {
  const tone = medalTones[player.rank];

  return (
    <article
      className={`relative overflow-visible rounded-[30px] border border-slate-200 px-6 pb-8 pt-16 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ${tone.card} ${
        highlighted ? "xl:translate-y-0" : ""
      } transition-[transform,opacity,filter] duration-700 ease-out`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible
          ? "perspective(1200px) translateY(0) scale(1) rotateY(0deg)"
          : `perspective(1200px) translateY(24px) scale(0.92) rotateY(${enterRotateY}deg)`,
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        backfaceVisibility: "hidden",
        filter: visible ? "blur(0px)" : "blur(3px)",
      }}
    >
      <div className={`absolute left-0 right-0 top-0 h-1 rounded-t-[30px] ${tone.line}`} />

      <div className="flex justify-center">
        <div className="-mt-[5.5rem] mb-4">
          <AvatarBadge player={player} large={highlighted} />
        </div>
      </div>

      <div className="text-center">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${tone.badge}`}>
          Rank {player.rank}
        </span>
        <h3 className="mt-3 text-[1.7rem] font-black text-slate-950">{player.name}</h3>
        <p className="mt-4 text-[1.9rem] font-black text-[#336DFE]">{player.points}</p>
        <p className="mt-1 text-sm font-semibold italic text-slate-400">Points</p>
      </div>
    </article>
  );
};

const TemperatureBar = ({ value }) => (
  <div className="flex items-center gap-4">
    <div className="h-2.5 w-28 overflow-hidden rounded-full bg-[#E5ECFF]">
      <div
        className="h-full rounded-full bg-[#336DFE]"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
    <span className="min-w-[64px] text-sm font-bold text-slate-700">{value.toFixed(1)}°C</span>
  </div>
);

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
                    <div
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#336DFE]"
                      aria-label={`GitHub Empty`}
                    ></div>
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

const RankingPage = () => {
  const [activePeriod, setActivePeriod] = useState("weekly");
  const [topCardsVisible, setTopCardsVisible] = useState(false);
  const [animationSeed, setAnimationSeed] = useState(0);
  const activeRows = useMemo(
    () =>
      [...(rankingByPeriod[activePeriod] ?? rankingByPeriod.weekly)].sort(
        (left, right) => right.points - left.points,
      ),
    [activePeriod],
  );
  const topThree = activeRows.slice(0, 3);

  useEffect(() => {
    setTopCardsVisible(false);
    setAnimationSeed((seed) => seed + 1);
    let timeoutId;
    const frame = window.requestAnimationFrame(() => {
      timeoutId = window.setTimeout(() => {
        setTopCardsVisible(true);
      }, 40);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [activePeriod]);

  return (
    <div className="min-h-screen bg-[#F3F6FF]">
      <div className="mx-auto flex max-w-[1640px] flex-col gap-8 px-4 py-8 lg:flex-row lg:gap-14 lg:px-8 lg:py-10">
        <aside className="w-full shrink-0 space-y-5 lg:sticky lg:top-28 lg:w-[294px] lg:self-start">
          <MiniCalendar />
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

            <div className="mt-14 grid gap-8 xl:grid-cols-[1fr_1.12fr_1fr]">
              <TopThreeCard
                key={`left-${activePeriod}-${animationSeed}-${topThree[1].rank}`}
                player={topThree[1]}
                visible={topCardsVisible}
                delay={0}
                enterRotateY={-120}
              />
              <TopThreeCard
                key={`center-${activePeriod}-${animationSeed}-${topThree[0].rank}`}
                player={topThree[0]}
                highlighted
                visible={topCardsVisible}
                delay={90}
                enterRotateY={90}
              />
              <TopThreeCard
                key={`right-${activePeriod}-${animationSeed}-${topThree[2].rank}`}
                player={topThree[2]}
                visible={topCardsVisible}
                delay={180}
                enterRotateY={120}
              />
            </div>
          </section>

          <RankingTable rows={activeRows} />
        </section>
      </div>
    </div>
  );
};

export default RankingPage;
