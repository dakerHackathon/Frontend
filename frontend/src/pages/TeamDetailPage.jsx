import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import TeamBasicInfoCard from "../components/mypage/teamDetail/TeamBasicInfoCard";
import TeamInviteCard from "../components/mypage/teamDetail/TeamInviteCard";
import TeamMembersCard from "../components/mypage/teamDetail/TeamMembersCard";
import { getPartMeta } from "../components/mypage/teamDetail/shared.jsx";
import { initialProfile, inviteCandidatePool, teams } from "../components/mypage/constants";
import { useTeam } from "../hooks/useTeam";
import { getCurrentUser } from "../utils/auth";

const TEAMS_STORAGE_KEY = "mypageTeams";
const TEAM_LEADER_LABEL = "팀장";

const teamPositionMap = {
  1: "planner",
  2: "frontend",
  3: "backend",
  4: "designer",
};

const getStoredTeams = () => {
  const storedTeams = localStorage.getItem(TEAMS_STORAGE_KEY);
  return storedTeams ? JSON.parse(storedTeams) : teams;
};

const isLeaderRole = (role) => role === "leader" || role === TEAM_LEADER_LABEL;

const getRoleLabel = (role) => (isLeaderRole(role) ? TEAM_LEADER_LABEL : role);

const getRequestTeamId = (teamId) => Number(String(teamId).replace(/^t/, ""));

const TeamDetailPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { getTeamDetail } = useTeam();

  const sourceTeam = useMemo(() => {
    const storedTeam = getStoredTeams().find((team) => team.id === teamId) ?? null;
    const defaultTeam =
      teams.find((team) => team.id === teamId) ||
      teams.find((team) => team.name === storedTeam?.name) ||
      null;

    if (!storedTeam) {
      return defaultTeam;
    }

    return {
      ...defaultTeam,
      ...storedTeam,
      role: storedTeam.role ?? defaultTeam?.role,
      leaderId: storedTeam.leaderId ?? defaultTeam?.leaderId,
      members:
        storedTeam.members && storedTeam.members.length > 0
          ? storedTeam.members
          : defaultTeam?.members ?? [],
    };
  }, [teamId]);

  const [teamForm, setTeamForm] = useState(() =>
    sourceTeam
      ? {
          name: sourceTeam.name,
          description: sourceTeam.description,
        }
      : {
          name: "",
          description: "",
        },
  );
  const [members, setMembers] = useState(() => sourceTeam?.members ?? []);
  const [teamRole, setTeamRole] = useState(() => sourceTeam?.role ?? "");
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [inviteQuery, setInviteQuery] = useState("");
  const [invitePart, setInvitePart] = useState("frontend");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteNotice, setInviteNotice] = useState("");
  const [saveNotice, setSaveNotice] = useState("");
  const currentUserEmail = initialProfile.email;

  useEffect(() => {
    const fetchTeamDetail = async () => {
      const currentUser = getCurrentUser();
      const userId = currentUser?.userId;
      const requestTeamId = getRequestTeamId(teamId);

      if (!userId || !requestTeamId) {
        return;
      }

      const result = await getTeamDetail(userId, requestTeamId);

      if (!result?.isSuccess || !result.data) {
        return;
      }

      const { data } = result;
      const nextMembers =
        data.member?.map((member) => ({
          id: `tm${member.userId}`,
          name: member.nickName || "",
          // 명세에는 멤버 이름이 없어 닉네임을 같은 자리에도 사용합니다.
          nickname: member.nickName || "",
          email: currentUserEmail,
          role: member.isLeader ? TEAM_LEADER_LABEL : "팀원",
          part: teamPositionMap[member.position] || "frontend",
        })) ?? [];

      setTeamForm({
        name: data.team?.teamName || sourceTeam?.name || "",
        description: data.team?.description || sourceTeam?.description || "",
      });
      setMembers(nextMembers);
      setTeamRole(data.member?.some((member) => member.isLeader) ? TEAM_LEADER_LABEL : sourceTeam?.role || "");
    };

    fetchTeamDetail();
  }, [currentUserEmail, getTeamDetail, sourceTeam?.description, sourceTeam?.name, sourceTeam?.role, teamId]);

  if (!sourceTeam) {
    return <Navigate to="/mypage" replace />;
  }

  const isLeader = isLeaderRole(teamRole);

  const updateStoredTeam = (updater) => {
    const nextTeams = getStoredTeams().map((team) =>
      team.id === teamId ? updater(team) : team,
    );
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(nextTeams));
  };

  const filteredCandidates = inviteCandidatePool.filter((candidate) => {
    if (members.some((member) => member.email === candidate.email)) {
      return false;
    }

    if (!inviteQuery.trim()) {
      return true;
    }

    const searchText = [
      candidate.nickname,
      candidate.name,
      candidate.email,
      candidate.intro,
      ...candidate.parts.map((part) => getPartMeta(part).label),
    ]
      .join(" ")
      .toLowerCase();

    return searchText.includes(inviteQuery.trim().toLowerCase());
  });

  const handleTeamSave = (nextTeamForm) => {
    setTeamForm((prev) => ({ ...prev, ...nextTeamForm }));
    updateStoredTeam((team) => ({
      ...team,
      name: nextTeamForm.name,
      description: nextTeamForm.description,
    }));
    setSaveNotice("팀 정보 수정 내용이 임시 저장되었습니다.");
  };

  const handleMemberFieldChange = (memberId, key, value) => {
    setMembers((prev) =>
      prev.map((member) => (member.id === memberId ? { ...member, [key]: value } : member)),
    );
  };

  const handlePartChange = (memberId, value) => {
    handleMemberFieldChange(memberId, "part", value);
    updateStoredTeam((team) => ({
      ...team,
      members: (team.members ?? []).map((member) =>
        member.id === memberId ? { ...member, part: value } : member,
      ),
    }));
  };

  const handleInvite = () => {
    const invitedUser = filteredCandidates.find(
      (candidate) => candidate.id === selectedCandidateId,
    );

    if (!invitedUser) {
      setInviteNotice("초대할 사용자를 먼저 선택해 주세요.");
      return;
    }

    setSelectedCandidateId("");
    setInviteQuery("");
    setInvitePart("frontend");
    setInviteMessage("");
    setInviteNotice(
      `${invitedUser.nickname} 님에게 초대를 보냈습니다. 수락 후 팀원이 추가됩니다.`,
    );
  };

  const handleSendMessage = (member) => {
    navigate("/mails", {
      state: {
        composeTo: member.email,
        composeSubject: `[${teamForm.name}] `,
      },
    });
  };

  const handleKickMember = (member) => {
    setMembers((prev) => prev.filter((entry) => entry.id !== member.id));
    updateStoredTeam((team) => ({
      ...team,
      members: (team.members ?? []).filter((entry) => entry.id !== member.id),
    }));
    setSaveNotice(`${member.name} 님을 팀에서 제외했습니다.`);
  };

  const handleLeaveTeam = (member) => {
    setMembers((prev) => prev.filter((entry) => entry.id !== member.id));
    updateStoredTeam((team) => ({
      ...team,
      members: (team.members ?? []).filter((entry) => entry.id !== member.id),
    }));
    setSaveNotice(`${member.name} 님이 팀을 나갔습니다.`);
  };

  const handleDisbandTeam = () => {
    const nextTeams = getStoredTeams().filter((team) => team.id !== teamId);
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(nextTeams));
    setSaveNotice("팀이 해체되었습니다.");
  };

  return (
    <div className="min-h-screen bg-[#F3F6FF] px-4 py-8 sm:px-5 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/mypage" className="text-sm font-semibold text-[#336DFE] hover:underline">
              마이페이지로 돌아가기
            </Link>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              {teamForm.name}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              팀 소개와 팀원 역할, 초대 기능을 이곳에서 관리할 수 있습니다.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
            내 권한: <span className="font-black text-[#336DFE]">{getRoleLabel(teamRole)}</span>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
          <section className="space-y-6">
            <TeamBasicInfoCard
              isLeader={isLeader}
              teamForm={teamForm}
              saveNotice={saveNotice}
              onSave={handleTeamSave}
            />

            <TeamMembersCard
              members={members}
              isLeader={isLeader}
              currentUserEmail={currentUserEmail}
              onPartChange={handlePartChange}
              onSendMessage={handleSendMessage}
              onKickMember={handleKickMember}
              onLeaveTeam={handleLeaveTeam}
              onDisbandTeam={handleDisbandTeam}
            />
          </section>

          <aside className="space-y-6">
            {isLeader ? (
              <TeamInviteCard
                inviteQuery={inviteQuery}
                selectedCandidateId={selectedCandidateId}
                invitePart={invitePart}
                inviteMessage={inviteMessage}
                inviteNotice={inviteNotice}
                filteredCandidates={filteredCandidates}
                isLeader={isLeader}
                onInviteQueryChange={setInviteQuery}
                onCandidateSelect={setSelectedCandidateId}
                onInvitePartChange={setInvitePart}
                onInviteMessageChange={setInviteMessage}
                onInvite={handleInvite}
              />
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailPage;
