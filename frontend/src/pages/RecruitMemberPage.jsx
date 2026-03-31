import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseInfoCard from "../components/common/BaseInfoCard";
import PrimaryActionButton from "../components/common/PrimaryActionButton";
import SearchFilterBar from "../components/common/SearchFilterBar";

const recruitPosts = [
  {
    id: 1,
    version: "1분전",
    title: "팀원 모집합니다.",
    tags: ["FE", "BE", "AI"],
    accent: "#336DFE",
    description:
      "우리 팀은 빠르게 프로토타입을 만들고 실제 사용 가능성까지 검증하고 싶은 분을 찾고 있습니다.",
    hackathonName: "AI 아이디어톤 2026",
    positionSlots: {
      FE: { current: 1, total: 2 },
      BE: { current: 1, total: 2 },
      AI: { current: 0, total: 1 },
    },
    status: "open",
    position: "all",
  },
  {
    id: 2,
    version: "15분전",
    title: "팀원 마지막 한 명 구합니다.",
    tags: ["FE", "DB"],
    accent: "#336DFE",
    description: "프론트와 데이터 처리 경험이 있는 분이면 바로 합류 가능합니다.",
    hackathonName: "AI 아이디어톤 2026",
    positionSlots: {
      FE: { current: 2, total: 3 },
      DB: { current: 1, total: 2 },
    },
    status: "open",
    position: "frontend",
  },
  {
    id: 3,
    version: "32분전",
    title: "백엔드, AI 가능한 사람 구합니다.",
    tags: ["BE", "AI"],
    accent: "#336DFE",
    description: "모델 서빙과 API 설계 경험이 있는 분을 우선으로 찾고 있습니다.",
    hackathonName: "AI 아이디어톤 2026",
    positionSlots: {
      BE: { current: 2, total: 3 },
      AI: { current: 1, total: 2 },
    },
    status: "open",
    position: "backend",
  },
  {
    id: 4,
    version: "1분전",
    title: "팀원 모집합니다.",
    tags: ["FE", "BE", "AI"],
    accent: "#336DFE",
    description: "같이 밤새울 의지 있는 팀원을 기다립니다.",
    hackathonName: "AI 아이디어톤 2026",
    positionSlots: {
      FE: { current: 1, total: 2 },
      BE: { current: 1, total: 2 },
      AI: { current: 0, total: 1 },
    },
    status: "open",
    position: "all",
  },
  {
    id: 5,
    version: "1분전",
    title: "AI 직군 마감 직전입니다.",
    tags: ["FE", "BE", "AI"],
    accent: "#336DFE",
    description: "현재는 AI 포지션 중심으로 확인 중이며 빠르게 합류 가능한 분을 찾습니다.",
    hackathonName: "AI 아이디어톤 2026",
    positionSlots: {
      FE: { current: 1, total: 2 },
      BE: { current: 0, total: 1 },
      AI: { current: 1, total: 2 },
    },
    status: "closed",
    position: "ai",
  },
  {
    id: 6,
    version: "1분전",
    title: "디자이너와 개발자 모두 모집해요.",
    tags: ["FE", "BE", "AI", "DESIGNER"],
    accent: "#336DFE",
    description: "브랜딩과 UI 콘셉트까지 같이 만들어갈 분을 기다립니다.",
    hackathonName: "AI 아이디어톤 2026",
    positionSlots: {
      FE: { current: 1, total: 2 },
      BE: { current: 1, total: 2 },
      AI: { current: 0, total: 1 },
      DESIGNER: { current: 0, total: 1 },
    },
    status: "open",
    position: "designer",
  },
];

const searchOptions = [
  { value: "titleAndContent", label: "제목 + 내용" },
  { value: "hackathon", label: "해커톤" },
];

const statusOptions = [
  { value: "all", label: "모집 상태", dotTone: "neutral" },
  { value: "open", label: "모집중", dotTone: "active" },
  { value: "closed", label: "마감", dotTone: "closed" },
];

const positionOptions = [
  { value: "all", label: "포지션" },
  { value: "frontend", label: "프론트" },
  { value: "backend", label: "백엔드" },
  { value: "ai", label: "AI" },
  { value: "designer", label: "디자이너" },
  { value: "data", label: "DB" },
];

const tagColorMap = {
  FE: "bg-[#2A3FFF] text-white",
  BE: "bg-[#4CD137] text-white",
  AI: "bg-[#666666] text-white",
  DB: "bg-[#FFB547] text-white",
  DESIGNER: "bg-[#FF7AB6] text-white",
};

const getTotalCounts = (post) =>
  Object.values(post.positionSlots ?? {}).reduce(
    (acc, slot) => ({
      current: acc.current + (slot.current ?? 0),
      total: acc.total + (slot.total ?? 0),
    }),
    { current: 0, total: 0 },
  );

