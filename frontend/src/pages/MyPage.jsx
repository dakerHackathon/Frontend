import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActivityTemperatureCard from "../components/mypage/ActivityTemperatureCard";
import HackathonListSection from "../components/mypage/HackathonListSection";
import InboxSection from "../components/mypage/InboxSection";
import ProfileEditModal from "../components/mypage/ProfileEditModal";
import ProfileSection from "../components/mypage/ProfileSection";
import SavedHackathonsSection from "../components/mypage/SavedHackathonsSection";
import TeamCreateModal from "../components/mypage/TeamCreateModal";
import TeamStatusSection from "../components/mypage/TeamStatusSection";
import {
  initialHackathons,
  initialProfile,
  savedHackathons,
  skillPool,
  teams,
} from "../components/mypage/constants";
import { useMyPage } from "../hooks/useMyPage";
import { useTeam } from "../hooks/useTeam";
import { getCurrentUser } from "../utils/auth";

const TEAMS_STORAGE_KEY = "mypageTeams";

const getStoredTeams = () => {
  const storedTeams = localStorage.getItem(TEAMS_STORAGE_KEY);
  return storedTeams ? JSON.parse(storedTeams) : teams;
};

const skillLabelMap = {
  1: "React",
  2: "TypeScript",
  3: "Node.js",
};
const skillValueMap = {
  React: 1,
  TypeScript: 2,
  "Node.js": 3,
};

const getSkillLabel = (skill) => {
  if (typeof skill === "string") {
    return skill;
  }

  if (typeof skill === "number") {
    return skillLabelMap[skill] || `Skill ${skill}`;
  }

  if (skill && typeof skill === "object") {
    if (typeof skill.name === "string" && skill.name.trim()) {
      return skill.name;
    }

    if (typeof skill.id === "number") {
      return skillLabelMap[skill.id] || `Skill ${skill.id}`;
    }
  }

  return null;
};

const getCurrentUserNickname = (currentUser, profile) =>
  currentUser?.userNickname ||
  currentUser?.nickName ||
  currentUser?.nickname ||
  profile.name;

const MyPage = () => {
  const navigate = useNavigate();
  const { getMyPage, updateMyPage } = useMyPage();
  const { handleCreateTeam: requestCreateTeam, isLoading, createTeamError } =
    useTeam();
  const [profile, setProfile] = useState(initialProfile);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTeamCreateOpen, setIsTeamCreateOpen] = useState(false);
  const [teamCreateErrorMessage, setTeamCreateErrorMessage] = useState("");
  const [editForm, setEditForm] = useState(initialProfile);
  const [skillQuery, setSkillQuery] = useState("");
  const [temperature, setTemperature] = useState(43.5);
  const [voteLocks, setVoteLocks] = useState({});
  const [savedItems, setSavedItems] = useState(savedHackathons);
  const [hackathonItems, setHackathonItems] = useState(initialHackathons);
  const [unreadCount, setUnreadCount] = useState(3);
  const [teamItems, setTeamItems] = useState(() => getStoredTeams());

  useEffect(() => {
    const fetchMyPage = async () => {
      const currentUser = getCurrentUser();
      const userId = currentUser?.userId;

      if (!userId) return;

      const result = await getMyPage(userId);

      if (!result?.isSuccess || !result.data) return;

      const { data } = result;
      console.log("[MyPage] getMyPage nickname:", data.nickname);

      const nextProfile = {
        ...initialProfile,
        name: data.nickname || "",
        email: data.email || "",
        intro: data.description || "",
        github: data.github || "",
        portfolio: data.portfolio || "",
        skills: Array.isArray(data.skills)
          ? data.skills.map(getSkillLabel).filter(Boolean)
          : [],
      };

      setProfile(nextProfile);
      setEditForm(nextProfile);
      setTemperature(data.temperature ?? 43.5);
      setHackathonItems(
        data.part_hackathon?.map((hackathon) => ({
          id: `h${hackathon.hackathonId}`,
          title: hackathon.hackathonName,
          status: "active",
          date: `${hackathon.start} - ${hackathon.end}`,
          members: [
            {
              id: `member-${hackathon.hackathonId}`,
              name: data.nickname || "mock-user",
            },
          ],
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
      const storedTeams = getStoredTeams();
      const nextTeams =
        data.teams?.map((team) => {
          const teamId = `t${team.teamId}`;
          const storedTeam =
            storedTeams.find((item) => item.id === teamId) ||
            storedTeams.find((item) => item.name === team.teamName);

          return {
            ...storedTeam,
            id: teamId,
            name: team.teamName,
            description: team.description,
          };
        }) || [];

      // 마이페이지 조회 결과가 보이도록 목록 기준값을 API 응답으로 다시 맞춥니다.
      // 팀 상세에서 닉네임이 사라지지 않도록 기존 멤버 정보를 유지합니다.
      setTeamItems(nextTeams);
      localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(nextTeams));
    };

    fetchMyPage();
  }, [getMyPage]);

  const filteredSkills = useMemo(
    () =>
      skillPool.filter(
        (skill) =>
          skill.toLowerCase().includes(skillQuery.toLowerCase()) &&
          !editForm.skills.includes(skill),
      ),
    [skillQuery, editForm.skills],
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

  const handleVote = (hackathonId, memberId, value) => {
    const voteKey = `${hackathonId}:${memberId}`;
    if (voteLocks[voteKey]) return;

    setVoteLocks((prev) => ({
      ...prev,
      [voteKey]: value > 0 ? "up" : "down",
    }));
    setTemperature((prev) => Number((prev + value).toFixed(1)));
  };

  const closeEditModal = () => setIsEditOpen(false);

  const saveProfile = async () => {
    const currentUser = getCurrentUser();
    const userId = currentUser?.userId;

    if (!userId) {
      alert("No logged-in user was found.");
      return;
    }

    const result = await updateMyPage(userId, {
      nickname: editForm.name,
      description: editForm.intro,
      portfolio: editForm.portfolio,
      github: editForm.github,
      // 수정 API 명세가 숫자 배열을 요구해서 화면용 스킬 라벨을 요청 값으로 다시 매핑합니다.
      skills: editForm.skills
        .map((skill) => skillValueMap[skill])
        .filter((skill) => typeof skill === "number"),
    });
    console.log("[MyPage] updateMyPage nickname payload:", editForm.name);
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
              nickname: getCurrentUserNickname(currentUser, profile),
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
          <ProfileSection profile={profile} onEdit={openEditModal} />

          <div className="grid gap-4 lg:grid-cols-2">
            <HackathonListSection
              hackathons={hackathonItems}
              voteLocks={voteLocks}
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
    </div>
  );
};

export default MyPage;
