import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPartMeta } from "../components/mypage/teamDetail/shared";
import { initialProfile, inviteCandidatePool, teams } from "../components/mypage/constants";
import { useTeam } from "./useTeam";
import { getCurrentUser } from "../utils/auth";

const TEAMS_STORAGE_KEY = "mypageTeams";
const TEAM_LEADER_LABEL = "팀장";

const teamPositionMap = {
  1: "planner",
  2: "frontend",
  3: "backend",
  4: "designer",
};

const teamRoleRequestMap = {
  planner: 1,
  frontend: 2,
  backend: 3,
  designer: 4,
};

const getStoredTeams = () => {
  const storedTeams = localStorage.getItem(TEAMS_STORAGE_KEY);
  return storedTeams ? JSON.parse(storedTeams) : teams;
};

const isLeaderRole = (role) => role === "leader" || role === TEAM_LEADER_LABEL;
const getRequestTeamId = (teamId) => Number(String(teamId).replace(/^t/, ""));

const getMemberEmail = (member, currentUser, currentUserEmail) => {
  // 팀 상세 명세에는 이메일이 없어 현재 로그인 사용자만 확정된 이메일을 사용합니다.
  if (member.userId === currentUser?.userId) {
    return currentUserEmail;
  }

  return "";
};

const getFallbackTeamRole = (sourceTeam, userId) => {
  if (!sourceTeam) {
    return "팀원";
  }

  if (isLeaderRole(sourceTeam.role)) {
    return TEAM_LEADER_LABEL;
  }

  const sourceMember = sourceTeam.members?.find((member) => member.userId === userId);
  if (sourceMember?.role && isLeaderRole(sourceMember.role)) {
    return TEAM_LEADER_LABEL;
  }

  return sourceTeam.role || "팀원";
};

