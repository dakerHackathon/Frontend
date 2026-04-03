import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseInfoCard from "../components/common/BaseInfoCard";
import PrimaryActionButton from "../components/common/PrimaryActionButton";
import { useRecruit } from "../hooks/useRecruit";
import { validateRecruitCreateForm } from "../utils/recruit";

const TEAM_MAX_MEMBERS = 5;

const statusOptions = [
  { value: "open", label: "모집중", dotTone: "active" },
  { value: "closed", label: "마감", dotTone: "closed" },
];

const myTeams = [
  {
    id: 1,
    name: "#336DFE",
    hackathonName: "AI 아이디어톤 2026",
  },
  {
    id: 2,
    name: "#BloomUp",
    hackathonName: "캠퍼스 창업톤 2026",
  },
  {
    id: 3,
    name: "#Nebula",
    hackathonName: "부산 빅데이터톤 2026",
  },
];

const tagOptions = ["FE", "BE", "AI", "DB", "DESIGNER"];

const tagColorMap = {
  FE: "bg-[#2A3FFF] text-white",
  BE: "bg-[#4CD137] text-white",
  AI: "bg-[#666666] text-white",
  DB: "bg-[#FFB547] text-white",
  DESIGNER: "bg-[#FF7AB6] text-white",
};

const toneDotClass = {
  active: "bg-[#28C840]",
  closed: "bg-[#EB3B3B]",
};

const positionDisplayLabel = {
  FE: "프론트엔드",
  BE: "백엔드",
  AI: "AI",
  DB: "데이터 / DB",
  DESIGNER: "디자이너",
};

const getSelectedRecruitTotal = (tags, positionSlots) =>
  tags.reduce((sum, tag) => sum + (positionSlots[tag]?.recruit ?? 0), 0);

const FieldLabel = ({ children }) => (
  <label className="block text-sm font-black text-slate-800">{children}</label>
);

const SummaryMetric = ({ label, value, accent }) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
    <p className="text-xs font-bold tracking-[0.12em] text-slate-400">{label}</p>
    <p className={`mt-2 text-xl font-black ${accent}`}>{value}</p>
  </div>
);

const baseInputClass =
  "mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#AFC5FF] focus:ring-4 focus:ring-[#EEF3FF]";

const compactNumberInputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-[#F8FAFF] px-3 text-center text-sm font-black text-slate-800 outline-none transition focus:border-[#AFC5FF] focus:ring-4 focus:ring-[#EEF3FF]";

const selectWrapperClass =
  "relative mt-2 rounded-2xl border border-slate-300 bg-white transition duration-200 hover:border-[#BFD0FF] hover:bg-[#F7F9FF] hover:shadow-[0_10px_24px_rgba(51,109,254,0.08)]";

const readOnlyFieldClass =
  "mt-2 flex h-12 w-full items-center rounded-2xl border border-slate-200 bg-[#F8FAFF] px-4 text-sm font-bold text-slate-700";

const MemberCountIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`stroke-current ${className}`}>
    <circle cx="12" cy="8" r="4" strokeWidth="1.7" />
    <path
      d="M4.5 19C5.5 15.7 8.2 14 12 14C15.8 14 18.5 15.7 19.5 19"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const HackathonIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`stroke-current ${className}`}>
    <rect x="4.5" y="6" width="15" height="13.5" rx="2.5" strokeWidth="1.7" />
    <path d="M8 4.5V8" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M16 4.5V8" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M4.5 10.5H19.5" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const CloseIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`stroke-current ${className}`}>
    <path d="M7 7L17 17" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 7L7 17" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SelectField = ({ value, onChange, options, showDot = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className={selectWrapperClass}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-12 w-full cursor-pointer items-center justify-between rounded-2xl bg-transparent px-4 text-sm font-bold text-slate-800 outline-none transition duration-200"
      >
        <span className="flex items-center gap-2">
          {showDot && selectedOption.dotTone ? (
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                toneDotClass[selectedOption.dotTone] ?? "bg-slate-400"
              }`}
            />
          ) : null}
          <span>{selectedOption.label}</span>
        </span>
        <span
          className={`text-slate-500 transition duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 stroke-current">
            <path d="M5 7.5L10 12.5L15 7.5" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange({ target: { value: option.value } });
                setIsOpen(false);
              }}
              className={`flex w-full cursor-pointer items-center px-4 py-3 text-left text-sm font-bold transition hover:bg-[#F4F7FF] ${
                option.value === value ? "bg-[#EEF3FF] text-[#2458E6]" : "text-slate-800"
              }`}
            >
              {showDot && option.dotTone ? (
                <span
                  className={`mr-2 h-2.5 w-2.5 rounded-full ${
                    toneDotClass[option.dotTone] ?? "bg-slate-400"
                  }`}
                />
              ) : null}
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const PreviewPositionChoice = ({ tag, recruit, active }) => (
  <button
    type="button"
    className={`inline-flex cursor-default items-center gap-2 rounded-xl border px-3 py-2 text-sm font-black ${
      active
        ? "border-[#336DFE] bg-[#EEF3FF] text-[#2458E6]"
        : "border-slate-200 bg-white text-slate-600"
    }`}
  >
    <span
      className={`inline-flex min-w-9 items-center justify-center rounded-md px-2 py-1 text-[10px] font-black ${
        tagColorMap[tag] ?? "bg-slate-200 text-slate-700"
      }`}
    >
      {tag}
    </span>
    <span>{recruit}명</span>
  </button>
);

