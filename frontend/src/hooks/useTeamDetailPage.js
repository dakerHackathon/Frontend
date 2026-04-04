import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildTeamPartOptions, initialProfile, teamPartOptions } from "../components/mypage/constants";
import { useTeam } from "./useTeam";
import { useUser } from "./useUser";
import { getCurrentUser } from "../utils/auth";

const TEAMS_STORAGE_KEY = "mypageTeams";
const TEAM_LEADER_LABEL = "팀장";

const teamRoleRequestMap = {
  planner: "planner",
  frontend: "frontend",
  backend: "backend",
};

const normalizePositionName = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const resolvePositionKey = (value) => {
  const normalizedValue = normalizePositionName(value);

  if (normalizedValue === "pm") return "planner";
  if (normalizedValue === "frontend") return "frontend";
  if (normalizedValue === "backend") return "backend";

  return null;
};

const getStoredTeams = () => {
  const storedTeams = localStorage.getItem(TEAMS_STORAGE_KEY);
  return storedTeams ? JSON.parse(storedTeams) : [];
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
  const { getLeaderTeams, getPositions, getTeamDetail, updateTeam, updateMemberPosition, deleteTeam, leaveTeam, expellMember, inviteMember } =
    useTeam();
  const { getTeamMembers, searchUsers, isLoading: isUserLoading } = useUser();

  const currentUser = getCurrentUser();
  const userId = currentUser?.userId;
  const currentUserEmail = currentUser?.email || initialProfile.email;
  const requestTeamId = getRequestTeamId(teamId);

  const sourceTeam = useMemo(() => {
    const storedTeam = getStoredTeams().find((team) => team.id === teamId) ?? null;

    if (!storedTeam) {
      return null;
    }

    return storedTeam;
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
  const [inviteCandidates, setInviteCandidates] = useState([]);
  const [positionIdMap, setPositionIdMap] = useState({});
  const [positionKeyMap, setPositionKeyMap] = useState({});
  const [partOptions, setPartOptions] = useState(teamPartOptions);
  const [saveNotice, setSaveNotice] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const fetchPositions = async () => {
      const result = await getPositions();
      if (!result?.isSuccess || !result.data) {
        console.error("[TeamDetail] /camp/positions failed:", result?.message);
        return;
      }

      console.log("[TeamDetail] /camp/positions result:", result.data.positions ?? []);

      const nextPositionIdMap = {};
      const nextPositionKeyMap = {};

      (result.data.positions ?? []).forEach((position) => {
        const positionKey = resolvePositionKey(position.name);
        if (!positionKey) {
          return;
        }

        nextPositionIdMap[positionKey] = position.id;
        nextPositionKeyMap[position.id] = positionKey;
      });

      console.log("[TeamDetail] positionIdMap:", nextPositionIdMap);
      console.log("[TeamDetail] positionKeyMap:", nextPositionKeyMap);
      setPositionIdMap(nextPositionIdMap);
      setPositionKeyMap(nextPositionKeyMap);
      const nextPartOptions = buildTeamPartOptions(result.data.positions);
      if (nextPartOptions.length > 0) {
        console.log("[TeamDetail] partOptions from positions:", nextPartOptions);
        setPartOptions(nextPartOptions);
      }
    };

    fetchPositions();
  }, [getPositions]);

  const selectedInvitePart =
    partOptions.find((option) => option.value === invitePart)?.value ??
    partOptions[0]?.value ??
    teamPartOptions[0].value;

  const fetchTeamDetail = useCallback(async () => {
    if (!userId || !requestTeamId) {
      setLoadError("팀 상세 조회에 필요한 사용자 또는 팀 정보가 없습니다.");
      return null;
    }

    const [leaderTeamsResult, result, membersInfoResult] = await Promise.all([
      getLeaderTeams(userId),
      getTeamDetail(userId, requestTeamId),
      getTeamMembers(userId, requestTeamId),
    ]);

    if (!leaderTeamsResult?.isSuccess) {
      console.error("[TeamDetail] /camp/:userId/team failed:", leaderTeamsResult?.message);
    }
    if (!membersInfoResult?.isSuccess) {
      console.error("[TeamDetail] /user/:userId/:teamId/member failed:", membersInfoResult?.message);
    }

    const memberInfoMap = (membersInfoResult?.data?.users ?? []).reduce((acc, user) => {
      acc[user.userId] = user;
      return acc;
    }, {});

    const isLeaderTeam =
      leaderTeamsResult?.data?.teams?.some((team) => Number(team.teamId) === requestTeamId) ?? false;

    if (!result?.isSuccess || !result.data) {
      console.error("[TeamDetail] /camp/:userId/team/:teamId failed:", result?.message);
      setLoadError(result?.message || "팀 상세 데이터를 불러오지 못했습니다.");
      if (isLeaderTeam) {
        setTeamRole(TEAM_LEADER_LABEL);
      }
      return null;
    }

    setLoadError("");

    const nextMembers =
      result.data.member?.map((member) => ({
        id: `tm${member.userId}`,
        userId: member.userId,
        // 팀원 사용자 정보 API의 이름/이메일로 팀 상세 데이터를 보강합니다.
        name: memberInfoMap[member.userId]?.userName || member.nickName || "",
        nickname: member.nickName || "",
        email: memberInfoMap[member.userId]?.userEmail || getMemberEmail(member, currentUser, currentUserEmail),
        // 리더 팀 목록으로 현재 사용자가 팀장임이 확인되면 카드 역할도 팀장으로 맞춥니다.
        role:
          member.isLeader || (isLeaderTeam && member.userId === userId)
            ? TEAM_LEADER_LABEL
            : "팀원",
        // 팀 상세의 position 숫자도 /camp/positions 기준으로 해석해야 PATCH/GET 결과가 어긋나지 않습니다.
        part: positionKeyMap[member.position] || "frontend",
      })) ?? [];

    console.log("[TeamDetail] team detail members:", result.data.member ?? []);
    console.log("[TeamDetail] mapped members:", nextMembers);

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

    return {
      members: hasApiMembers ? nextMembers : sourceTeam?.members ?? [],
    };
  }, [
    currentUser,
    currentUserEmail,
    getLeaderTeams,
    getTeamDetail,
    getTeamMembers,
    requestTeamId,
    positionKeyMap,
    sourceTeam,
    userId,
  ]);

  useEffect(() => {
    Promise.resolve().then(fetchTeamDetail);
  }, [fetchTeamDetail]);

  useEffect(() => {
    const fetchInviteCandidates = async () => {
      if (!inviteQuery.trim()) {
        setInviteCandidates([]);
        return;
      }

      const result = await searchUsers(inviteQuery.trim());
      if (!result?.isSuccess || !result.data) {
        console.error("[TeamDetail] /user/search failed:", result?.message);
        setInviteCandidates([]);
        return;
      }

      setInviteCandidates(
        (result.data.users ?? [])
          .map((user) => ({
            id: user.userId,
            userId: user.userId,
            // 검색 응답 필드명이 달라도 빈 카드가 생기지 않도록 우선순위로 보강합니다.
            name: user.name || user.userName || user.nickname || user.nickName || "",
            email: user.email || user.userEmail || "",
          }))
          .filter((user) => user.name || user.email),
      );
    };

    fetchInviteCandidates();
  }, [inviteQuery, searchUsers]);

  const updateStoredTeam = (updater) => {
    const nextTeams = getStoredTeams().map((team) =>
      team.id === teamId ? updater(team) : team,
    );
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(nextTeams));
  };

  const filteredCandidates = useMemo(
    () =>
      inviteCandidates.filter((candidate) => {
        if (candidate.userId === userId) return false;
        if (members.some((member) => member.userId === candidate.userId)) return false;
        return true;
      }),
    [inviteCandidates, members, userId],
  );

  const inviteSearchEmptyMessage = useMemo(() => {
    if (!inviteQuery.trim()) {
      return "검색어를 입력해 주세요.";
    }

    if (inviteCandidates.length > 0 && filteredCandidates.length === 0) {
      return "검색된 사용자는 이미 팀에 있거나 본인입니다.";
    }

    return "검색 결과가 없습니다.";
  }, [filteredCandidates.length, inviteCandidates.length, inviteQuery]);

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
    if (userId && requestTeamId) {
      const targetUserId = Number(memberId.replace(/^tm/, ""));
      const position = positionIdMap[teamRoleRequestMap[value]];

      console.log("[TeamDetail] handlePartChange input:", {
        memberId,
        selectedPart: value,
        targetUserId,
        requestTeamId,
        position,
        positionIdMap,
      });

      if (!targetUserId) {
        console.error("팀원 포지션 수정 실패: userId를 찾지 못했습니다.", { memberId });
        setSaveNotice("팀원 정보를 찾지 못해 포지션을 수정하지 못했습니다.");
        return;
      }

      if (!position) {
        console.error("팀원 포지션 수정 실패: position id를 찾지 못했습니다.", {
          selectedPart: value,
          positionIdMap,
        });
        setSaveNotice("선택한 포지션 ID를 찾지 못했습니다.");
        return;
      }

      const result = await updateMemberPosition(userId, requestTeamId, {
        userId: targetUserId,
        position,
      });

      console.log("[TeamDetail] updateMemberPosition result:", result);

      if (!result?.isSuccess) {
        console.error("팀원 포지션 수정 실패:", result?.message, {
          requestBody: { userId: targetUserId, position },
        });
        setSaveNotice(result?.message || "팀원 포지션 수정에 실패했습니다.");
        return;
      }

      const refetchedTeam = await fetchTeamDetail();
      console.log("[TeamDetail] refetched team after position update:", refetchedTeam);
      if (!refetchedTeam) {
        setSaveNotice("포지션 수정 후 최신 팀 정보를 다시 불러오지 못했습니다.");
        return;
      }

      const updatedMember = refetchedTeam.members.find((member) => member.id === memberId);
      console.log("[TeamDetail] refetched updated member:", updatedMember);
      console.log("[TeamDetail] position update verification:", {
        memberId,
        expectedPart: value,
        actualPart: updatedMember?.part ?? null,
        matched: updatedMember?.part === value,
      });
      if (!updatedMember || updatedMember.part !== value) {
        setSaveNotice("포지션 변경이 서버에 반영되지 않았습니다.");
        return;
      }
    }
    setSaveNotice("팀원 포지션을 수정했습니다.");
  };

  const handleInvite = async () => {
    const invitedUser = filteredCandidates.find((candidate) => candidate.id === selectedCandidateId);

    if (!invitedUser) {
      setInviteNotice("초대할 사용자를 먼저 선택해 주세요.");
      return;
    }

    if (userId && requestTeamId) {
      const position = positionIdMap[teamRoleRequestMap[selectedInvitePart]];
      if (!position) {
        setInviteNotice("선택한 포지션 ID를 찾지 못했습니다.");
        return;
      }

      const result = await inviteMember(userId, requestTeamId, {
        userId: invitedUser.userId,
        position,
        content: inviteMessage,
      });

      if (!result?.isSuccess) {
        console.error("팀원 초대 실패:", result?.message);
      }
    }

    setSelectedCandidateId("");
    setInviteQuery("");
    setInvitePart(partOptions[0]?.value ?? teamPartOptions[0].value);
    setInviteMessage("");
    setInviteCandidates([]);
    setInviteNotice(`${invitedUser.name} 님에게 초대를 보냈습니다. 수락 후 팀원이 추가됩니다.`);
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
    if (!window.confirm(`${member.name} 님을 팀에서 내보내시겠습니까?`)) {
      return;
    }

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
    if (!window.confirm("정말 팀을 나가시겠습니까?")) {
      return;
    }

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
    if (!window.confirm("정말 팀을 해체하시겠습니까?")) {
      return;
    }

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
    invitePart: selectedInvitePart,
    inviteQuery,
    inviteSearchEmptyMessage,
    isInviteSearchLoading: isUserLoading && Boolean(inviteQuery.trim()),
    isLeader: isLeaderRole(teamRole),
    members,
    loadError,
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
    partOptions,
  };
};
