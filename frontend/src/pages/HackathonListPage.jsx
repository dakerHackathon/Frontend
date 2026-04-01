import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BaseInfoCard from "../components/common/BaseInfoCard";
import MiniCalendar from "../components/common/MiniCalendar";
import PageSectionHeader from "../components/common/PageSectionHeader";
import PrimaryActionButton from "../components/common/PrimaryActionButton";
import RankingSidebarCard from "../components/common/RankingSidebarCard";
import SearchFilterBar from "../components/common/SearchFilterBar";
import StatusBadge from "../components/common/StatusBadge";

const sidebarRankings = [
  {
    title: "블루밍 온도",
    entries: [
      { rank: 1, name: "강석진", value: "43.5" },
      { rank: 2, name: "김현호", value: "41.3" },
      { rank: 3, name: "김민준", value: "39.8" },
    ],
    currentUser: { name: "My NickName·18th", value: "36.5" },
  },
  {
    title: "최다 우승",
    entries: [
      { rank: 1, name: "강석진", value: "8회" },
      { rank: 2, name: "김현호", value: "7회" },
      { rank: 3, name: "김민준", value: "6회" },
    ],
    currentUser: { name: "My NickName·18th", value: "0회" },
  },
  {
    title: "최다 참여",
    entries: [
      { rank: 1, name: "강석진", value: "15회" },
      { rank: 2, name: "김현호", value: "14회" },
      { rank: 3, name: "김민준", value: "11회" },
    ],
    currentUser: { name: "My NickName·18th", value: "2회" },
  },
];

const searchOptions = [
  { value: "title", label: "제목" },
  { value: "titleAndContent", label: "제목 + 내용" },
];

const statusOptions = [
  { value: "all", label: "전체 상태", dotTone: "neutral" },
  { value: "active", label: "진행중", dotTone: "active" },
  { value: "upcoming", label: "예정", dotTone: "upcoming" },
  { value: "closed", label: "마감", dotTone: "closed" },
];

const regionOptions = [
  { value: "all", label: "전체(지역)" },
  { value: "online", label: "온라인" },
  { value: "seoul", label: "서울" },
  { value: "gyeongbuk", label: "경북" },
  { value: "busan", label: "부산" },
  { value: "daejeon", label: "대전" },
  { value: "etc", label: "기타" },
];

const detailsIcons = {
  period: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current">
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" strokeWidth="1.8" />
      <path d="M7 3.5V7.5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 3.5V7.5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3.5 9.5H20.5" strokeWidth="1.8" />
    </svg>
  ),
  location: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current">
      <path
        d="M12 20C15.5 16.4 18 13.7 18 10.5C18 6.9 15.3 4.5 12 4.5C8.7 4.5 6 6.9 6 10.5C6 13.7 8.5 16.4 12 20Z"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10.5" r="2.3" strokeWidth="1.8" />
    </svg>
  ),
};

const parseApiDate = (value) => new Date(value.replace(" ", "T"));

const formatDateDot = (value) => value.slice(0, 10).replaceAll("-", ".");

const formatPeriod = (startAt, endAt) => `${formatDateDot(startAt)} ~ ${formatDateDot(endAt)}`;

const getStatusMeta = (startAt, endAt) => {
  const now = new Date();
  const startDate = parseApiDate(startAt);
  const endDate = parseApiDate(endAt);

  if (now < startDate) {
    return { status: "upcoming", statusLabel: "예정" };
  }

  if (now > endDate) {
    return { status: "closed", statusLabel: "마감" };
  }

  return { status: "active", statusLabel: "진행중" };
};

const getDdayLabel = (endAt, status) => {
  if (status === "closed") {
    return "D-0";
  }

  const now = new Date();
  const target = parseApiDate(endAt);
  const diffDays = Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));

  return `D-${diffDays}`;
};

const getRegionValue = (location) => {
  const normalized = location.trim().toLowerCase();

  if (normalized.includes("온라인")) return "online";
  if (normalized.includes("서울")) return "seoul";
  if (normalized.includes("경북")) return "gyeongbuk";
  if (normalized.includes("부산")) return "busan";
  if (normalized.includes("대전")) return "daejeon";

  return "etc";
};

const FavoriteStarButton = ({ active, onToggle }) => (
  <button
    type="button"
    aria-label={active ? "즐겨찾기 해제" : "즐겨찾기 추가"}
    aria-pressed={active}
    onClick={onToggle}
    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#F5B23A] transition hover:scale-105 hover:bg-white"
  >
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} className="h-4.5 w-4.5">
      <path
        d="M12 3.7L14.6 8.97L20.42 9.82L16.21 13.92L17.2 19.7L12 16.96L6.8 19.7L7.79 13.92L3.58 9.82L9.4 8.97L12 3.7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

