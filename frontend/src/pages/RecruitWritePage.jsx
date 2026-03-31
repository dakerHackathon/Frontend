import { useEffect, useMemo, useRef, useState } from "react";
import BaseInfoCard from "../components/common/BaseInfoCard";
import PrimaryActionButton from "../components/common/PrimaryActionButton";

const statusOptions = [
  { value: "open", label: "모집중", dotTone: "active" },
  { value: "closed", label: "마감", dotTone: "closed" },
];

const myTeams = [
  {
    id: "team-336dfe",
    name: "#336DFE",
    hackathons: ["AI 아이디어톤 2026", "스마트시티 해커톤 2026"],
  },
  {
    id: "team-bloomup",
    name: "#BloomUp",
    hackathons: ["캠퍼스 창업톤 2026", "로컬 문제 해결톤 2026"],
  },
  {
    id: "team-nebula",
    name: "#Nebula",
    hackathons: ["AI 아이디어톤 2026", "부산 데이터톤 2026"],
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
  DB: "데이터/DB",
  DESIGNER: "디자이너",
};

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

const getTotalCounts = (positionSlots) =>
  Object.values(positionSlots).reduce(
    (acc, slot) => ({
      current: acc.current + (slot.current ?? 0),
      total: acc.total + (slot.total ?? 0),
    }),
    { current: 0, total: 0 }
  );

const RecruitPreviewCard = ({ form, selectedTeam }) => {
  const selectedTags = form.tags.length > 0 ? form.tags : ["FE", "BE"];
  const totalCounts = getTotalCounts(form.positionSlots);

  return (
    <BaseInfoCard className="flex min-h-[360px] flex-col p-6 transition duration-200 hover:-translate-y-1 hover:border-[#C9D7FF] hover:shadow-[0_24px_50px_rgba(51,109,254,0.12)]">
      <div className="flex flex-1 flex-col">
        <div className="space-y-3">
          <span className="text-[10px] font-medium text-[#7C96FF]">방금 전</span>
          <h2 className="truncate text-[1.35rem] font-black tracking-tight text-slate-950 sm:text-[1.5rem]">
            {form.title || "팀원 모집 제목을 입력하세요."}
          </h2>
          <p className="text-sm font-black tracking-[0.01em] text-[#4E6FD8] sm:text-[15px]">
            {selectedTeam.name}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex min-w-8 items-center justify-center rounded px-2 py-1 text-[10px] font-black ${
                  tagColorMap[tag] ?? "bg-slate-200 text-slate-700"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <p className="line-clamp-2 pt-5 text-sm font-medium text-slate-800 sm:pt-6 sm:text-base">
          {form.description || "여기에 작성한 내용이 미리보기 카드에 표시됩니다. 어떤 팀원을 찾고 있는지 적어보세요."}
        </p>

        <div className="flex flex-wrap gap-2 pt-4">
          {selectedTags.map((tag) => {
            const slot = form.positionSlots[tag];
            return (
              <div
                key={tag}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5"
              >
                <span
                  className={`inline-flex min-w-9 items-center justify-center rounded-md px-2 py-1 text-[10px] font-black ${
                    tagColorMap[tag] ?? "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tag}
                </span>
                <span className="text-xs font-black text-slate-800">
                  {slot.current}/{slot.total}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 pt-8 sm:pt-10">
          <span className="text-xs font-bold text-slate-900 sm:text-sm">
            {form.hackathonName || "참여 해커톤을 선택하세요."}
          </span>
          <span className="inline-flex items-center gap-1.5 text-base font-semibold text-slate-500 sm:text-lg">
            <MemberCountIcon />
            {totalCounts.current}/{totalCounts.total}
          </span>
        </div>
      </div>

      <div className="pt-5">
        <PrimaryActionButton fullWidth>상세보기 →</PrimaryActionButton>
      </div>
    </BaseInfoCard>
  );
};

const FieldLabel = ({ children }) => (
  <label className="block text-sm font-black text-slate-800">{children}</label>
);

const baseInputClass =
  "mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#AFC5FF] focus:ring-4 focus:ring-[#EEF3FF]";

const selectWrapperClass =
  "relative mt-2 rounded-2xl border border-slate-300 bg-white transition duration-200 hover:border-[#BFD0FF] hover:bg-[#F7F9FF] hover:shadow-[0_10px_24px_rgba(51,109,254,0.08)]";

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

const RecruitWritePage = () => {
  const [form, setForm] = useState({
    title: "",
    teamId: myTeams[0].id,
    tags: ["FE", "BE", "AI"],
    description: "",
    hackathonName: myTeams[0].hackathons[0],
    status: "open",
    positionSlots: {
      FE: { current: 1, total: 2 },
      BE: { current: 1, total: 2 },
      AI: { current: 0, total: 1 },
      DB: { current: 0, total: 1 },
      DESIGNER: { current: 0, total: 1 },
    },
  });

  const selectedStatusLabel = useMemo(
    () => statusOptions.find((option) => option.value === form.status)?.label ?? "모집중",
    [form.status]
  );

  const selectedTeam = useMemo(
    () => myTeams.find((team) => team.id === form.teamId) ?? myTeams[0],
    [form.teamId]
  );

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTag = (tag) => {
    setForm((prev) => {
      const hasTag = prev.tags.includes(tag);
      const nextTags = hasTag ? prev.tags.filter((item) => item !== tag) : [...prev.tags, tag];

      return {
        ...prev,
        tags: nextTags.length > 0 ? nextTags : prev.tags,
      };
    });
  };

  const updatePositionSlot = (tag, key, value) => {
    const nextValue = Math.max(0, Number(value || 0));

    setForm((prev) => {
      const currentSlot = prev.positionSlots[tag] ?? { current: 0, total: 0 };
      const nextSlot = { ...currentSlot, [key]: nextValue };

      if (key === "current" && nextSlot.current > nextSlot.total) {
        nextSlot.total = nextSlot.current;
      }

      if (key === "total" && nextSlot.total < nextSlot.current) {
        nextSlot.current = nextSlot.total;
      }

      return {
        ...prev,
        positionSlots: {
          ...prev.positionSlots,
          [tag]: nextSlot,
        },
      };
    });
  };

  const handleTeamChange = (teamId) => {
    const nextTeam = myTeams.find((team) => team.id === teamId) ?? myTeams[0];
    setForm((prev) => ({
      ...prev,
      teamId,
      hackathonName: nextTeam.hackathons[0] ?? "",
    }));
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
                내가 속한 팀을 선택하고, 팀이 참여 중인 해커톤 안에서 포지션별 모집 인원을 설정할 수 있습니다.
              </p>
            </div>

            <BaseInfoCard className="p-6 sm:p-7 hover:translate-y-0">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FieldLabel>모집 제목</FieldLabel>
                  <input
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="예) 백엔드 한 분 더 모십니다."
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
                  <SelectField
                    value={form.hackathonName}
                    onChange={(event) => updateField("hackathonName", event.target.value)}
                    options={selectedTeam.hackathons.map((hackathonName) => ({
                      value: hackathonName,
                      label: hackathonName,
                    }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>팀 소개</FieldLabel>
                  <textarea
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="우리 팀이 지향하는 방향과 현재 프로젝트 상황을 적어주세요."
                    className="mt-2 min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#AFC5FF] focus:ring-4 focus:ring-[#EEF3FF]"
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
                  <FieldLabel>포지션별 모집 인원</FieldLabel>
                  <div className="mt-3 grid gap-3">
                    {form.tags.map((tag) => (
                      <div
                        key={tag}
                        className="grid gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFF] px-4 py-4 sm:grid-cols-[auto_1fr_1fr]"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex min-w-11 items-center justify-center rounded-md px-2.5 py-1 text-[10px] font-black ${
                              tagColorMap[tag] ?? "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {tag}
                          </span>
                          <span className="text-sm font-bold text-slate-700">
                            {positionDisplayLabel[tag]}
                          </span>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-500">현재 인원</label>
                          <input
                            type="number"
                            min="0"
                            value={form.positionSlots[tag]?.current ?? 0}
                            onChange={(event) =>
                              updatePositionSlot(tag, "current", event.target.value)
                            }
                            className={baseInputClass}
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-500">모집 인원</label>
                          <input
                            type="number"
                            min="0"
                            value={form.positionSlots[tag]?.total ?? 0}
                            onChange={(event) =>
                              updatePositionSlot(tag, "total", event.target.value)
                            }
                            className={baseInputClass}
                          />
                        </div>
                      </div>
                    ))}
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
                  <PrimaryActionButton fullWidth>작성 완료</PrimaryActionButton>
                </div>
              </div>
            </BaseInfoCard>
          </section>

          <aside className="space-y-4 xl:sticky xl:top-36 xl:self-start">
            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-tight text-slate-950">미리보기</h2>
              <p className="text-sm font-medium text-slate-500">
                입력한 내용이 카드에서 어떻게 보이는지 바로 확인할 수 있습니다.
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
