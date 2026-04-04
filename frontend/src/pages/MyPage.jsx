import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ActivityTemperatureCard from "../components/mypage/ActivityTemperatureCard";
import HackathonListSection from "../components/mypage/HackathonListSection";
import InboxSection from "../components/mypage/InboxSection";
import Modal from "../components/mypage/Modal";
import ProfileEditModal from "../components/mypage/ProfileEditModal";
import ProfileSection from "../components/mypage/ProfileSection";
import SavedHackathonsSection from "../components/mypage/SavedHackathonsSection";
import TeamCreateModal from "../components/mypage/TeamCreateModal";
import TeamStatusSection from "../components/mypage/TeamStatusSection";
import {
  initialProfile,
} from "../components/mypage/constants";
import { useMyPage } from "../hooks/useMyPage";
import { useSkill } from "../hooks/useSkill";
import { useTemperature } from "../hooks/useTemperature";
import { useTeam } from "../hooks/useTeam";
import { getCurrentUser } from "../utils/auth";

const TEAMS_STORAGE_KEY = "mypageTeams";
const fallbackSkills = [
  { id: 1, name: "React" },
  { id: 2, name: "TypeScript" },
  { id: 3, name: "Node.js" },
];

const emptyProfile = {
  ...initialProfile,
  name: "",
  email: "",
  intro: "",
  github: "",
  portfolio: "",
  skills: [],
};

const normalizeSkillLabel = (skill, skillLabelMap) => {
  if (typeof skill === "number") {
    return skillLabelMap[skill] || `Skill ${skill}`;
  }

  // 마이페이지 조회 응답이 숫자 id 배열이 아닐 때도 화면이 깨지지 않도록 이름을 우선 사용합니다.
  if (skill && typeof skill === "object") {
    if (typeof skill.name === "string" && skill.name.trim()) {
      return skill.name;
    }

    if (typeof skill.id === "number") {
      return skillLabelMap[skill.id] || `Skill ${skill.id}`;
    }
  }

  return String(skill || "");
};

const MyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getMyPage, updateMyPage } = useMyPage();
  const { getAllSkills } = useSkill();
  const { getTemperatureMembers, submitTemperatureVote, isLoading: isTemperatureLoading } =
    useTemperature();
  const { handleCreateTeam: requestCreateTeam, isLoading, createTeamError } =
    useTeam();
  const [profile, setProfile] = useState(emptyProfile);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTeamCreateOpen, setIsTeamCreateOpen] = useState(false);
  const [teamCreateErrorMessage, setTeamCreateErrorMessage] = useState("");
  const [editForm, setEditForm] = useState(emptyProfile);
  const [skillQuery, setSkillQuery] = useState("");
  const [temperature, setTemperature] = useState(43.5);
  const [voteLocks, setVoteLocks] = useState({});
  const [savedItems, setSavedItems] = useState([]);
  const [hackathonItems, setHackathonItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [availableSkills, setAvailableSkills] = useState(fallbackSkills);
  const [teamItems, setTeamItems] = useState([]);
  const [pageLoadError, setPageLoadError] = useState("");
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [temperatureMembers, setTemperatureMembers] = useState([]);
  const [temperatureErrorMessage, setTemperatureErrorMessage] = useState("");
  const isTeamCreateGuideOpen = Boolean(location.state?.showTeamCreateGuide);

  const closeTeamCreateGuide = () => {
    // 해커톤 상세에서 전달한 안내 state를 지워야 뒤로 가기나 재진입 시 팝업이 반복되지 않습니다.
    navigate(location.pathname, { replace: true, state: {} });
  };

  const skillValueMap = useMemo(
    () =>
      availableSkills.reduce((acc, skill) => {
        acc[skill.name] = skill.id;
        return acc;
      }, {}),
    [availableSkills],
  );

  useEffect(() => {
    const fetchMyPage = async () => {
      const currentUser = getCurrentUser();
      const userId = currentUser?.userId;

      if (!userId) {
        setPageLoadError("로그인 사용자 정보를 찾지 못했습니다.");
        return;
      }

      setPageLoadError("");

      const skillResult = await getAllSkills();
      const nextSkills = Array.isArray(skillResult?.data?.skills)
        ? skillResult.data.skills
        : fallbackSkills;

      console.log("[MyPage] getAllSkills result:", skillResult);
      console.log("[MyPage] available skills:", nextSkills);

      if (!skillResult?.isSuccess) {
        console.error("[MyPage] /user/skills failed:", skillResult?.message);
      }

      setAvailableSkills(nextSkills);

      const nextSkillLabelMap = nextSkills.reduce((acc, skill) => {
        acc[skill.id] = skill.name;
        return acc;
      }, {});

      const result = await getMyPage(userId);

      console.log("[MyPage] getMyPage result:", result);

      if (!result?.isSuccess || !result.data) {
        console.error("[MyPage] /user/:userId/mypage failed:", result?.message);
        setPageLoadError(result?.message || "마이페이지 데이터를 불러오지 못했습니다.");
        return;
      }

      const { data } = result;

      const nextProfile = {
        ...initialProfile,
        name: data.nickname || "",
        email: data.email || "",
        intro: data.description || "",
        github: data.github || "",
        portfolio: data.portfolio || "",
        skills: Array.isArray(data.skills)
          ? data.skills
              .map((skill) => normalizeSkillLabel(skill, nextSkillLabelMap))
              .filter(Boolean)
          : [],
      };

      console.log("[MyPage] getMyPage raw skills:", data.skills);
      console.log("[MyPage] mapped profile skills:", nextProfile.skills);

      setProfile(nextProfile);
      setEditForm(nextProfile);
      setTemperature(data.temperature ?? 43.5);
      setHackathonItems(
        data.part_hackathon?.map((hackathon) => ({
          id: `h${hackathon.hackathonId}`,
          hackathonId: hackathon.hackathonId,
          title: hackathon.hackathonName,
          status: "진행중",
          date: `${hackathon.start} - ${hackathon.end}`,
        })) || [],
      );
      setSavedItems(
        data.save_hackathon?.map((hackathon) => ({
          id: `s${hackathon.hackathonId}`,
          title: hackathon.hackathonName,
          org: `deadline ${hackathon.end}`,
        })) || [],
      );
      setUnreadCount(data.unread ?? 0);
      const nextTeams =
        data.teams?.map((team) => ({
          id: `t${team.teamId}`,
          name: team.teamName,
          description: team.description,
        })) || [];

      setTeamItems(nextTeams);
      localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(nextTeams));
    };

    fetchMyPage();
  }, [getAllSkills, getMyPage]);

  const filteredSkills = useMemo(
    () =>
      availableSkills
        .map((skill) => skill.name)
        .filter(
          (skill) =>
            skill.toLowerCase().includes(skillQuery.toLowerCase()) &&
            !editForm.skills.includes(skill),
        ),
    [availableSkills, skillQuery, editForm.skills],
  );

  const stats = [
    { label: "Teams", value: `${teamItems.length}`, icon: "wins" },
    { label: "Joined", value: `${hackathonItems.length}`, icon: "join" },
    { label: "Saved", value: `${savedItems.length}`, icon: "bookmark" },
    { label: "Skills", value: `${profile.skills.length}`, icon: "rank" },
  ];

  const openEditModal = () => {
    setEditForm(profile);
    setSkillQuery("");
    setIsEditOpen(true);
  };

  const handleOpenVote = async (hackathon) => {
    const currentUser = getCurrentUser();
    const userId = currentUser?.userId;

    setSelectedHackathon(hackathon);
    setTemperatureMembers([]);
    setTemperatureErrorMessage("");

    if (!userId) {
      setTemperatureErrorMessage("로그인 사용자 정보를 찾지 못했습니다.");
      return;
    }

    if (!hackathon.hackathonId) {
      setTemperatureErrorMessage("참여한 해커톤 데이터에 hackathonId가 없습니다.");
      return;
    }

    const result = await getTemperatureMembers(userId, hackathon.hackathonId);
    if (!result?.isSuccess || !result.data) {
      setTemperatureErrorMessage(result?.message || "온도 평가 대상을 불러오지 못했습니다.");
      return;
    }

    setTemperatureMembers(result.data.members ?? []);
  };

  const handleCloseVote = () => {
    setSelectedHackathon(null);
    setTemperatureMembers([]);
    setTemperatureErrorMessage("");
  };

  const handleVote = async (hackathon, member, plus) => {
    const currentUser = getCurrentUser();
    const userId = currentUser?.userId;
    const voteKey = `${hackathon.id}:${member.userId}`;

    if (voteLocks[voteKey]) return;
    if (!userId || !hackathon.hackathonId || !member.canSet) return;

    const result = await submitTemperatureVote(userId, hackathon.hackathonId, {
      userId: member.userId,
      plus,
    });

    if (!result?.isSuccess) {
      setTemperatureErrorMessage(result?.message || "온도 평가 제출에 실패했습니다.");
      return;
    }

    setVoteLocks((prev) => ({
      ...prev,
      [voteKey]: plus ? "up" : "down",
    }));
    setTemperatureMembers((prev) =>
      prev.map((entry) => (entry.userId === member.userId ? { ...entry, canSet: false } : entry)),
    );
    setTemperature((prev) => Number((prev + (plus ? 0.3 : -0.2)).toFixed(1)));
  };

  const closeEditModal = () => setIsEditOpen(false);

  const saveProfile = async () => {
    const currentUser = getCurrentUser();
    const userId = currentUser?.userId;

    if (!userId) {
      alert("No logged-in user was found.");
      return;
    }

    const mappedSkillIds = editForm.skills
      .map((skill) => skillValueMap[skill])
      .filter((skill) => typeof skill === "number");

    console.log("[MyPage] editForm skills before save:", editForm.skills);
    console.log("[MyPage] skillValueMap:", skillValueMap);
    console.log("[MyPage] mapped skill ids for PATCH:", mappedSkillIds);

    const result = await updateMyPage(userId, {
      nickname: editForm.name,
      description: editForm.intro,
      portfolio: editForm.portfolio,
      github: editForm.github,
      skills: mappedSkillIds,
    });

    console.log("[MyPage] updateMyPage result:", result);

    if (!result?.isSuccess) {
      alert(result?.message || "Profile update failed.");
      return;
    }

    setProfile(editForm);
    setIsEditOpen(false);
  };

  const handleRemoveSavedHackathon = (hackathonId) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== hackathonId));
  };

  const handleOpenTeamCreateModal = () => {
    setTeamCreateErrorMessage("");
    setIsTeamCreateOpen(true);
  };

  const handleCloseTeamCreateModal = () => {
    setTeamCreateErrorMessage("");
    setIsTeamCreateOpen(false);
  };

  const handleCreateTeam = async (teamData) => {
    const currentUser = getCurrentUser();
    const userId = currentUser?.userId;

    if (!userId) {
      const result = {
        isSuccess: false,
        message: "No logged-in user was found.",
      };
      setTeamCreateErrorMessage(result.message);
      return result;
    }

    const result = await requestCreateTeam(userId, teamData);

    if (!result?.isSuccess) {
      setTeamCreateErrorMessage(result?.message || "Team creation failed.");
      return result;
    }

    const newTeamId = result.data?.teamId
      ? `t${result.data.teamId}`
      : `t${Date.now()}`;
    const newMemberId = `tm${Date.now()}`;

    setTeamItems((prev) => {
      const nextTeams = [
        {
          id: newTeamId,
          name: teamData.name,
          role: "leader",
          leaderId: newMemberId,
          description: teamData.description,
          linkedHackathonId: null,
          members: [
            {
              id: newMemberId,
              name: currentUser?.name || profile.name,
              nickname:
                currentUser?.nickName ||
                currentUser?.userNickname ||
                profile.name,
              email: currentUser?.email || currentUser?.userEmail || profile.email,
              role: "leader",
              part: teamData.role,
            },
          ],
        },
        ...prev,
      ];

      localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(nextTeams));
      return nextTeams;
    });

    setTeamCreateErrorMessage("");
    setIsTeamCreateOpen(false);
    return result;
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto grid w-full max-w-[1200px] gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          {pageLoadError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              마이페이지 API 호출 실패: {pageLoadError}
            </div>
          ) : null}
          <ProfileSection profile={profile} onEdit={openEditModal} />

          <div className="grid gap-4 lg:grid-cols-2">
            <HackathonListSection
              hackathons={hackathonItems}
              isTemperatureLoading={isTemperatureLoading}
              selectedHackathon={selectedHackathon}
              temperatureError={temperatureErrorMessage}
              temperatureMembers={temperatureMembers}
              voteLocks={voteLocks}
              onCloseVote={handleCloseVote}
              onOpenVote={handleOpenVote}
              onVote={handleVote}
            />

            <TeamStatusSection
              teams={teamItems}
              onOpenTeam={(teamId) => navigate(`/mypage/teams/${teamId}`)}
              onAddTeam={handleOpenTeamCreateModal}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ActivityTemperatureCard temperature={temperature} stats={stats} />

          <SavedHackathonsSection
            savedHackathons={savedItems}
            onRemove={handleRemoveSavedHackathon}
          />

          <InboxSection unreadCount={unreadCount} />
        </div>
      </div>

      <ProfileEditModal
        isOpen={isEditOpen}
        editForm={editForm}
        setEditForm={setEditForm}
        skillQuery={skillQuery}
        setSkillQuery={setSkillQuery}
        filteredSkills={filteredSkills}
        onClose={closeEditModal}
        onSave={saveProfile}
      />

      <TeamCreateModal
        isOpen={isTeamCreateOpen}
        onClose={handleCloseTeamCreateModal}
        onCreate={handleCreateTeam}
        isCreating={isLoading}
        createError={teamCreateErrorMessage || createTeamError || ""}
      />

      {isTeamCreateGuideOpen ? (
        <Modal
          title="팀 생성 안내"
          onClose={closeTeamCreateGuide}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm leading-6 text-slate-600">
              소속 팀 현황 영역에서 <span className="font-bold text-[#2458E6]">+</span> 버튼을 눌러
              팀을 생성할 수 있습니다.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeTeamCreateGuide}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#336DFE] px-4 text-sm font-bold text-white transition hover:bg-[#2458E6]"
              >
                확인
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default MyPage;
