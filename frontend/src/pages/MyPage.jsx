import { useMemo, useState } from "react";
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

const TEAMS_STORAGE_KEY = "mypageTeams";

const MyPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(initialProfile);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTeamCreateOpen, setIsTeamCreateOpen] = useState(false);
  const [editForm, setEditForm] = useState(initialProfile);
  const [skillQuery, setSkillQuery] = useState("");
  const [temperature, setTemperature] = useState(43.5);
  const [voteLocks, setVoteLocks] = useState({});
  const [savedItems, setSavedItems] = useState(savedHackathons);
  const [teamItems, setTeamItems] = useState(() => {
    const storedTeams = localStorage.getItem(TEAMS_STORAGE_KEY);
    return storedTeams ? JSON.parse(storedTeams) : teams;
  });

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
    { label: "우승 횟수", value: "3회", icon: "wins" },
    { label: "참여 횟수", value: "8회", icon: "join" },
    { label: "관심 북마크", value: `${savedItems.length}개`, icon: "bookmark" },
    { label: "종합 랭킹", value: "18위", icon: "rank" },
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

  const saveProfile = () => {
    setProfile(editForm);
    setIsEditOpen(false);
  };

  const handleRemoveSavedHackathon = (hackathonId) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== hackathonId));
  };

  const handleCreateTeam = (teamData) => {
    const newTeamId = `t${Date.now()}`;
    const newMemberId = `tm${Date.now()}`;

    setTeamItems((prev) => {
      const nextTeams = [
        {
          id: newTeamId,
          name: teamData.name,
          role: "팀장",
          leaderId: newMemberId,
          description: teamData.description,
          linkedHackathonId: null,
          members: [
            {
              id: newMemberId,
              name: profile.name,
              nickname: profile.name,
              email: profile.email,
              role: "팀장",
              part: teamData.role,
            },
          ],
        },
        ...prev,
      ];

      localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(nextTeams));
      return nextTeams;
    });

    setIsTeamCreateOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto grid w-full max-w-[1200px] gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <ProfileSection profile={profile} onEdit={openEditModal} />

          <div className="grid gap-4 lg:grid-cols-2">
            <HackathonListSection
              hackathons={initialHackathons}
              voteLocks={voteLocks}
              onVote={handleVote}
            />

            <TeamStatusSection
              teams={teamItems}
              onOpenTeam={(teamId) => navigate(`/mypage/teams/${teamId}`)}
              onAddTeam={() => setIsTeamCreateOpen(true)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ActivityTemperatureCard temperature={temperature} stats={stats} />

          <SavedHackathonsSection
            savedHackathons={savedItems}
            onRemove={handleRemoveSavedHackathon}
          />

          <InboxSection unreadCount={3} />
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
        profile={profile}
        onClose={() => setIsTeamCreateOpen(false)}
        onCreate={handleCreateTeam}
      />
    </div>
  );
};

export default MyPage;