const RecruitPreviewCard = ({ form, selectedTeam }) => {
  const selectedTags = form.tags.length > 0 ? form.tags : ["FE"];
  const recruitTotal = getSelectedRecruitTotal(selectedTags, form.positionSlots);

  return (
    <BaseInfoCard className="p-6 transition duration-200 hover:-translate-y-1 hover:border-[#C9D7FF] hover:shadow-[0_24px_50px_rgba(51,109,254,0.12)]">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-2">
          <span className="text-[10px] font-medium text-[#7C96FF]">15분전</span>
          <h2 className="truncate text-[1.65rem] font-black tracking-tight text-slate-950">
            {form.title || "팀원 마지막 한 명 구합니다."}
          </h2>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <CloseIcon className="h-4 w-4" />
        </span>
      </div>

      <div className="space-y-6 py-6">
        <p className="text-sm font-black tracking-[0.01em] text-[#4E6FD8] sm:text-[15px]">
          {selectedTeam.name}
        </p>

        <p className="line-clamp-2 text-base font-medium leading-7 text-slate-800">
          {form.description || "프론트와 데이터 처리 경험이 있는 분이면 바로 합류 가능합니다."}
        </p>

        <div className="rounded-3xl bg-[#F8FAFF] px-4 py-4">
          <p className="text-xs font-bold tracking-[0.12em] text-[#6B86E8]">지원 포지션 선택</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedTags.map((tag, index) => (
              <PreviewPositionChoice
                key={tag}
                tag={tag}
                recruit={form.positionSlots[tag]?.recruit ?? 0}
                active={index === 0}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-[#E5ECFF] bg-[#F8FAFF] px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-[#6B86E8]">
              <HackathonIcon className="h-3.5 w-3.5" />
              참여 해커톤
            </span>
            <p className="mt-2 truncate text-base font-black text-slate-900 sm:text-[1.05rem]">
              {form.hackathonName || "참여 해커톤을 선택해 주세요"}
            </p>
          </div>
          <div className="flex items-center gap-3 border-l border-[#D7E2FF] pl-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#336DFE] shadow-[0_8px_18px_rgba(51,109,254,0.12)]">
              <MemberCountIcon className="h-4 w-4" />
            </span>
            <div className="text-center">
              <span className="block text-xs font-semibold tracking-[0.12em] text-[#6B86E8]">
                모집 인원
              </span>
              <span className="mt-1 block text-lg font-black text-slate-900">
                {recruitTotal}명
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <div className="w-full sm:w-auto">
          <PrimaryActionButton fullWidth>
            {selectedTags[0] ? `${selectedTags[0]} 포지션 지원하기` : "지원하기"}
          </PrimaryActionButton>
        </div>
      </div>
    </BaseInfoCard>
  );
};

const RecruitWritePage = () => {
  const navigate = useNavigate();
  const { createArticle, closeArticle, isSubmitting } = useRecruit();
  const [form, setForm] = useState({
    title: "",
    teamId: myTeams[0].id,
    tags: ["FE", "BE"],
    description: "",
    hackathonName: myTeams[0].hackathonName,
    contact: "",
    status: "open",
    positionSlots: {
      FE: { recruit: 1 },
      BE: { recruit: 1 },
      AI: { recruit: 0 },
      DB: { recruit: 0 },
      DESIGNER: { recruit: 0 },
    },
  });
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const selectedStatusLabel = useMemo(
    () => statusOptions.find((option) => option.value === form.status)?.label ?? "모집중",
    [form.status]
  );

  const selectedTeam = useMemo(
    () => myTeams.find((team) => team.id === form.teamId) ?? myTeams[0],
    [form.teamId]
  );

  const recruitTotal = useMemo(
    () => getSelectedRecruitTotal(form.tags, form.positionSlots),
    [form.tags, form.positionSlots]
  );

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTag = (tag) => {
    setForm((prev) => {
      const hasTag = prev.tags.includes(tag);
      const nextTags = hasTag ? prev.tags.filter((item) => item !== tag) : [...prev.tags, tag];

      if (nextTags.length === 0) {
        return prev;
      }

      if (!hasTag) {
        const currentRecruitTotal = getSelectedRecruitTotal(prev.tags, prev.positionSlots);

        // 새 포지션을 추가할 때도 최소 1명은 모집하도록 기본값을 맞춥니다.
        if (currentRecruitTotal >= TEAM_MAX_MEMBERS) {
          return prev;
        }

        return {
          ...prev,
          tags: nextTags,
          positionSlots: {
            ...prev.positionSlots,
            [tag]: { recruit: Math.max(1, prev.positionSlots[tag]?.recruit ?? 1) },
          },
        };
      }

      return { ...prev, tags: nextTags };
    });
  };

  const updatePositionSlot = (tag, value) => {
    const parsed = Math.max(1, Number(value || 1));

    setForm((prev) => {
      const otherTags = prev.tags.filter((item) => item !== tag);
      const otherRecruitTotal = getSelectedRecruitTotal(otherTags, prev.positionSlots);
      const maxAllowed = Math.max(1, TEAM_MAX_MEMBERS - otherRecruitTotal);
      const nextRecruit = Math.min(parsed, maxAllowed);

      return {
        ...prev,
        positionSlots: {
          ...prev.positionSlots,
          [tag]: { recruit: nextRecruit },
        },
      };
    });
  };

  const handleTeamChange = (teamId) => {
    const nextTeam = myTeams.find((team) => team.id === teamId) ?? myTeams[0];
    setForm((prev) => ({
      ...prev,
      teamId,
      hackathonName: nextTeam.hackathonName ?? "",
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    const validationMessage = validateRecruitCreateForm(form);

    if (validationMessage) {
      setSubmitSuccess("");
      setSubmitError(validationMessage);
      return;
    }

    setSubmitError("");

    // 글쓰기 화면의 입력값을 명세 request body로 변환해 바로 등록합니다.
    const result = await createArticle({
      teamId: form.teamId,
      form,
    });

    if (!result?.isSuccess) {
      setSubmitSuccess("");
      setSubmitError(result?.message || "팀원 모집 글을 등록하지 못했습니다.");
      return;
    }

    if (form.status === "closed") {
      // 등록 API에는 상태 필드가 없어서, 마감 작성은 등록 직후 마감 API로 상태를 맞춥니다.
      const closeResult = await closeArticle(result.data?.articleId);

      if (!closeResult?.isSuccess) {
        setSubmitSuccess("");
        setSubmitError(closeResult?.message || "등록 후 공고를 마감하지 못했습니다.");
        return;
      }
    }

    setSubmitSuccess("팀원 모집 글이 등록되었습니다. 목록에서 바로 확인할 수 있습니다.");
    window.setTimeout(() => {
      navigate("/teams");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F3F6FF]">
      <div className="mx-auto max-w-[1520px] px-4 py-8 sm:px-5 sm:py-10 lg:px-10 lg:py-12">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_440px]">
          <section className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                팀원 모집 글쓰기
              </h1>
              <p className="text-sm font-medium text-slate-500 sm:text-base">
                팀 최대 인원 5명을 기준으로, 포지션별 모집할 인원만 설정해 주세요.
              </p>
            </div>

            <BaseInfoCard className="p-6 sm:p-7 hover:border-[#D8E3FF] hover:shadow-[0_22px_48px_rgba(51,109,254,0.09)]">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FieldLabel>모집 제목</FieldLabel>
                  <input
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="예: 백엔드 한 분 더 모집합니다."
                    className={baseInputClass}
                  />
                </div>

                <div>
                  <FieldLabel>내 팀 선택</FieldLabel>
                  <SelectField
                    value={form.teamId}
                    onChange={(event) => handleTeamChange(event.target.value)}
                    options={myTeams.map((team) => ({ value: team.id, label: team.name }))}
                  />
                </div>

                <div>
                  <FieldLabel>참여 해커톤</FieldLabel>
                  <div className={readOnlyFieldClass}>{selectedTeam.hackathonName}</div>
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>팀 소개</FieldLabel>
                  <textarea
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="우리 팀이 어떤 방향으로 프로젝트를 진행하고 있는지 적어 주세요."
                    className="mt-2 min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#AFC5FF] focus:ring-4 focus:ring-[#EEF3FF]"
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>연락 받을 URL</FieldLabel>
                  <input
                    value={form.contact}
                    onChange={(event) => updateField("contact", event.target.value)}
                    placeholder="예: https://open.kakao.com/o/..."
                    className={baseInputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>모집 포지션</FieldLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tagOptions.map((tag) => {
                      const isSelected = form.tags.includes(tag);

                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`inline-flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2 text-sm font-black transition ${
                            isSelected
                              ? "border-[#336DFE] bg-[#EEF3FF] text-[#2458E6]"
                              : "border-slate-200 bg-white text-slate-500 hover:border-[#C9D7FF] hover:text-slate-700"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>포지션별 인원 설정</FieldLabel>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <SummaryMetric
                      label="모집할 인원"
                      value={`${recruitTotal}명`}
                      accent="text-[#336DFE]"
                    />
                    <SummaryMetric
                      label="팀 최대 인원"
                      value={`${TEAM_MAX_MEMBERS}명`}
                      accent="text-slate-900"
                    />
                  </div>

                  <div className="mt-4 space-y-3">
                    {form.tags.map((tag) => {
                      const slot = form.positionSlots[tag] ?? { recruit: 0 };

                      return (
                        <div
                          key={tag}
                          className="grid items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:grid-cols-[minmax(0,1fr)_132px]"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex min-w-11 items-center justify-center rounded-md px-2.5 py-1 text-[10px] font-black ${
                                tagColorMap[tag] ?? "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {tag}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-slate-800">
                                {positionDisplayLabel[tag]}
                              </p>
                              <p className="mt-1 text-xs font-semibold tracking-[0.08em] text-slate-400">
                                모집할 인원
                              </p>
                            </div>
                          </div>

                          <input
                            type="number"
                            min="1"
                            max={TEAM_MAX_MEMBERS}
                            value={slot.recruit}
                            onChange={(event) => updatePositionSlot(tag, event.target.value)}
                            className={compactNumberInputClass}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <FieldLabel>모집 상태</FieldLabel>
                  <SelectField
                    value={form.status}
                    onChange={(event) => updateField("status", event.target.value)}
                    options={statusOptions}
                    showDot
                  />
                </div>

                <div />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#F8FAFF] px-5 py-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm font-bold text-slate-500">게시 상태</span>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-black ${
                      form.status === "open"
                        ? "bg-[#EEF9F1] text-[#1E9F46]"
                        : "bg-[#FFF1F1] text-[#D93A3A]"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        form.status === "open" ? "bg-[#28C840]" : "bg-[#EB3B3B]"
                      }`}
                    />
                    {selectedStatusLabel}
                  </span>
                </div>
                <div className="w-full sm:w-auto">
                  <PrimaryActionButton fullWidth onClick={handleSubmit}>
                    {isSubmitting ? "등록 중..." : "작성 완료"}
                  </PrimaryActionButton>
                </div>
              </div>

              {submitError ? (
                <p className="mt-4 text-sm font-semibold text-[#D93A3A]">{submitError}</p>
              ) : null}

              {submitSuccess ? (
                <p className="mt-4 text-sm font-semibold text-[#1E9F46]">{submitSuccess}</p>
              ) : null}
            </BaseInfoCard>
          </section>

          <aside className="space-y-4 xl:sticky xl:top-36 xl:self-start">
            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-tight text-slate-950">미리보기</h2>
              <p className="text-sm font-medium text-slate-500">
                입력한 내용이 팀원 모집 상세 모달에서 어떻게 보일지 바로 확인할 수 있습니다.
              </p>
            </div>
            <RecruitPreviewCard form={form} selectedTeam={selectedTeam} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RecruitWritePage;
