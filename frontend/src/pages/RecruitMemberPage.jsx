import { useMemo, useState } from "react";
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
    description: "우리팀은 이런사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 2,
    maxCount: 5,
    status: "open",
    position: "all",
  },
  {
    id: 2,
    version: "15분전",
    title: "팀원 마지막 한 명 구합니다.",
    tags: ["FE", "DB"],
    accent: "#336DFE",
    description: "우리팀은 이런사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 3,
    maxCount: 5,
    status: "open",
    position: "frontend",
  },
  {
    id: 3,
    version: "32분전",
    title: "백엔드, AI 가능한 사람 구합니다.",
    tags: ["BE", "AI"],
    accent: "#336DFE",
    description: "우리팀은 이런사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 3,
    maxCount: 5,
    status: "open",
    position: "backend",
  },
  {
    id: 4,
    version: "1분전",
    title: "팀원 모집합니다.",
    tags: ["FE", "BE", "AI"],
    accent: "#336DFE",
    description: "우리팀은 이런사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 2,
    maxCount: 5,
    status: "open",
    position: "all",
  },
  {
    id: 5,
    version: "1분전",
    title: "팀원 모집합니다.",
    tags: ["FE", "BE", "AI"],
    accent: "#336DFE",
    description: "우리팀은 이런사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 2,
    maxCount: 5,
    status: "closed",
    position: "ai",
  },
  {
    id: 6,
    version: "1분전",
    title: "팀원 모집합니다.",
    tags: ["FE", "BE", "AI"],
    accent: "#336DFE",
    description: "우리팀은 이런사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 2,
    maxCount: 5,
    status: "open",
    position: "designer",
  },
  {
    id: 7,
    version: "1분전",
    title: "팀원 모집합니다.",
    tags: ["FE", "BE", "AI"],
    accent: "#336DFE",
    description: "우리팀은 이런사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 2,
    maxCount: 5,
    status: "open",
    position: "frontend",
  },
  {
    id: 8,
    version: "1분전",
    title: "팀원 모집합니다.",
    tags: ["FE", "BE", "AI"],
    accent: "#336DFE",
    description: "우리팀은 이런사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 2,
    maxCount: 5,
    status: "closed",
    position: "all",
  },
  {
    id: 9,
    version: "1분전",
    title: "팀원 모집합니다.",
    tags: ["FE", "BE", "AI"],
    accent: "#336DFE",
    description: "우리팀은 이런사람을 원합니다.",
    hackathonName: "AI 아이디어톤 2026",
    currentCount: 2,
    maxCount: 5,
    status: "open",
    position: "backend",
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

const MemberCountIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 stroke-current">
      <circle cx="12" cy="8" r="4" strokeWidth="1.7" />
      <path d="M4.5 19C5.5 15.7 8.2 14 12 14C15.8 14 18.5 15.7 19.5 19" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
};

const RecruitCard = ({ post }) => {
  return (
    <BaseInfoCard className="group flex min-h-[320px] flex-col p-5 sm:min-h-[340px] sm:p-6">
      <div className="flex flex-1 flex-col">
        <div className="space-y-3">
          <span className="text-[10px] font-medium text-[#7C96FF]">{post.version}</span>
          <h2 className="text-[1.75rem] font-black tracking-tight text-slate-950 transition duration-200 group-hover:text-[#2458E6] sm:text-[2rem]">
            {post.title}
          </h2>

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
            <span className="text-sm font-black text-slate-500">{post.accent}</span>
          </div>
        </div>

        <p className="pt-5 text-sm font-medium text-slate-800 sm:pt-6 sm:text-base">
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

      <div className="pt-5">
        <PrimaryActionButton fullWidth>상세보기 →</PrimaryActionButton>
      </div>
    </BaseInfoCard>
  );
};

const RecruitMemberPage = () => {
  const [searchCategory, setSearchCategory] = useState("title");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");

  const filteredPosts = useMemo(() => {
    const loweredSearch = searchValue.trim().toLowerCase();

    return recruitPosts.filter((post) => {
      const searchableText =
        searchCategory === "title"
          ? `${post.title} ${post.description}`
          : `${post.title} ${post.tags.join(" ")} ${post.description}`;

      const matchesSearch =
        loweredSearch.length === 0 ||
        searchableText.toLowerCase().includes(loweredSearch);

      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;

      const matchesPosition =
        positionFilter === "all" ||
        post.position === positionFilter ||
        post.position === "all";

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
                  <PrimaryActionButton fullWidth>+ 글쓰기</PrimaryActionButton>
                </div>
              }
            />
          </div>

          <div className="grid gap-6 sm:gap-7 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <RecruitCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RecruitMemberPage;
