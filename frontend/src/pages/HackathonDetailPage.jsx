import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import BaseInfoCard from "../components/common/BaseInfoCard";
import PrimaryActionButton from "../components/common/PrimaryActionButton";
import StatusBadge from "../components/common/StatusBadge";
import { getHackathonBySlug } from "../data/hackathons";

const sectionIconClass = "h-4.5 w-4.5 text-[#336DFE]";
const evaluationColors = ["#4C6FFF", "#2EC5CE", "#FFB84D", "#FF6B8A"];

const iconOverview = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 11V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </svg>
);

const iconClock = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7.8V12L15 13.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

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

const SectionTitle = ({ icon, title, action }) => (
  <div className="mb-5 flex items-center justify-between gap-4">
    <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
      {icon}
      <h2>{title}</h2>
    </div>
    {action}
  </div>
);

const FavoriteButton = ({ active, onClick }) => (
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

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
    <span className="text-sm font-medium text-slate-500">{label}</span>
    <span className="text-right text-sm font-semibold text-slate-800">{value}</span>
  </div>
);

const PrizeCard = ({ item }) => {
  const toneMap = {
    gold: {
      shell: "border-[#F8D88B] bg-[linear-gradient(135deg,#FFF9E6_0%,#FFF1BE_100%)]",
      badge: "bg-[#F5B23A] text-white",
      amount: "text-[#9B6400]",
    },
    silver: {
      shell: "border-[#D5DCEE] bg-[linear-gradient(135deg,#F9FBFF_0%,#E9EFFB_100%)]",
      badge: "bg-[#AAB7D4] text-white",
      amount: "text-[#54657F]",
    },
    bronze: {
      shell: "border-[#E9D3C8] bg-[linear-gradient(135deg,#FFF7F3_0%,#F7E4DA_100%)]",
      badge: "bg-[#C88B68] text-white",
      amount: "text-[#8A5435]",
    },
  };

  const tone = toneMap[item.tone] ?? toneMap.gold;

  return (
    <div className={`rounded-[24px] border p-4 ${tone.shell}`}>
      <span className={`rounded-full px-3 py-1 text-xs font-black ${tone.badge}`}>{item.tier}</span>
      <p className={`mt-5 text-2xl font-black ${tone.amount}`}>{item.amount}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
    </div>
  );
};

const Timeline = ({ items }) => (
  <div className="space-y-0">
    {items.map((item, index) => (
      <div key={`${item.title}-${item.period}`} className="relative flex gap-4 pb-5 last:pb-0">
        <div className="relative flex w-5 shrink-0 justify-center">
          <span
            className={`relative z-10 mt-1.5 h-3 w-3 rounded-full ${
              item.active ? "bg-[#336DFE]" : "bg-slate-300"
            }`}
          />
          {index !== items.length - 1 ? (
            <span className="absolute top-5 h-[calc(100%-0.25rem)] w-[2px] rounded-full bg-slate-200" />
          ) : null}
        </div>
        <div className="pb-0.5">
          <p className={`text-sm font-bold ${item.active ? "text-[#336DFE]" : "text-slate-700"}`}>
            {item.title}
          </p>
          <p className="mt-1 text-sm text-slate-500">{item.period}</p>
        </div>
      </div>
    ))}
  </div>
);

const HackathonDetailPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const hackathon = useMemo(() => getHackathonBySlug(slug), [slug]);
  const [isFavorite, setIsFavorite] = useState(false);
  const backgroundLocation = location.state?.backgroundLocation;

  const closeDetail = () => {
    if (backgroundLocation) {
      navigate(-1);
      return;
    }
    navigate("/hackathons");
  };

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
    };
  }, []);

  if (!hackathon) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(10,16,32,0.42)] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
          <h1 className="text-3xl font-black text-slate-900">해커톤 정보를 찾을 수 없습니다.</h1>
          <p className="mt-4 text-slate-500">목록으로 돌아가 다른 해커톤을 확인해 주세요.</p>
          <div className="mt-8">
            <PrimaryActionButton onClick={closeDetail}>목록으로 돌아가기</PrimaryActionButton>
          </div>
        </div>
      </div>
    );
  }

  const primarySubmission = hackathon.submissions[0];
  const normalizedSubmission = primarySubmission
    ? {
        ...primarySubmission,
        name: primarySubmission.name.includes(".")
          ? `${primarySubmission.name.split(".")[0]}.zip`
          : `${primarySubmission.name}.zip`,
        status: primarySubmission.status,
      }
    : {
        name: "최종 제출본.zip",
        date: "-",
        status: "미제출",
      };

  const normalizedEvaluation = (() => {
    const totalWeight = hackathon.evaluation.reduce((sum, item) => sum + item.weight, 0) || 1;
    const rawItems = hackathon.evaluation.map((item, index) => ({
      ...item,
      normalizedWeight: (item.weight / totalWeight) * 100,
      color: evaluationColors[index % evaluationColors.length],
    }));

    const roundedTotal = rawItems.reduce((sum, item) => sum + Math.round(item.normalizedWeight), 0);
    const diff = 100 - roundedTotal;

    return rawItems.map((item, index) => ({
      ...item,
      displayWeight: Math.round(item.normalizedWeight) + (index === 0 ? diff : 0),
    }));
  })();

  const handleMockDownload = () => {
    if (normalizedSubmission.status !== "제출완료") {
      return;
    }

    const fileContent = [
      `파일명: ${normalizedSubmission.name}`,
      `제출일: ${normalizedSubmission.date}`,
      "",
      "이 파일은 UI 확인용 목업 다운로드입니다.",
    ].join("\n");

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = normalizedSubmission.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(10,16,32,0.42)] backdrop-blur-[1px] px-3 py-6 sm:px-6 sm:py-10"
      onClick={closeDetail}
    >
      <div
        className="mx-auto max-w-[1180px] overflow-hidden rounded-[34px] bg-white shadow-[0_30px_100px_rgba(15,23,42,0.32)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#336DFE] px-3 py-1 text-sm font-bold text-white">
                  {hackathon.dDay}
                </span>
                <StatusBadge
                  label={hackathon.statusLabel}
                  tone={hackathon.status}
                  withDot={hackathon.status === "active"}
                />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-[2rem]">
                  {hackathon.title}
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
                  {hackathon.subtitle}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <button
                type="button"
                aria-label="닫기"
                onClick={closeDetail}
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 stroke-current">
                  <path d="M7 7L17 17" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M17 7L7 17" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
              <FavoriteButton active={isFavorite} onClick={() => setIsFavorite((prev) => !prev)} />
            </div>
          </div>
        </div>

        <div className="bg-[#F5F8FF] px-4 py-4 sm:px-6 sm:py-6">
          <div className="grid gap-5 xl:grid-cols-[1.65fr_0.85fr]">
            <div className="space-y-5">
              <BaseInfoCard className="rounded-[28px] p-6 sm:p-7">
                <SectionTitle icon={iconOverview} title="대회 개요" />
                <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                  {hackathon.summary}
                </p>

                <div className="mt-6 grid gap-6 border-t border-dashed border-slate-200 pt-5 sm:grid-cols-2 sm:gap-20">
                  <InfoRow label="주최" value={hackathon.host} />
                  <InfoRow label="장소" value={hackathon.location} />
                </div>
              </BaseInfoCard>

              <BaseInfoCard className="rounded-[28px] p-6 sm:p-7">
                <SectionTitle icon={iconScore} title="평가 기준" />

                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center">
                  <div className="mx-auto flex w-full max-w-[240px] justify-center">
                    <div className="relative h-[220px] w-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={normalizedEvaluation}
                            dataKey="displayWeight"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            innerRadius={64}
                            outerRadius={98}
                            paddingAngle={3}
                            startAngle={90}
                            endAngle={-270}
                            isAnimationActive
                            animationDuration={700}
                            stroke="none"
                          >
                            {normalizedEvaluation.map((item) => (
                              <Cell key={item.label} fill={item.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                          Weight
                        </span>
                        <span className="mt-2 text-4xl font-black text-slate-950">100%</span>
                        <span className="mt-2 text-xs font-medium text-slate-400">
                          평가 비중 합계
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {normalizedEvaluation.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-slate-100 bg-[#FAFBFF] px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span
                              className="mt-1 inline-flex h-3 w-3 shrink-0 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <div>
                              <p className="text-sm font-bold text-slate-900">{item.label}</p>
                              <p className="mt-1 text-xs font-medium text-slate-400">
                                비중 {item.displayWeight}% · 점수 {item.score}점
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-black" style={{ color: item.color }}>
                            {item.displayWeight}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </BaseInfoCard>

              <div className="grid gap-5 lg:grid-cols-2">
                <BaseInfoCard className="rounded-[28px] p-6">
                  <SectionTitle icon={iconPrize} title="상금" />
                  <p className="text-xl font-black text-slate-900">{hackathon.prize.total}</p>
                  <div className="mt-4 grid gap-3">
                    {hackathon.prize.items.map((item) => (
                      <PrizeCard key={item.tier} item={item} />
                    ))}
                  </div>
                </BaseInfoCard>

                <BaseInfoCard className="rounded-[28px] p-6">
                  <SectionTitle icon={iconTeam} title="팀 현황" />
                  <div className="rounded-2xl bg-[#F7F9FF] px-4 py-4">
                    <p className="text-sm font-medium text-slate-500">현재 등록 팀</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">
                      {hackathon.teams.count}팀
                    </p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {hackathon.teams.items.map((team) => (
                      <div
                        key={team.name}
                        className="rounded-2xl border border-slate-100 px-4 py-4 transition hover:border-[#D6E2FF] hover:bg-[#FBFCFF]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-slate-900">{team.name}</p>
                            <p className="mt-1 text-xs text-slate-500">{team.role}</p>
                          </div>
                          <span className="text-sm font-bold text-[#336DFE]">{team.members}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <PrimaryActionButton fullWidth>팀 만들기 / 참가하기</PrimaryActionButton>
                  </div>
                </BaseInfoCard>
              </div>
            </div>

            <div className="space-y-5">
              <BaseInfoCard className="rounded-[28px] p-6">
                <SectionTitle icon={iconClock} title="주요 일정" />
                <Timeline items={hackathon.schedule} />
              </BaseInfoCard>

              <BaseInfoCard className="rounded-[28px] p-6">
                <SectionTitle
                  icon={iconFile}
                  title="제출물"
                  action={
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#F8FAFF] px-3 py-1 text-xs font-bold text-slate-500">
                        최대 50MB
                      </span>
                      <span className="rounded-full bg-[#F3F6FF] px-3 py-1 text-xs font-bold text-slate-500">
                        {normalizedSubmission.status === "제출완료" ? "1 / 1 완료" : "0 / 1 완료"}
                      </span>
                    </div>
                  }
                />

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {normalizedSubmission.name}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#EEF3FF] px-2.5 py-1 text-[11px] font-black uppercase text-[#336DFE]">
                          zip
                        </span>
                        <p className="text-xs text-slate-400">제출 : {normalizedSubmission.date}</p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          normalizedSubmission.status === "제출완료"
                            ? "bg-[#EEF6FF] text-[#336DFE]"
                            : "bg-[#F4F5F7] text-slate-400"
                        }`}
                      >
                        {normalizedSubmission.status}
                      </span>

                      {normalizedSubmission.status === "제출완료" ? (
                        <button
                          type="button"
                          onClick={handleMockDownload}
                          aria-label={`${normalizedSubmission.name} 다운로드`}
                          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#D6E2FF] bg-[#F8FAFF] text-[#336DFE] transition hover:bg-[#EEF3FF]"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4.5 w-4.5 stroke-current"
                          >
                            <path d="M12 4.5V14.5" strokeWidth="1.8" strokeLinecap="round" />
                            <path
                              d="M8.5 11.5L12 15L15.5 11.5"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path d="M5 18.5H19" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-[#F7F9FF] px-4 py-4">
                  <div className="rounded-2xl bg-white px-4 py-4">
                    <p className="text-xs font-bold text-slate-400">제출 마감</p>
                    <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                      {hackathon.submissionGuide.deadline}
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white px-4 py-4">
                    <p className="text-xs font-bold text-slate-400">제출 가이드</p>
                    <ul className="mt-3 space-y-2">
                      {hackathon.submissionGuide.tips.map((tip) => (
                        <li key={tip} className="flex gap-2 text-sm leading-6 text-slate-600">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#336DFE]" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white px-4 py-4">
                    <label className="block text-sm font-black text-slate-900">메모</label>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      선택 사항입니다. 심사자가 참고하면 좋을 내용을 적어주세요.
                    </p>
                    <textarea
                      rows={3}
                      placeholder={hackathon.submissionGuide.notePlaceholder}
                      className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-[#FAFBFF] px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#336DFE] focus:ring-4 focus:ring-[#E8F0FF]"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <PrimaryActionButton fullWidth>파일 업로드</PrimaryActionButton>
                </div>
              </BaseInfoCard>

              <BaseInfoCard className="rounded-[28px] p-6">
                <SectionTitle icon={iconTeam} title="리더보드" />
                <div className="rounded-2xl bg-[#F7F9FF] px-4 py-4">
                  <div className="space-y-2.5">
                    {hackathon.leaderboard.entries.map((entry) => (
                      <div
                        key={`${entry.rank}-${entry.team}`}
                        className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                              entry.rank === 1
                                ? "bg-[#FFF4D4] text-[#C98A00]"
                                : entry.rank === 2
                                  ? "bg-[#EDF2FA] text-[#6B7D99]"
                                  : entry.rank === 3
                                    ? "bg-[#F8E9E0] text-[#A6653B]"
                                    : "bg-[#EEF3FF] text-[#336DFE]"
                            }`}
                          >
                            {entry.rank}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{entry.team}</p>
                            <p className="text-xs text-slate-400">팀 점수</p>
                          </div>
                        </div>
                        <p className="text-sm font-black text-[#336DFE]">{entry.score}점</p>
                      </div>
                    ))}
                  </div>
                </div>
              </BaseInfoCard>
            </div>
          </div>

          <BaseInfoCard className="mt-5 overflow-hidden rounded-[28px] p-0">
            <div className="overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F8FF_100%)] px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:px-10 sm:py-10">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#5E77C8] sm:text-base">
                    {hackathon.poster.season}
                  </p>
                  <h3 className="mt-4 whitespace-pre-line text-[2.7rem] font-black leading-[0.98] tracking-tight text-[#13377A] sm:text-[4.3rem] xl:text-[5.2rem]">
                    {hackathon.poster.headline}
                  </h3>
                  <p className="mt-6 max-w-3xl text-sm font-semibold leading-7 text-slate-500 sm:text-lg">
                    {hackathon.poster.accent}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                  <p className="text-sm font-black tracking-[0.24em] text-[#336DFE] sm:text-base">
                    {hackathon.poster.brand}
                  </p>
                  <div className="h-16 w-16 rounded-[22px] bg-[linear-gradient(135deg,#336DFE_0%,#6D95FF_100%)] shadow-[0_14px_40px_rgba(51,109,254,0.22)] sm:h-20 sm:w-20" />
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#EAF0FF] px-4 py-2 text-xs font-black text-[#336DFE] sm:px-5 sm:text-sm">
                  {hackathon.dDay}
                </span>
                <span className="rounded-full bg-[#F5F7FB] px-4 py-2 text-xs font-black text-slate-600 sm:px-5 sm:text-sm">
                  {hackathon.period}
                </span>
                <span className="rounded-full bg-[#F5F7FB] px-4 py-2 text-xs font-black text-slate-600 sm:px-5 sm:text-sm">
                  {hackathon.location}
                </span>
              </div>
            </div>
          </BaseInfoCard>
        </div>

        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400">참가 마감까지</p>
                <p className="mt-1 text-sm font-black text-slate-900">{hackathon.dDay} 남음</p>
              </div>
              <PrimaryActionButton onClick={() => {}}>참가 신청하기 -&gt;</PrimaryActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetailPage;
