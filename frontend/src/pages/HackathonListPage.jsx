import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useHackathon } from "../hooks/useHackathon";
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
import { getRegionValue } from "./hackathonList.utils";
import {
  getHackathonUserId,
  HACKATHON_LIST_REFRESH_EVENT,
  HACKATHON_SAVE_UPDATED_EVENT,
} from "../utils/hackathon";

const HackathonListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchCategory, setSearchCategory] = useState("title");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [hackathonItems, setHackathonItems] = useState([]);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);
  const { fetchList, toggleSave, isLoading, isSaveLoading, error: errorMessage } = useHackathon();
  const currentUserId = getHackathonUserId();

  useEffect(() => {
    let isMounted = true;

    const loadHackathons = async () => {
      // 목록 응답을 화면 전용 필드까지 정규화해서 사용합니다.
      const result = await fetchList();

      if (isMounted) {
        setHackathonItems(
          (result?.data?.items ?? []).map((item) => ({
            ...item,
            region: getRegionValue(item.location),
          })),
        );
      }
    };

    loadHackathons();

    return () => {
      isMounted = false;
    };
  }, [fetchList, refreshTick]);

  useEffect(() => {
    const handleSaveUpdated = (event) => {
      const { hackathonId, isStar } = event.detail ?? {};

      if (!hackathonId) {
        return;
      }

      // 상세 모달에서 저장 상태를 바꾼 경우, 뒤에 떠 있는 목록 카드도 즉시 같은 상태로 맞춥니다.
      setHackathonItems((prev) =>
        prev.map((hackathon) =>
          hackathon.id === hackathonId ? { ...hackathon, isStar } : hackathon,
        ),
      );
    };

    window.addEventListener(HACKATHON_SAVE_UPDATED_EVENT, handleSaveUpdated);

    return () => {
      window.removeEventListener(HACKATHON_SAVE_UPDATED_EVENT, handleSaveUpdated);
    };
  }, []);

  useEffect(() => {
    const handleListRefresh = () => {
      // 같은 경로에서 헤더 메뉴를 다시 눌렀을 때 목록을 즉시 다시 조회합니다.
      setFavoriteMessage("");
      setRefreshTick((prev) => prev + 1);
    };

    window.addEventListener(HACKATHON_LIST_REFRESH_EVENT, handleListRefresh);

    return () => {
      window.removeEventListener(HACKATHON_LIST_REFRESH_EVENT, handleListRefresh);
    };
  }, []);

  const filteredHackathons = useMemo(() => {
    const loweredSearch = searchValue.trim().toLowerCase();

    return hackathonItems.filter((hackathon) => {
      const matchesSearch =
        loweredSearch.length === 0 || hackathon.title.toLowerCase().includes(loweredSearch);
      const matchesStatus = statusFilter === "all" || hackathon.status === statusFilter;
      const matchesRegion = regionFilter === "all" || hackathon.region === regionFilter;

      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [hackathonItems, regionFilter, searchValue, statusFilter]);

  const toggleFavorite = async (hackathonId) => {
    // 저장 토글은 서버 응답이 성공했을 때만 목록 상태를 갱신해 화면과 실제 값을 맞춥니다.
    const result = await toggleSave(hackathonId, currentUserId);

    if (!result?.isSuccess) {
      setFavoriteMessage(result?.message || "해커톤 저장 상태를 변경하지 못했습니다.");
      return;
    }

    setFavoriteMessage("");
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
            searchPlaceholder="제목을 입력해 주세요."
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
          ) : favoriteMessage ? (
            <BaseInfoCard className="rounded-[28px] p-10 text-center text-sm font-medium text-red-500">
              {favoriteMessage}
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
                      state: { backgroundLocation: location, hackathonSummary: hackathon },
                    })
                  }
                />
              ))}
            </div>
          )}

          {isSaveLoading ? (
            <p className="text-right text-sm font-medium text-slate-400">
              해커톤 저장 상태를 반영하고 있습니다.
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default HackathonListPage;
