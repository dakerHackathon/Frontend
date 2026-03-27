import { useMemo, useState } from "react";
import ActivityTemperatureCard from "../components/mypage/ActivityTemperatureCard";
import HackathonListSection from "../components/mypage/HackathonListSection";
import InboxSection from "../components/mypage/InboxSection";
import ProfileEditModal from "../components/mypage/ProfileEditModal";
import ProfileSection from "../components/mypage/ProfileSection";
import SavedHackathonsSection from "../components/mypage/SavedHackathonsSection";
import TeamMembersModal from "../components/mypage/TeamMembersModal";
import TeamStatusSection from "../components/mypage/TeamStatusSection";
import {
  initialHackathons,
  initialProfile,
  savedHackathons,
  skillPool,
  teams,
} from "../components/mypage/constants";

const MyPage = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(initialProfile);
  const [skillQuery, setSkillQuery] = useState("");
  const [temperature, setTemperature] = useState(43.5);
  const [voteLocks, setVoteLocks] = useState({});
  const [teamModal, setTeamModal] = useState(null);

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
    { label: "나의 북마크", value: `${savedHackathons.length}개`, icon: "bookmark" },
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

    // TODO: 백엔드 연동 시 온도 반영 로직 이관
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

            <TeamStatusSection teams={teams} onOpenTeam={setTeamModal} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ActivityTemperatureCard temperature={temperature} stats={stats} />

          <SavedHackathonsSection savedHackathons={savedHackathons} />

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

      <TeamMembersModal
        team={teamModal}
        onClose={() => setTeamModal(null)}
        currentUserEmail={profile.email}
      />
    </div>
  );
};

export default MyPage;
