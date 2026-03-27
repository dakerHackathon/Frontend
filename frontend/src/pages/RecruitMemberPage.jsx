import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseInfoCard from "../components/common/BaseInfoCard";
import PrimaryActionButton from "../components/common/PrimaryActionButton";
import SearchFilterBar from "../components/common/SearchFilterBar";

const recruitPosts = [
  {
    id: 1,
    version: "1분 전",
    title: "팀원 모집합니다.",
    tags: ["FE", "BE", "AI"],
    accent: "#336DFE",
    description:
      "우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.우리팀은 이런 사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 2,
    maxCount: 5,
    status: "open",
    position: "all",
  },
  {
    id: 2,
    version: "15분 전",
    title: "팀원 마지막 한 명 구합니다.",
    tags: ["FE", "DB"],
    accent: "#336DFE",
    description: "우리팀은 이런 사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 3,
    maxCount: 5,
    status: "open",
    position: "frontend",
  },
  {
    id: 3,
    version: "32분 전",
    title: "백엔드, AI 가능한 사람 구합니다.",
    tags: ["BE", "AI"],
    accent: "#336DFE",
    description: "우리팀은 이런 사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 3,
    maxCount: 5,
    status: "open",
    position: "backend",
  },
  {
    id: 4,
    version: "1분 전",
    title: "팀원 모집합니다.",
    tags: ["FE", "BE", "AI"],
    accent: "#336DFE",
    description: "우리팀은 이런 사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 2,
    maxCount: 5,
    status: "open",
    position: "all",
  },
  {
    id: 5,
    version: "1분 전",
    title: "팀원 모집합니다.",
    tags: ["FE", "BE", "AI"],
    accent: "#336DFE",
    description: "우리팀은 이런 사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 2,
    maxCount: 5,
    status: "closed",
    position: "ai",
  },
  {
    id: 6,
    version: "1분 전",
    title: "팀원 모집합니다.",
    tags: ["FE", "BE", "AI"],
    accent: "#336DFE",
    description: "우리팀은 이런 사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 2,
    maxCount: 5,
    status: "open",
    position: "designer",
  },
];

const searchOptions = [
  { value: "title", label: "제목 + 내용" },
  { value: "titleAndTag", label: "제목 + 태그" },
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
  { value: "designer", label: "디자인" },
];

const tagColorMap = {
  FE: "bg-[#2A3FFF] text-white",
  BE: "bg-[#4CD137] text-white",
  AI: "bg-[#666666] text-white",
  DB: "bg-[#FFB547] text-white",
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

const RecruitDetailModal = ({ post, onClose }) => {
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

          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex min-w-9 items-center justify-center rounded-md px-2.5 py-1 text-[11px] font-black ${
                  tagColorMap[tag] ?? "bg-slate-200 text-slate-700"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-base font-medium leading-7 text-slate-800">{post.description}</p>

          <div className="grid gap-3 rounded-3xl border border-[#E5ECFF] bg-[#F8FAFF] px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-[#6B86E8]">
                <HackathonIcon className="h-3.5 w-3.5" />
                참여 해커톤
              </span>
              <p className="mt-2 truncate text-base font-black text-slate-900 sm:text-[1.05rem]">
                {post.hackathonName}
              </p>
            </div>
            <div className="flex items-center gap-4 sm:border-l sm:border-[#D7E2FF] sm:pl-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#336DFE] shadow-[0_8px_18px_rgba(51,109,254,0.12)]">
                <MemberCountIcon className="h-4 w-4" />
              </span>
              <div className="text-center">
                <span className="block text-xs font-semibold tracking-[0.12em] text-[#6B86E8]">
                  모집 인원
                </span>
                <span className="mt-1 block text-lg font-black text-slate-900">
                  {post.currentCount}/{post.maxCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-5">
          <div className="w-full sm:w-auto">
            <PrimaryActionButton fullWidth>참여하기</PrimaryActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecruitCard = ({ post, onOpen }) => {
  const handleOpen = () => onOpen(post);

  return (
    <BaseInfoCard
      className="group flex min-h-[320px] cursor-pointer flex-col p-5 sm:min-h-[340px] sm:p-6"
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
          <h2 className="truncate text-[1.5rem] font-black tracking-tight text-slate-950 transition duration-200 group-hover:text-[#2458E6] sm:text-[1.7rem]">
            {post.title}
          </h2>
          <p className="text-sm font-black tracking-[0.01em] text-[#4E6FD8] sm:text-[15px]">
            {post.accent}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
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
          {post.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-8 sm:pt-10">
          <span className="text-xs font-bold text-slate-900 sm:text-sm">{post.hackathonName}</span>
          <span className="inline-flex items-center gap-1.5 text-base font-semibold text-slate-500 sm:text-lg">
            <MemberCountIcon />
            {post.currentCount}/{post.maxCount}
          </span>
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
  const [searchCategory, setSearchCategory] = useState("title");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = useMemo(() => {
    const loweredSearch = searchValue.trim().toLowerCase();

    return recruitPosts.filter((post) => {
      const searchableText =
        searchCategory === "title"
          ? `${post.title} ${post.description}`
          : `${post.title} ${post.tags.join(" ")} ${post.description}`;

      const matchesSearch =
        loweredSearch.length === 0 || searchableText.toLowerCase().includes(loweredSearch);

      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      const matchesPosition =
        positionFilter === "all" || post.position === positionFilter || post.position === "all";

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
              searchPlaceholder="제목 또는 내용을 입력하세요."
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