const getPositionSlotEntries = (post) =>
  Object.entries(post.positionSlots ?? {}).filter(([, slot]) => (slot?.total ?? 0) > 0);

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

const PositionSlotList = ({ post, compact = false, titled = false }) => (
  <div className={`${compact ? "pt-3" : ""}`}>
    <div className={`flex flex-wrap gap-2 ${titled ? "mt-1" : ""}`}>
      {getPositionSlotEntries(post).map(([tag, slot]) => (
        <div
          key={`${post.id}-${tag}`}
          className={`inline-flex items-center gap-2 rounded-xl border font-black ${
            compact ? "px-2.5 py-2 text-xs" : "px-3 py-2 text-sm"
          } border-slate-200 bg-white text-slate-600`}
        >
          <span
            className={`inline-flex min-w-9 items-center justify-center rounded-md px-2 py-1 text-[10px] font-black ${
              tagColorMap[tag] ?? "bg-slate-200 text-slate-700"
            }`}
          >
            {tag}
          </span>
          <span>{slot.total - slot.current}명</span>
        </div>
      ))}
    </div>
  </div>
);

const RecruitDetailModal = ({ post, onClose }) => {
  const totalCounts = getTotalCounts(post);
  const availablePositions = useMemo(
    () =>
      getPositionSlotEntries(post).filter(([, slot]) => (slot.total ?? 0) > (slot.current ?? 0)),
    [post],
  );
  const [selectedPosition, setSelectedPosition] = useState(availablePositions[0]?.[0] ?? "");

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
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    setSelectedPosition(availablePositions[0]?.[0] ?? "");
  }, [availablePositions]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,16,32,0.45)] px-4 py-8 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[620px] rounded-[28px] bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.22)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#7C96FF]">{post.version}</span>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-[2rem]">
              {post.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 min-h-10 w-10 min-w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="팀원 모집 상세 닫기"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 py-6">
          <p className="text-sm font-black tracking-[0.01em] text-[#4E6FD8] sm:text-[15px]">
            {post.accent}
          </p>

          <p className="text-base font-medium leading-7 text-slate-800">{post.description}</p>

          <div className="rounded-3xl bg-[#F8FAFF] px-4 py-4">
            <p className="text-xs font-bold tracking-[0.12em] text-[#6B86E8]">지원 포지션 선택</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {availablePositions.length > 0 ? (
                availablePositions.map(([tag, slot]) => {
                  const isSelected = selectedPosition === tag;

                  return (
                    <button
                      key={`${post.id}-${tag}`}
                      type="button"
                      onClick={() => setSelectedPosition(tag)}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-black transition ${
                        isSelected
                          ? "border-[#336DFE] bg-[#EEF3FF] text-[#2458E6]"
                          : "border-slate-200 bg-white text-slate-600 hover:border-[#C9D7FF] hover:text-slate-800"
                      }`}
                    >
                      <span
                        className={`inline-flex min-w-9 items-center justify-center rounded-md px-2 py-1 text-[10px] font-black ${
                          tagColorMap[tag] ?? "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {tag}
                      </span>
                      <span>{slot.total - slot.current}명</span>
                    </button>
                  );
                })
              ) : (
                <p className="text-sm font-medium text-slate-500">
                  현재 지원 가능한 포지션이 없습니다.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-[#E5ECFF] bg-[#F8FAFF] px-4 py-4 sm:px-5">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-[#6B86E8]">
                <HackathonIcon className="h-3.5 w-3.5" />
                참여 해커톤
              </span>
              <p className="mt-2 truncate text-base font-black text-slate-900 sm:text-[1.05rem]">
                {post.hackathonName}
              </p>
            </div>
            <div className="flex items-center gap-3 border-l border-[#D7E2FF] pl-4 sm:gap-4 sm:pl-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#336DFE] shadow-[0_8px_18px_rgba(51,109,254,0.12)]">
                <MemberCountIcon className="h-4 w-4" />
              </span>
              <div className="text-center">
                <span className="block text-xs font-semibold tracking-[0.12em] text-[#6B86E8]">
                  모집 인원
                </span>
                <span className="mt-1 block text-lg font-black text-slate-900">
                  {totalCounts.current}/{totalCounts.total}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-5">
          <div className="w-full sm:w-auto">
            <PrimaryActionButton fullWidth disabled={availablePositions.length === 0}>
              {selectedPosition ? `${selectedPosition} 포지션 지원하기` : "지원하기"}
            </PrimaryActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecruitCard = ({ post, onOpen }) => {
  const totalCounts = getTotalCounts(post);
  const handleOpen = () => onOpen(post);

  return (
    <BaseInfoCard
      className="group flex min-h-[390px] cursor-pointer flex-col p-5 sm:min-h-[410px] sm:p-6"
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
    >
      <div className="flex flex-1 flex-col">
        <div className="space-y-3">
          <span className="text-[10px] font-medium text-[#7C96FF]">{post.version}</span>
          <h2 className="truncate text-[1.2rem] font-black tracking-tight text-slate-950 transition duration-200 group-hover:text-[#2458E6] sm:text-[1.35rem]">
            {post.title}
          </h2>
          <p className="text-sm font-black tracking-[0.01em] text-[#4E6FD8] sm:text-[15px]">
            {post.accent}
          </p>
          <PositionSlotList post={post} compact />
        </div>

        <p className="line-clamp-2 pt-4 text-sm font-medium leading-7 text-slate-800 sm:pt-5 sm:text-base">
          {post.description}
        </p>

        <div className="mt-auto pt-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-[#E5ECFF] bg-[#F8FAFF] px-4 py-4">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-[#6B86E8]">
                <HackathonIcon className="h-3.5 w-3.5" />
                참여 해커톤
              </span>
              <p className="mt-2 truncate text-sm font-black text-slate-900 sm:text-[1rem]">
                {post.hackathonName}
              </p>
            </div>
            <div className="flex items-center gap-3 border-l border-[#D7E2FF] pl-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#336DFE] shadow-[0_8px_18px_rgba(51,109,254,0.12)]">
                <MemberCountIcon className="h-4 w-4" />
              </span>
              <div className="text-center">
                <span className="block text-[11px] font-semibold tracking-[0.12em] text-[#6B86E8]">
                  모집 인원
                </span>
                <span className="mt-1 block text-lg font-black text-slate-900">
                  {totalCounts.current}/{totalCounts.total}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5" onClick={(event) => event.stopPropagation()}>
        <PrimaryActionButton fullWidth onClick={handleOpen}>
          상세보기 →
        </PrimaryActionButton>
      </div>
    </BaseInfoCard>
  );
};

const RecruitMemberPage = () => {
  const navigate = useNavigate();
  const [searchCategory, setSearchCategory] = useState("titleAndContent");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = useMemo(() => {
    const loweredSearch = searchValue.trim().toLowerCase();

    return recruitPosts.filter((post) => {
      const searchableText =
        searchCategory === "hackathon" ? post.hackathonName : `${post.title} ${post.description}`;

      const matchesSearch =
        loweredSearch.length === 0 || searchableText.toLowerCase().includes(loweredSearch);

      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      const matchesPosition =
        positionFilter === "all" ||
        post.position === positionFilter ||
        post.tags.some((tag) => {
          if (positionFilter === "frontend") return tag === "FE";
          if (positionFilter === "backend") return tag === "BE";
          if (positionFilter === "ai") return tag === "AI";
          if (positionFilter === "designer") return tag === "DESIGNER";
          if (positionFilter === "data") return tag === "DB";
          return false;
        });

      return matchesSearch && matchesStatus && matchesPosition;
    });
  }, [positionFilter, searchCategory, searchValue, statusFilter]);

  return (
    <div className="min-h-screen bg-[#F3F6FF]">
      <div className="mx-auto max-w-[1640px] px-4 py-8 sm:px-5 sm:py-10 lg:px-10 lg:py-12">
        <section className="space-y-8 sm:space-y-10">
          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              팀원 모집
            </h1>
          </div>

          <div className="pt-4 sm:pt-8 lg:pt-10">
            <SearchFilterBar
              searchOptions={searchOptions}
              searchCategory={searchCategory}
              onSearchCategoryChange={setSearchCategory}
              searchValue={searchValue}
              onSearchValueChange={setSearchValue}
              searchPlaceholder="제목 또는 내용을 입력해 주세요."
              filters={[
                {
                  key: "status",
                  type: "status",
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: statusOptions,
                },
                {
                  key: "position",
                  value: positionFilter,
                  onChange: setPositionFilter,
                  options: positionOptions,
                },
              ]}
              actionButton={
                <div className="w-full sm:w-auto">
                  <PrimaryActionButton fullWidth onClick={() => navigate("/teams/write")}>
                    + 글쓰기
                  </PrimaryActionButton>
                </div>
              }
            />
          </div>

          <div className="grid gap-6 sm:gap-7 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <RecruitCard key={post.id} post={post} onOpen={setSelectedPost} />
            ))}
          </div>
        </section>
      </div>

      {selectedPost ? (
        <RecruitDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      ) : null}
    </div>
  );
};

export default RecruitMemberPage;
