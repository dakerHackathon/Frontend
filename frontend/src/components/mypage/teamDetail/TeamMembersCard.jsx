import { teamPartOptions } from "../constants";
import { baseInputClass, getPartMeta, getPartStyle, pageCardClass } from "./shared.jsx";

const TEAM_LEADER_LABEL = "팀장";

const isLeaderRole = (role) => role === "leader" || role === TEAM_LEADER_LABEL;

const getRoleLabel = (role) => (isLeaderRole(role) ? TEAM_LEADER_LABEL : role);

const actionButtonClass = "rounded-xl border px-3 py-2 text-xs font-bold transition";

const TeamMembersCard = ({
  members,
  isLeader,
  currentUserEmail,
  onPartChange,
  onSendMessage,
  onKickMember,
  onLeaveTeam,
  onDisbandTeam,
}) => {
  return (
    <div className={pageCardClass}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950">팀원 구성</h2>
          <p className="mt-1 text-sm text-slate-500">
            팀원의 정보와 현재 파트를 확인할 수 있습니다.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          총 {members.length}명
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {members.map((member) => {
          const partMeta = getPartMeta(member.part);
          const partStyle = getPartStyle(member.part);
          const isCurrentUser = member.email === currentUserEmail;
          const canMessage = !isCurrentUser;
          const canKick = isLeader && !isCurrentUser;
          const canLeave = !isLeader && isCurrentUser;
          const canDisband = isLeader && isCurrentUser;

          return (
            <div key={member.id} className="rounded-2xl border border-slate-200 px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-black text-slate-900">{member.name}</p>
                    <span className="text-sm text-slate-500">@{member.nickname}</span>
                    <span
                      className={`inline-flex min-w-8 items-center justify-center rounded px-2 py-1 text-[10px] font-black ${partStyle.chip}`}
                      title={partMeta.label}
                      aria-label={partMeta.label}
                    >
                      {partStyle.icon}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{member.email}</p>

                  {canMessage || canKick || canLeave || canDisband ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {canMessage ? (
                        <button
                          type="button"
                          onClick={() => onSendMessage(member)}
                          className={`${actionButtonClass} border-[#C9D7FF] text-[#2458E6] hover:bg-[#EEF3FF]`}
                        >
                          쪽지 보내기
                        </button>
                      ) : null}

                      {canKick ? (
                        <button
                          type="button"
                          onClick={() => onKickMember(member)}
                          className={`${actionButtonClass} border-rose-200 text-rose-600 hover:bg-rose-50`}
                        >
                          팀에서 내보내기
                        </button>
                      ) : null}

                      {canLeave ? (
                        <button
                          type="button"
                          onClick={() => onLeaveTeam(member)}
                          className={`${actionButtonClass} border-rose-200 text-rose-600 hover:bg-rose-50`}
                        >
                          팀 나가기
                        </button>
                      ) : null}

                      {canDisband ? (
                        <button
                          type="button"
                          onClick={onDisbandTeam}
                          className={`${actionButtonClass} border-rose-200 text-rose-600 hover:bg-rose-50`}
                        >
                          팀 해체하기
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="ml-auto flex shrink-0 items-stretch gap-3">
                  <div
                    className={`min-w-[136px] rounded-2xl px-4 py-3 text-sm font-bold ${partStyle.card}`}
                  >
                    <div className="text-xs font-semibold opacity-70">현재 파트</div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-white/70 px-2 text-[11px] font-black">
                        {partStyle.icon}
                      </span>
                      <span>{partMeta.label}</span>
                    </div>
                  </div>

                  <div className="grid min-w-[184px] gap-2">
                    {isLeader ? (
                      <select
                        value={member.part}
                        onChange={(event) => onPartChange(member.id, event.target.value)}
                        className={`${baseInputClass} py-2.5`}
                      >
                        {teamPartOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
                        {partMeta.label}
                      </div>
                    )}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
                      {getRoleLabel(member.role)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamMembersCard;