export const useTeamDetailPage = (teamId) => {
  const navigate = useNavigate();
  const { getLeaderTeams, getTeamDetail, updateTeam, updateMemberPosition, deleteTeam, leaveTeam, expellMember, inviteMember } =
    useTeam();

  const currentUser = getCurrentUser();
  const userId = currentUser?.userId;
  const currentUserEmail = currentUser?.email || initialProfile.email;
  const requestTeamId = getRequestTeamId(teamId);

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
      ? { name: sourceTeam.name, description: sourceTeam.description }
      : { name: "", description: "" },
  );
  const [members, setMembers] = useState(() => sourceTeam?.members ?? []);
  const [teamRole, setTeamRole] = useState(() => sourceTeam?.role ?? "");
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [inviteQuery, setInviteQuery] = useState("");
  const [invitePart, setInvitePart] = useState("frontend");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteNotice, setInviteNotice] = useState("");
  const [saveNotice, setSaveNotice] = useState("");

  useEffect(() => {
    const fetchTeamDetail = async () => {
      if (!userId || !requestTeamId) return;

      const [leaderTeamsResult, result] = await Promise.all([
        getLeaderTeams(userId),
        getTeamDetail(userId, requestTeamId),
      ]);
      const isLeaderTeam =
        leaderTeamsResult?.data?.teams?.some((team) => Number(team.teamId) === requestTeamId) ?? false;

      if (!result?.isSuccess || !result.data) {
        if (isLeaderTeam) {
          setTeamRole(TEAM_LEADER_LABEL);
        }
        return;
      }

      const nextMembers =
        result.data.member?.map((member) => ({
          id: `tm${member.userId}`,
          userId: member.userId,
          // 명세에는 이름이 없어 닉네임을 대표 표시 이름으로 사용합니다.
          name: member.nickName || "",
          nickname: member.nickName || "",
          email: getMemberEmail(member, currentUser, currentUserEmail),
          role: member.isLeader ? TEAM_LEADER_LABEL : "팀원",
          part: teamPositionMap[member.position] || "frontend",
        })) ?? [];

      const currentMember = result.data.member?.find((member) => member.userId === userId);
      const nextTeam = result.data.team ?? {};
      const hasApiMembers = nextMembers.length > 0;

      setTeamForm({
        name: nextTeam.teamName || sourceTeam?.name || "",
        description: nextTeam.description || sourceTeam?.description || "",
      });
      setMembers(hasApiMembers ? nextMembers : sourceTeam?.members ?? []);
      setTeamRole(
        isLeaderTeam
          ? TEAM_LEADER_LABEL
          : currentMember
          ? currentMember.isLeader
            ? TEAM_LEADER_LABEL
            : "팀원"
          : getFallbackTeamRole(sourceTeam, userId),
      );
    };

    fetchTeamDetail();
  }, [
    currentUser,
    currentUserEmail,
    getLeaderTeams,
    getTeamDetail,
    requestTeamId,
    sourceTeam,
    sourceTeam?.description,
    sourceTeam?.name,
    userId,
  ]);

  const updateStoredTeam = (updater) => {
    const nextTeams = getStoredTeams().map((team) =>
      team.id === teamId ? updater(team) : team,
    );
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(nextTeams));
  };

  const filteredCandidates = useMemo(
    () =>
      inviteCandidatePool.filter((candidate) => {
        if (members.some((member) => member.email && member.email === candidate.email)) return false;
        if (!inviteQuery.trim()) return true;

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
      }),
    [inviteQuery, members],
  );

  const handleTeamSave = async (nextTeamForm) => {
    setTeamForm((prev) => ({ ...prev, ...nextTeamForm }));
    updateStoredTeam((team) => ({
      ...team,
      name: nextTeamForm.name,
      description: nextTeamForm.description,
    }));

    if (userId && requestTeamId) {
      const result = await updateTeam(userId, requestTeamId, {
        name: nextTeamForm.name,
        description: nextTeamForm.description,
      });

      if (!result?.isSuccess) {
        console.error("팀 정보 수정 실패:", result?.message);
      }
    }

    setSaveNotice("팀 정보 수정 내용이 임시 저장되었습니다.");
  };

  const handlePartChange = async (memberId, value) => {
    setMembers((prev) =>
      prev.map((member) => (member.id === memberId ? { ...member, part: value } : member)),
    );
    updateStoredTeam((team) => ({
      ...team,
      members: (team.members ?? []).map((member) =>
        member.id === memberId ? { ...member, part: value } : member,
      ),
    }));

    if (userId && requestTeamId) {
      const targetUserId = Number(memberId.replace(/^tm/, ""));
      const position = teamRoleRequestMap[value];

      if (targetUserId && position) {
        const result = await updateMemberPosition(userId, requestTeamId, {
          userId: targetUserId,
          position,
        });

        if (!result?.isSuccess) {
          console.error("팀원 포지션 수정 실패:", result?.message);
        }
      }
    }
  };

  const handleInvite = async () => {
    const invitedUser = filteredCandidates.find((candidate) => candidate.id === selectedCandidateId);

    if (!invitedUser) {
      setInviteNotice("초대할 사용자를 먼저 선택해 주세요.");
      return;
    }

    if (userId && requestTeamId) {
      const inviteeUserId = Number(invitedUser.id.replace(/\D/g, ""));
      const position = teamRoleRequestMap[invitePart];
      const result = await inviteMember(userId, requestTeamId, {
        userId: inviteeUserId,
        position,
        content: inviteMessage,
      });

      if (!result?.isSuccess) {
        console.error("팀원 초대 실패:", result?.message);
      }
    }

    setSelectedCandidateId("");
    setInviteQuery("");
    setInvitePart("frontend");
    setInviteMessage("");
    setInviteNotice(`${invitedUser.nickname} 님에게 초대를 보냈습니다. 수락 후 팀원이 추가됩니다.`);
  };

  const handleSendMessage = (member) => {
    if (!member.email) {
      setSaveNotice("팀 상세 응답에 이메일이 없어 쪽지 기능은 아직 연결되지 않았습니다.");
      return;
    }

    navigate("/mails", {
      state: { composeTo: member.email, composeSubject: `[${teamForm.name}] ` },
    });
  };

  const handleKickMember = async (member) => {
    setMembers((prev) => prev.filter((entry) => entry.id !== member.id));
    updateStoredTeam((team) => ({
      ...team,
      members: (team.members ?? []).filter((entry) => entry.id !== member.id),
    }));

    if (userId && requestTeamId) {
      const result = await expellMember(userId, {
        teamId: requestTeamId,
        userId: Number(member.id.replace(/^tm/, "")),
      });

      if (!result?.isSuccess) {
        console.error("팀원 내보내기 실패:", result?.message);
      }
    }

    setSaveNotice(`${member.name} 님을 팀에서 제외했습니다.`);
  };

  const handleLeaveTeam = async (member) => {
    setMembers((prev) => prev.filter((entry) => entry.id !== member.id));
    updateStoredTeam((team) => ({
      ...team,
      members: (team.members ?? []).filter((entry) => entry.id !== member.id),
    }));

    if (userId) {
      const result = await leaveTeam(userId, { teamId: requestTeamId });

      if (!result?.isSuccess) {
        console.error("팀 탈퇴 실패:", result?.message);
      }
    }

    setSaveNotice(`${member.name} 님이 팀을 나갔습니다.`);
  };

  const handleDisbandTeam = async () => {
    if (!userId || !requestTeamId) {
      setSaveNotice("팀 해체에 필요한 사용자 정보가 없습니다.");
      return;
    }

    const result = await deleteTeam(userId, { teamId: requestTeamId });

    if (!result?.isSuccess) {
      console.error("팀 해체 실패:", result?.message);
      setSaveNotice(result?.message || "팀 해체에 실패했습니다.");
      return;
    }

    const nextTeams = getStoredTeams().filter((team) => team.id !== teamId);
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(nextTeams));
    navigate("/mypage", { replace: true });
  };

  return {
    currentUserId: userId,
    filteredCandidates,
    handleDisbandTeam,
    handleInvite,
    handleKickMember,
    handleLeaveTeam,
    handlePartChange,
    handleSendMessage,
    handleTeamSave,
    inviteMessage,
    inviteNotice,
    invitePart,
    inviteQuery,
    isLeader: isLeaderRole(teamRole),
    members,
    requestTeamId,
    saveNotice,
    selectedCandidateId,
    setInviteMessage,
    setInvitePart,
    setInviteQuery,
    setSelectedCandidateId,
    sourceTeam,
    teamForm,
    teamRole,
  };
};
