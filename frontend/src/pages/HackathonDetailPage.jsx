import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Cell, Pie, PieChart } from "recharts";
import BaseInfoCard from "../components/common/BaseInfoCard";
import PrimaryActionButton from "../components/common/PrimaryActionButton";
import StatusBadge from "../components/common/StatusBadge";
import HackathonDetailFavoriteButton from "../components/hackathon/HackathonDetailFavoriteButton";
import HackathonDetailInfoRow from "../components/hackathon/HackathonDetailInfoRow";
import HackathonDetailPrizeCard from "../components/hackathon/HackathonDetailPrizeCard";
import HackathonDetailSectionTitle from "../components/hackathon/HackathonDetailSectionTitle";
import HackathonDetailTimeline from "../components/hackathon/HackathonDetailTimeline";
import { useHackathon } from "../hooks/useHackathon";
import { useTeam } from "../hooks/useTeam";
import {
  evaluationColors,
  iconClock,
  iconFile,
  iconOverview,
  iconPrize,
  iconScore,
  iconTeam,
} from "../components/hackathon/hackathonDetail.constants.jsx";
import {
  getHackathonUserId,
  notifyHackathonSaveUpdated,
  persistHackathonFavoriteState,
} from "../utils/hackathon";

const HackathonDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.backgroundLocation;
  const summaryFromLocation = location.state?.hackathonSummary ?? null;
  const currentUserId = getHackathonUserId();
  const { fetchList, fetchDetail, toggleSave, isLoading, isSaveLoading } = useHackathon();
  const { getLeaderTeams, registerHackathonTeam, isLoading: isTeamActionLoading } = useTeam();
  const [hackathon, setHackathon] = useState(null);
  const [leaderTeams, setLeaderTeams] = useState([]);
  const [isLeaderTeamsLoading, setIsLeaderTeamsLoading] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [registerFeedback, setRegisterFeedback] = useState(null);
  const [detailError, setDetailError] = useState("");
  const [teamActionHint, setTeamActionHint] = useState("");

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

  useEffect(() => {
    let isMounted = true;

    const loadHackathonDetail = async () => {
      let summaryItem = summaryFromLocation;

      // 직접 URL로 들어온 경우에도 목록 응답을 한 번 읽어와 상태/기간/즐겨찾기 정보를 함께 맞춥니다.
      if (!summaryItem) {
        const listResult = await fetchList();
        summaryItem =
          listResult?.data?.items?.find((item) => String(item.id) === String(id)) ?? null;
      }

      const detailResult = await fetchDetail(id, summaryItem);

      if (!isMounted) {
        return;
      }

      if (detailResult?.isSuccess) {
        setHackathon(detailResult.data?.detailView ?? null);
        setDetailError("");
        return;
      }

      setHackathon(null);
      setDetailError(detailResult?.message || "해커톤 상세 정보를 불러오지 못했습니다.");
    };

    loadHackathonDetail();

    return () => {
      isMounted = false;
    };
  }, [fetchDetail, fetchList, id, summaryFromLocation]);

  useEffect(() => {
    let isMounted = true;

    const loadLeaderTeams = async () => {
      if (!currentUserId) {
        if (isMounted) {
          setLeaderTeams([]);
          setSelectedTeamId("");
        }
        return;
      }

      setIsLeaderTeamsLoading(true);
      const result = await getLeaderTeams(currentUserId);

      if (!isMounted) {
        return;
      }

      const teams = result?.data?.teams ?? [];
      if (result?.isSuccess) {
        setLeaderTeams(teams);
        setSelectedTeamId((prev) =>
          prev && teams.some((team) => String(team.teamId) === String(prev))
            ? prev
            : String(teams[0]?.teamId ?? ""),
        );
      } else {
        setLeaderTeams([]);
        setSelectedTeamId("");
      }

      setIsLeaderTeamsLoading(false);
    };

    loadLeaderTeams();

    return () => {
      isMounted = false;
    };
  }, [currentUserId, getLeaderTeams]);

  if (isLoading && !hackathon) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(10,16,32,0.42)] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
          <h1 className="text-3xl font-black text-slate-900">해커톤 정보를 불러오는 중입니다.</h1>
          <p className="mt-4 text-slate-500">잠시만 기다려 주세요.</p>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(10,16,32,0.42)] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
          <h1 className="text-3xl font-black text-slate-900">해커톤 정보를 찾을 수 없습니다.</h1>
          <p className="mt-4 text-slate-500">
            {detailError || "목록으로 돌아가 다른 해커톤을 확인해 주세요."}
          </p>
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

  const isLeaderboardVisible =
    hackathon.status === "closed" && hackathon.leaderboard.entries.length > 0;
  const isLeaderUser = leaderTeams.length > 0;
  const registerButtonDisabled = !currentUserId || !isLeaderUser || isLeaderTeamsLoading;
  const registerButtonLabel = !currentUserId
    ? "로그인 후 참가 가능"
    : isLeaderTeamsLoading
      ? "팀 목록 불러오는 중..."
      : !isLeaderUser
        ? "팀장만 참가 가능"
        : "참가 요청";

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

  const openRegisterModal = () => {
    if (registerButtonDisabled) {
      return;
    }

    setRegisterFeedback(null);
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleRegisterHackathon = async () => {
    if (!currentUserId || !selectedTeamId) {
      setRegisterFeedback({
        type: "error",
        message: "참가 신청할 팀을 선택해 주세요.",
      });
      return;
    }

    const result = await registerHackathonTeam(currentUserId, selectedTeamId, hackathon.id);
    if (result?.isSuccess) {
      setRegisterFeedback({
        type: "success",
        message: "해당 팀으로 해커톤 참가 신청을 완료했습니다.",
      });
      window.setTimeout(() => {
        setIsRegisterModalOpen(false);
      }, 1800);
      return;
    }

    setRegisterFeedback({
      type: "error",
      message: result?.message || "해커톤 참가 신청 중 오류가 발생했습니다.",
    });
  };

  const moveToTeamRecruit = () => {
    navigate(`/teams?searchCategory=hackathon&search=${encodeURIComponent(hackathon.title)}`);
  };

  const handleToggleFavorite = async () => {
    const result = await toggleSave(hackathon.id, currentUserId);

    if (!result?.isSuccess) {
      setRegisterFeedback({
        type: "error",
        message: result?.message || "해커톤 저장 상태를 변경하지 못했습니다.",
      });
      return;
    }

    const nextIsStar = !hackathon.isStar;

    persistHackathonFavoriteState(currentUserId, hackathon.id, nextIsStar);
    setHackathon((prev) => (prev ? { ...prev, isStar: nextIsStar } : prev));
    notifyHackathonSaveUpdated({
      hackathonId: hackathon.id,
      isStar: nextIsStar,
    });
  };

  const registerModal = isRegisterModalOpen
    ? createPortal(
        <div
          className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-[rgba(10,16,32,0.42)] px-4"
          onClick={closeRegisterModal}
        >
          <div
            className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">해커톤 참가 신청</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  팀장을 맡고 있는 팀 중에서 참가 신청할 팀을 선택해 주세요.
                </p>
              </div>
              <button
                type="button"
                onClick={closeRegisterModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="참가 신청 모달 닫기"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 stroke-current">
                  <path d="M7 7L17 17" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M17 7L7 17" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {leaderTeams.map((team) => {
                const isSelected = String(team.teamId) === String(selectedTeamId);

                return (
                  <button
                    key={team.teamId}
                    type="button"
                    onClick={() => setSelectedTeamId(String(team.teamId))}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-[#336DFE] bg-[#EEF4FF] shadow-[0_12px_28px_rgba(51,109,254,0.14)]"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-[#D6E2FF] hover:bg-[#FBFCFF] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] active:translate-y-0"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-black text-slate-900">{team.teamName}</p>
                      <p className="mt-1 text-xs font-medium text-slate-400">
                        팀 ID: {team.teamId}
                      </p>
                    </div>
                    <span
                      className={`inline-flex h-5 w-5 rounded-full border transition ${
                        isSelected
                          ? "border-[#336DFE] bg-[#336DFE]"
                          : "border-slate-300 bg-white"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {registerFeedback ? (
              <p
                className={`mt-4 text-sm font-medium ${
                  registerFeedback.type === "success" ? "text-[#336DFE]" : "text-[#D14343]"
                }`}
              >
                {registerFeedback.message}
              </p>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={closeRegisterModal}
                className="inline-flex h-12 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)] active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleRegisterHackathon}
                disabled={!selectedTeamId || isTeamActionLoading}
                className={`inline-flex h-12 items-center justify-center rounded-2xl px-4 text-sm font-bold transition ${
                  !selectedTeamId || isTeamActionLoading
                    ? "cursor-not-allowed bg-slate-200 text-slate-500"
                    : "cursor-pointer bg-[#336DFE] text-white hover:-translate-y-0.5 hover:bg-[#2458E6] hover:shadow-[0_14px_30px_rgba(51,109,254,0.25)] active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-[#D9E5FF]"
                }`}
              >
                {isTeamActionLoading ? "신청 중..." : "참가 신청"}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;
  const shouldRenderLegacyRegisterModal = false;

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
              <HackathonDetailFavoriteButton
                active={hackathon.isStar}
                onClick={handleToggleFavorite}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#F5F8FF] px-4 py-4 sm:px-6 sm:py-6">
          <div className="grid gap-5 xl:grid-cols-[1.65fr_0.85fr]">
            <div className="space-y-5">
              <BaseInfoCard className="rounded-[28px] p-6 sm:p-7">
                <HackathonDetailSectionTitle icon={iconOverview} title="대회 개요" />
                <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                  {hackathon.summary}
                </p>

                <div className="mt-6 grid gap-6 border-t border-dashed border-slate-200 pt-5 sm:grid-cols-2 sm:gap-20">
                  <HackathonDetailInfoRow label="주최" value={hackathon.host} />
                  <HackathonDetailInfoRow label="장소" value={hackathon.location} />
                </div>
              </BaseInfoCard>

              <BaseInfoCard className="rounded-[28px] p-6 sm:p-7">
                <HackathonDetailSectionTitle icon={iconScore} title="평가 기준" />

                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center">
                  <div className="mx-auto flex w-full max-w-[240px] justify-center">
                    <div className="relative h-[220px] w-[220px]">
                      <PieChart width={220} height={220}>
                        <Pie
                          data={normalizedEvaluation}
                          dataKey="displayWeight"
                          nameKey="label"
                          cx={110}
                          cy={110}
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
                                비중 {item.displayWeight}% · 기준 {item.score}점
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
                <BaseInfoCard className="flex h-full flex-col rounded-[28px] p-6">
                  <HackathonDetailSectionTitle icon={iconPrize} title="상금" />
                  <p className="text-xl font-black text-slate-900">{hackathon.prize.total}</p>
                  <div className="mt-4 grid gap-3">
                    {hackathon.prize.items.map((item) => (
                      <HackathonDetailPrizeCard key={item.tier} item={item} />
                    ))}
                  </div>
                </BaseInfoCard>

                <BaseInfoCard className="flex min-h-[500px] flex-col rounded-[28px] p-6">
                  <HackathonDetailSectionTitle icon={iconTeam} title="팀 현황" />
                  <div className="rounded-2xl bg-[#F7F9FF] px-4 py-4">
                    <p className="text-sm font-medium text-slate-500">내 팀 목록</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">
                      {leaderTeams.length}팀
                    </p>
                  </div>
                  <div className="mt-4 flex-1 space-y-3">
                    {isLeaderTeamsLoading ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm font-medium text-slate-400">
                        팀 목록을 불러오는 중입니다.
                      </div>
                    ) : leaderTeams.length > 0 ? (
                      leaderTeams.map((team) => (
                        <div
                          key={team.teamId}
                          className="rounded-2xl border border-slate-100 px-4 py-4 transition hover:border-[#D6E2FF] hover:bg-[#FBFCFF]"
                        >
                          <p className="text-sm font-black text-slate-900">{team.teamName}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm font-medium text-slate-400">
                        현재 조회되는 팀이 없습니다.
                      </div>
                    )}
                  </div>
                  <div className="mt-auto pt-2">
                    <div className="grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/mypage", {
                            state: {
                              showTeamCreateGuide: true,
                            },
                          })
                        }
                        onMouseEnter={() =>
                          setTeamActionHint("팀 생성을 위해 마이페이지로 이동합니다.")
                        }
                        onMouseLeave={() => setTeamActionHint("")}
                        onFocus={() =>
                          setTeamActionHint("팀 생성을 위해 마이페이지로 이동합니다.")
                        }
                        onBlur={() => setTeamActionHint("")}
                        className="inline-flex h-12 cursor-pointer items-center justify-center rounded-2xl border border-[#D8E4FF] bg-[#F8FAFF] px-4 text-sm font-bold text-[#336DFE] transition hover:border-[#BDD2FF] hover:bg-[#EEF4FF]"
                      >
                        팀 만들기
                      </button>
                      <button
                        type="button"
                        onClick={moveToTeamRecruit}
                        onMouseEnter={() =>
                          setTeamActionHint(
                            "해당 해커톤 팀원 모집 글만 바로 볼 수 있도록 팀원 모집 페이지로 이동합니다.",
                          )
                        }
                        onMouseLeave={() => setTeamActionHint("")}
                        onFocus={() =>
                          setTeamActionHint(
                            "해당 해커톤 팀원 모집 글만 바로 볼 수 있도록 팀원 모집 페이지로 이동합니다.",
                          )
                        }
                        onBlur={() => setTeamActionHint("")}
                        className="inline-flex h-12 cursor-pointer items-center justify-center rounded-2xl bg-[#336DFE] px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2458E6] hover:shadow-[0_14px_30px_rgba(51,109,254,0.25)]"
                      >
                        팀 참가요청
                      </button>
                    </div>
                    <p className="mt-3 min-h-[40px] text-xs font-medium leading-5 text-slate-400">
                      {teamActionHint}
                    </p>
                  </div>
                </BaseInfoCard>
              </div>
            </div>

            <div className="space-y-5">
              <BaseInfoCard className="rounded-[28px] p-6">
                <HackathonDetailSectionTitle icon={iconClock} title="주요 일정" />
                <HackathonDetailTimeline items={hackathon.schedule} />
              </BaseInfoCard>

              <BaseInfoCard className="rounded-[28px] p-6">
                <HackathonDetailSectionTitle
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
                <HackathonDetailSectionTitle icon={iconTeam} title="리더보드" />
                <div className="rounded-2xl bg-[#F7F9FF] px-4 py-4">
                  {isLeaderboardVisible ? (
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
                            </div>
                          </div>
                          <p className="text-sm font-black text-[#336DFE]">
                            {entry.score === null ? `${entry.rank}위` : `${entry.score}점`}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-white px-5 py-6 text-center">
                      <p className="text-base font-black text-slate-900">
                        {hackathon.leaderboard.isPending
                          ? "해커톤이 종료되면 발표됩니다"
                          : "심사중입니다"}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {hackathon.leaderboard.isPending ? (
                          <>
                            아직 리더보드가 공개되지 않았습니다.
                            <br />
                            해커톤 종료 후 순위가 발표됩니다.
                          </>
                        ) : (
                          <>
                            현재 제출물 심사가 진행 중입니다.
                            <br />
                            심사가 완료되면 리더보드 순위가 공개됩니다.
                          </>
                        )}
                      </p>
                    </div>
                  )}
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
              <button
                type="button"
                onClick={openRegisterModal}
                disabled={registerButtonDisabled || isSaveLoading}
                className={`inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-bold transition ${
                  registerButtonDisabled || isSaveLoading
                    ? "cursor-not-allowed bg-slate-200 text-slate-500"
                    : "cursor-pointer bg-[#336DFE] text-white hover:-translate-y-0.5 hover:bg-[#2458E6] hover:shadow-[0_14px_30px_rgba(51,109,254,0.25)]"
                }`}
              >
                {registerButtonLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      {shouldRenderLegacyRegisterModal ? (
        <div
          className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-[rgba(10,16,32,0.42)] px-4"
          onClick={closeRegisterModal}
        >
          <div
            className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">해커톤 참가 신청</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  팀장을 맡고 있는 팀 중에서 참가 신청할 팀을 선택해 주세요.
                </p>
              </div>
              <button
                type="button"
                onClick={closeRegisterModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="참가 신청 모달 닫기"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 stroke-current">
                  <path d="M7 7L17 17" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M17 7L7 17" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {leaderTeams.map((team) => {
                const isSelected = String(team.teamId) === String(selectedTeamId);

                return (
                  <button
                    key={team.teamId}
                    type="button"
                    onClick={() => setSelectedTeamId(String(team.teamId))}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-[#336DFE] bg-[#EEF4FF]"
                        : "border-slate-200 bg-white hover:border-[#D6E2FF] hover:bg-[#FBFCFF]"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-black text-slate-900">{team.teamName}</p>
                      <p className="mt-1 text-xs font-medium text-slate-400">
                        팀 ID: {team.teamId}
                      </p>
                    </div>
                    <span
                      className={`inline-flex h-5 w-5 rounded-full border ${
                        isSelected
                          ? "border-[#336DFE] bg-[#336DFE]"
                          : "border-slate-300 bg-white"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {registerFeedback ? (
              <p
                className={`mt-4 text-sm font-medium ${
                  registerFeedback.type === "success" ? "text-[#336DFE]" : "text-[#D14343]"
                }`}
              >
                {registerFeedback.message}
              </p>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={closeRegisterModal}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleRegisterHackathon}
                disabled={!selectedTeamId || isTeamActionLoading}
                className={`inline-flex h-12 items-center justify-center rounded-2xl px-4 text-sm font-bold transition ${
                  !selectedTeamId || isTeamActionLoading
                    ? "cursor-not-allowed bg-slate-200 text-slate-500"
                    : "cursor-pointer bg-[#336DFE] text-white hover:-translate-y-0.5 hover:bg-[#2458E6] hover:shadow-[0_14px_30px_rgba(51,109,254,0.25)]"
                }`}
              >
                {isTeamActionLoading ? "신청 중..." : "참가 신청"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {registerModal}
    </div>
  );
};

export default HackathonDetailPage;
