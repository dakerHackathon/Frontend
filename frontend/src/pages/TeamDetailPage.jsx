import { Link, useParams } from "react-router-dom";
import TeamBasicInfoCard from "../components/mypage/teamDetail/TeamBasicInfoCard";
import TeamInviteCard from "../components/mypage/teamDetail/TeamInviteCard";
import TeamMembersCard from "../components/mypage/teamDetail/TeamMembersCard";
import { useTeamDetailPage } from "../hooks/useTeamDetailPage";

const TEAM_LEADER_LABEL = "팀장";

const isLeaderRole = (role) => role === "leader" || role === TEAM_LEADER_LABEL;
const getRoleLabel = (role) => (isLeaderRole(role) ? TEAM_LEADER_LABEL : role);

const TeamDetailPage = () => {
  const { teamId } = useParams();
  const {
    currentUserId,
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
    inviteSearchEmptyMessage,
    isInviteSearchLoading,
    isLeader,
    loadError,
    members,
    partOptions,
    saveNotice,
    selectedCandidateId,
    setInviteMessage,
    setInvitePart,
    setInviteQuery,
    setSelectedCandidateId,
    teamForm,
    teamRole,
  } = useTeamDetailPage(teamId);

  return (
    <div className="min-h-screen bg-[#F3F6FF] px-4 py-8 sm:px-5 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1440px] space-y-6">
        {loadError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            팀 상세 API 호출 실패: {loadError}
          </div>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/mypage" className="text-sm font-semibold text-[#336DFE] hover:underline">
              &lt; 마이페이지로 돌아가기
            </Link>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{teamForm.name}</h1>
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
            <TeamBasicInfoCard isLeader={isLeader} teamForm={teamForm} saveNotice={saveNotice} onSave={handleTeamSave} />
            <TeamMembersCard
              members={members}
              isLeader={isLeader}
              currentUserId={currentUserId}
              onPartChange={handlePartChange}
              onSendMessage={handleSendMessage}
              onKickMember={handleKickMember}
              onLeaveTeam={handleLeaveTeam}
              onDisbandTeam={handleDisbandTeam}
              partOptions={partOptions}
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
                isInviteSearchLoading={isInviteSearchLoading}
                filteredCandidates={filteredCandidates}
                inviteSearchEmptyMessage={inviteSearchEmptyMessage}
                isLeader={isLeader}
                onInviteQueryChange={setInviteQuery}
                onCandidateSelect={setSelectedCandidateId}
                onInvitePartChange={setInvitePart}
                onInviteMessageChange={setInviteMessage}
                onInvite={handleInvite}
                partOptions={partOptions}
              />
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailPage;
