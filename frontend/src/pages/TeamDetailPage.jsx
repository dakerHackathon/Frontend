import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import TeamBasicInfoCard from "../components/mypage/teamDetail/TeamBasicInfoCard";
import TeamHackathonLinkCard from "../components/mypage/teamDetail/TeamHackathonLinkCard";
import TeamInviteCard from "../components/mypage/teamDetail/TeamInviteCard";
import TeamMembersCard from "../components/mypage/teamDetail/TeamMembersCard";
import { getPartMeta } from "../components/mypage/teamDetail/shared.jsx";
import {
  initialHackathons,
  initialProfile,
  inviteCandidatePool,
  teams,
} from "../components/mypage/constants";

const TeamDetailPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const sourceTeam = useMemo(
    () => teams.find((team) => team.id === teamId) ?? null,
    [teamId],
  );

  const [teamForm, setTeamForm] = useState(() =>
    sourceTeam
      ? {
          name: sourceTeam.name,
          description: sourceTeam.description,
          linkedHackathonId: sourceTeam.linkedHackathonId ?? "",
        }
      : {
          name: "",
          description: "",
          linkedHackathonId: "",
        },
  );
  const [members, setMembers] = useState(() => sourceTeam?.members ?? []);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [inviteQuery, setInviteQuery] = useState("");
  const [invitePart, setInvitePart] = useState("frontend");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteNotice, setInviteNotice] = useState("");
  const [saveNotice, setSaveNotice] = useState("");
  const currentUserEmail = initialProfile.email;

  if (!sourceTeam) {
    return <Navigate to="/mypage" replace />;
  }

  const isLeader = sourceTeam.role === "팀장";
  const activeHackathons = initialHackathons.filter(
    (hackathon) => hackathon.status === "진행중",
  );

  const linkedHackathon = activeHackathons.find(
    (hackathon) => hackathon.id === teamForm.linkedHackathonId,
  );

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
    setSaveNotice("팀 정보 수정 내용이 임시 저장되었습니다.");
  };

  const handleLinkHackathon = () => {
    setSaveNotice(
      linkedHackathon
        ? `${linkedHackathon.title} 해커톤에 팀이 연결되었습니다.`
        : "연결할 해커톤을 선택해 주세요.",
    );
  };

  const handleMemberFieldChange = (memberId, key, value) => {
    setMembers((prev) =>
      prev.map((member) => (member.id === memberId ? { ...member, [key]: value } : member)),
    );
  };

  const handlePartChange = (memberId, value) => {
    handleMemberFieldChange(memberId, "part", value);
  };

  const handleInvite = () => {
    const invitedUser = filteredCandidates.find(
      (candidate) => candidate.id === selectedCandidateId,
    );

    if (!invitedUser) {
      setInviteNotice("초대할 팀원을 먼저 선택해 주세요.");
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
    setSaveNotice(`${member.name} 님을 팀에서 추방했습니다.`);
  };

  const handleLeaveTeam = (member) => {
    setMembers((prev) => prev.filter((entry) => entry.id !== member.id));
    setSaveNotice(`${member.name} 님이 팀에서 나갔습니다.`);
  };

  const handleDisbandTeam = () => {
    setSaveNotice("팀이 해체되었습니다.");
  };

  return (
    <div className="min-h-screen bg-[#F3F6FF] px-4 py-8 sm:px-5 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/mypage" className="text-sm font-semibold text-[#336DFE] hover:underline">
              ← 마이페이지로 돌아가기
            </Link>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              {teamForm.name}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              팀 소개, 팀원 역할, 해커톤 연결, 초대 기능을 한 곳에서 관리할 수 있습니다.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
            내 권한: <span className="font-black text-[#336DFE]">{sourceTeam.role}</span>
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
            <TeamHackathonLinkCard
              activeHackathons={activeHackathons}
              selectedHackathonId={teamForm.linkedHackathonId}
              linkedHackathon={linkedHackathon}
              isLeader={isLeader}
              onSelect={(hackathonId) =>
                setTeamForm((prev) => ({ ...prev, linkedHackathonId: hackathonId }))
              }
              onLink={handleLinkHackathon}
            />

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
