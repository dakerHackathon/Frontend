import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { hackathonApi } from "../api/hackathon";
import { useApi } from "../hooks/common/useApi";
import MiniCalendar from "../components/common/MiniCalendar";
import PageSectionHeader from "../components/common/PageSectionHeader";
import RankingSidebarCard from "../components/common/RankingSidebarCard";
import SearchFilterBar from "../components/common/SearchFilterBar";
import BaseInfoCard from "../components/common/BaseInfoCard";
import HackathonCard from "../components/hackathon/HackathonCard";
import {
  regionOptions,
  searchOptions,
  sidebarRankings,
  statusOptions,
} from "./hackathonList.constants";
import { formatPeriod, getDdayLabel, getRegionValue, getStatusMeta } from "./hackathonList.utils";

const HackathonListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchCategory, setSearchCategory] = useState("title");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [hackathonItems, setHackathonItems] = useState([]);
  // useApi가 isLoading·error 상태를 관리하므로 별도 로컬 상태가 필요 없다.
  const { isLoading, error: errorMessage, execute } = useApi(hackathonApi.getList);

  useEffect(() => {
    let isMounted = true;

    const loadHackathons = async () => {
      try {
        // axiosInstance 인터셉터가 response.data를 반환하므로
        // result = { isSuccess, code, message, data: { hackathons: [...] } }
        const result = await execute();

        const normalizedItems = (result?.data?.hackathons ?? []).map((item) => {
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
      } catch {
        // 네트워크·HTTP 에러는 useApi가 errorMessage(error)로 자동 관리한다.
      }
    };

    loadHackathons();

    return () => {
      isMounted = false;
    };
  }, [execute]);

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
            searchPlaceholder="제목 또는 장소를 입력해 주세요."
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