const HackathonCard = ({ hackathon, onToggleFavorite, onOpenDetail }) => {
  const details = [
    { key: "period", text: hackathon.period },
    { key: "location", text: hackathon.location },
  ];

  return (
    <div
      role="button"
      tabIndex={0}
      className="outline-none"
      onClick={onOpenDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetail();
        }
      }}
    >
      <BaseInfoCard className="group cursor-pointer space-y-4">
        <div className="relative rounded-2xl bg-slate-200 p-4 transition duration-200 group-hover:bg-[#DCE6FF]">
          <div className="flex items-start justify-between gap-3">
            <StatusBadge
              label={hackathon.statusLabel}
              tone={hackathon.status}
              withDot={hackathon.status === "active"}
            />
            <span className="rounded-lg bg-[#FF3B30] px-3 py-1 text-xs font-black text-white">
              {hackathon.dDay}
            </span>
          </div>
          <div className="mt-16 h-24 rounded-xl bg-gradient-to-br from-white/60 to-white/0 transition duration-200 group-hover:from-white/80" />
          <div className="absolute bottom-3 right-3">
            <FavoriteStarButton
              active={hackathon.isStar}
              onToggle={(event) => {
                event.stopPropagation();
                onToggleFavorite();
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 transition duration-200 group-hover:text-[#2458E6]">
            {hackathon.title}
          </h2>
        </div>

        <div className="space-y-2 text-sm text-slate-600 transition duration-200 group-hover:text-slate-700">
          {details.map((detail) => (
            <div key={`${hackathon.id}-${detail.key}`} className="flex items-center gap-2">
              <span className="flex w-10 items-center justify-center text-slate-400">
                {detailsIcons[detail.key]}
              </span>
              <span>{detail.text}</span>
            </div>
          ))}
        </div>

        <PrimaryActionButton
          fullWidth
          onClick={(event) => {
            event.stopPropagation();
            onOpenDetail();
          }}
        >
          상세보기 -&gt;
        </PrimaryActionButton>
      </BaseInfoCard>
    </div>
  );
};

const HackathonListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchCategory, setSearchCategory] = useState("title");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [hackathonItems, setHackathonItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadHackathons = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch("/hackathons");
        const result = await response.json();

        if (!response.ok || !result?.isSuccess) {
          throw new Error(result?.message || "해커톤 목록을 불러오지 못했습니다.");
        }

        const normalizedItems = result.data.hackathons.map((item) => {
          const statusMeta = getStatusMeta(item.start_at, item.end_at);

          return {
            ...item,
            ...statusMeta,
            dDay: getDdayLabel(item.end_at, statusMeta.status),
            period: formatPeriod(item.start_at, item.end_at),
            region: getRegionValue(item.location),
          };
        });

        if (isMounted) {
          setHackathonItems(normalizedItems);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "해커톤 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadHackathons();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredHackathons = useMemo(() => {
    const loweredSearch = searchValue.trim().toLowerCase();

    return hackathonItems.filter((hackathon) => {
      const searchableText =
        searchCategory === "title" ? hackathon.title : `${hackathon.title} ${hackathon.location}`;

      const matchesSearch =
        loweredSearch.length === 0 || searchableText.toLowerCase().includes(loweredSearch);
      const matchesStatus = statusFilter === "all" || hackathon.status === statusFilter;
      const matchesRegion = regionFilter === "all" || hackathon.region === regionFilter;

      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [hackathonItems, regionFilter, searchCategory, searchValue, statusFilter]);

  const toggleFavorite = (hackathonId) => {
    setHackathonItems((prev) =>
      prev.map((hackathon) =>
        hackathon.id === hackathonId ? { ...hackathon, isStar: !hackathon.isStar } : hackathon,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F6FF]">
      <div className="mx-auto flex max-w-[1640px] flex-col gap-8 px-4 py-8 lg:flex-row lg:gap-14 lg:px-10 lg:py-10 2xl:gap-20">
        <aside className="w-full shrink-0 space-y-4 lg:sticky lg:top-28 lg:w-[294px] lg:self-start">
          <MiniCalendar />
          {sidebarRankings.map((ranking) => (
            <RankingSidebarCard key={ranking.title} {...ranking} />
          ))}
        </aside>

        <section className="min-w-0 flex-[1.18] space-y-10">
          <PageSectionHeader
            title="해커톤 목록"
            description="진행중인 행사부터 예정된 대회까지 한 번에 비교하고, 원하는 조건으로 빠르게 탐색할 수 있도록 구성했습니다."
          />

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
                key: "region",
                value: regionFilter,
                onChange: setRegionFilter,
                options: regionOptions,
              },
            ]}
          />

          {isLoading ? (
            <BaseInfoCard className="rounded-[28px] p-10 text-center text-sm font-medium text-slate-500">
              해커톤 목록을 불러오는 중입니다.
            </BaseInfoCard>
          ) : errorMessage ? (
            <BaseInfoCard className="rounded-[28px] p-10 text-center text-sm font-medium text-red-500">
              {errorMessage}
            </BaseInfoCard>
          ) : filteredHackathons.length === 0 ? (
            <BaseInfoCard className="rounded-[28px] p-10 text-center text-sm font-medium text-slate-500">
              조건에 맞는 해커톤이 없습니다.
            </BaseInfoCard>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:gap-7">
              {filteredHackathons.map((hackathon) => (
                <HackathonCard
                  key={hackathon.id}
                  hackathon={hackathon}
                  onToggleFavorite={() => toggleFavorite(hackathon.id)}
                  onOpenDetail={() =>
                    navigate(`/hackathons/${hackathon.id}`, {
                      state: { backgroundLocation: location },
                    })
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HackathonListPage;
