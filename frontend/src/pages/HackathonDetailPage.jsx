import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BaseInfoCard from "../components/common/BaseInfoCard";
import PrimaryActionButton from "../components/common/PrimaryActionButton";
import StatusBadge from "../components/common/StatusBadge";
import { getHackathonBySlug } from "../data/hackathons";

const sectionIconClass = "h-4.5 w-4.5 text-[#336DFE]";

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
    className={`inline-flex h-12 items-center justify-center rounded-2xl border px-4 transition ${
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
      icon: "text-[#E3A11B]",
    },
    silver: {
      shell: "border-[#D5DCEE] bg-[linear-gradient(135deg,#F9FBFF_0%,#E9EFFB_100%)]",
      badge: "bg-[#AAB7D4] text-white",
      amount: "text-[#54657F]",
      icon: "text-[#7D91B4]",
    },
    bronze: {
      shell: "border-[#E9D3C8] bg-[linear-gradient(135deg,#FFF7F3_0%,#F7E4DA_100%)]",
      badge: "bg-[#C88B68] text-white",
      amount: "text-[#8A5435]",
      icon: "text-[#B46D47]",
    },
  };

  const tone = toneMap[item.tone];

  return (
    <div className={`rounded-[24px] border p-4 ${tone.shell}`}>
      <div className="flex items-start justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-black ${tone.badge}`}>{item.tier}</span>
        <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 ${tone.icon}`}>
          <path d="M8 4.5H16V8C16 10.2 14.2 12 12 12C9.8 12 8 10.2 8 8V4.5Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M10 12.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14 12.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 18.5H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <p className={`mt-5 text-2xl font-black ${tone.amount}`}>{item.amount}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
    </div>
  );
};

const iconClock = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7.8V12L15 13.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const iconOverview = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 11V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </svg>
);

const iconScore = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <path d="M5 18.5H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M7 15L10 11L13 13L17 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="17" cy="7.5" r="1.1" fill="currentColor" />
  </svg>
);

const iconFile = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <path d="M8 4.5H14L18 8.5V18.5C18 19.6 17.1 20.5 16 20.5H8C6.9 20.5 6 19.6 6 18.5V6.5C6 5.4 6.9 4.5 8 4.5Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M14 4.5V8.5H18" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const iconTeam = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="16" cy="10.5" r="2.1" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4.5 18.5C5.1 15.9 7 14.5 9.5 14.5C12 14.5 13.9 15.9 14.5 18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14.7 17.4C15.1 15.8 16.3 14.8 17.9 14.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const iconPrize = (
  <svg viewBox="0 0 24 24" fill="none" className={sectionIconClass}>
    <path d="M8 4.5H16V8C16 10.2 14.2 12 12 12C9.8 12 8 10.2 8 8V4.5Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M10 12.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14 12.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 18.5H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M6 5.5H8V7C8 8.1 7.1 9 6 9H5V6.5C5 5.9 5.4 5.5 6 5.5Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M18 5.5H16V7C16 8.1 16.9 9 18 9H19V6.5C19 5.9 18.6 5.5 18 5.5Z" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const HackathonDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const hackathon = useMemo(() => getHackathonBySlug(slug), [slug]);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-[#0F172A]/80 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
          <h1 className="text-3xl font-black text-slate-900">해커톤 정보를 찾을 수 없습니다.</h1>
          <p className="mt-4 text-slate-500">목록으로 돌아가서 다른 해커톤을 확인해 주세요.</p>
          <div className="mt-8">
            <PrimaryActionButton onClick={() => navigate("/hackathons")}>목록으로 돌아가기</PrimaryActionButton>
          </div>
        </div>
      </div>
    );
  }

  const completedSubmissions = hackathon.submissions.filter(
    (item) => item.status === "제출완료",
  ).length;

  return (
    <div
      className="min-h-screen bg-[rgba(10,16,32,0.78)] px-3 py-6 sm:px-6 sm:py-10"
      onClick={() => navigate("/hackathons")}
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

            <button
              type="button"
              aria-label="닫기"
              onClick={() => navigate("/hackathons")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 stroke-current">
                <path d="M7 7L17 17" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M17 7L7 17" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-[#F5F8FF] px-4 py-4 sm:px-6 sm:py-6">
          <div className="grid gap-5 xl:grid-cols-[1.65fr_0.85fr]">
            <div className="space-y-5">
              <BaseInfoCard className="rounded-[28px] p-6 sm:p-7">
                <SectionTitle icon={iconOverview} title="대회 개요" />
                <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">{hackathon.summary}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {hackathon.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#EEF3FF] px-3 py-1 text-xs font-bold text-[#336DFE]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 border-t border-dashed border-slate-200 pt-5 sm:grid-cols-2">
                  <InfoRow label="주최" value={hackathon.host} />
                  <InfoRow label="장소" value={hackathon.location} />
                </div>
              </BaseInfoCard>

              <BaseInfoCard className="rounded-[28px] p-6 sm:p-7">
                <SectionTitle
                  icon={iconScore}
                  title="평가 기준"
                  action={
                    <button
                      type="button"
                      className="rounded-xl border border-[#C9D8FF] px-3 py-2 text-xs font-bold text-[#336DFE] transition hover:bg-[#EEF3FF]"
                    >
                      심사 보기
                    </button>
                  }
                />

                <div className="space-y-5">
                  {hackathon.evaluation.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.label}</p>
                          <p className="text-xs font-medium text-slate-400">({item.weight}%)</p>
                        </div>
                        <span className="text-sm font-black text-[#336DFE]">{item.score}점</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#E7EEFF]">
                        <div
                          className="h-2 rounded-full bg-[#336DFE]"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-[#F2F6FF] px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-slate-500">{hackathon.leaderboard.note}</p>
                    <p className="text-3xl font-black leading-none text-[#336DFE]">
                      {hackathon.leaderboard.average}
                      <span className="ml-1 text-base font-bold text-slate-400">/ 100</span>
                    </p>
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
                    <p className="mt-2 text-3xl font-black text-slate-900">{hackathon.teams.count}팀</p>
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
                <div className="space-y-4">
                  {hackathon.schedule.map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <span
                        className={`mt-1 h-3 w-3 rounded-full ${
                          item.active ? "bg-[#336DFE]" : "bg-slate-300"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm font-bold ${
                            item.active ? "text-[#336DFE]" : "text-slate-700"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{item.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </BaseInfoCard>

              <BaseInfoCard className="rounded-[28px] p-6">
                <SectionTitle
                  icon={iconFile}
                  title="제출물"
                  action={
                    <span className="rounded-full bg-[#F3F6FF] px-3 py-1 text-xs font-bold text-slate-500">
                      {completedSubmissions} / {hackathon.submissions.length} 완료
                    </span>
                  }
                />
                <div className="space-y-3">
                  {hackathon.submissions.map((submission) => (
                    <div
                      key={submission.name}
                      className="rounded-2xl border border-slate-100 bg-white px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{submission.name}</p>
                          <p className="mt-1 text-xs text-slate-400">{submission.date}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            submission.status === "제출완료"
                              ? "bg-[#EEF6FF] text-[#336DFE]"
                              : "bg-[#F4F5F7] text-slate-400"
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <PrimaryActionButton fullWidth>파일 업로드</PrimaryActionButton>
                </div>
              </BaseInfoCard>

              <BaseInfoCard className="rounded-[28px] p-6">
                <SectionTitle icon={iconTeam} title="리더보드 / 참가 안내" />
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl bg-[#F7F9FF] px-4 py-4">
                    현재 이 해커톤은 팀 생성, 제출, 리더보드 확인이 가능한 구조로 설계되어 있습니다.
                  </div>
                  <div className="rounded-2xl bg-[#F7F9FF] px-4 py-4">
                    팀 리더는 팀원을 초대하거나 탈퇴를 관리하고, 제출 섹션에서 안내 문구와 파일 업로드를 확인할 수 있습니다.
                  </div>
                </div>
              </BaseInfoCard>
            </div>
          </div>

          <BaseInfoCard className="mt-5 overflow-hidden rounded-[28px] p-0">
            <div className="border-b border-slate-100 px-6 py-5">
              <SectionTitle icon={iconOverview} title="해커톤 포스터" />
            </div>
            <div className="p-5 sm:p-6">
              <div className="overflow-hidden rounded-[30px] border border-[#DCE6FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F8FF_100%)] px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:px-10 sm:py-10">
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
            </div>
          </BaseInfoCard>
        </div>

        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <FavoriteButton active={isFavorite} onClick={() => setIsFavorite((prev) => !prev)} />
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                문의하기
              </button>
            </div>

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
