import PrimaryActionButton from "../../common/PrimaryActionButton";
import { teamPartOptions } from "../constants";
import { baseInputClass, pageCardClass } from "./shared.jsx";

const TeamInviteCard = ({
  inviteQuery,
  selectedCandidateId,
  invitePart,
  inviteMessage,
  inviteNotice,
  filteredCandidates,
  isLeader,
  onInviteQueryChange,
  onCandidateSelect,
  onInvitePartChange,
  onInviteMessageChange,
  onInvite,
}) => {
  return (
    <div className={pageCardClass}>
      <h2 className="text-xl font-black text-slate-950">팀원 초대</h2>
      <p className="mt-1 text-sm text-slate-500">
        닉네임 검색으로 후보를 찾고, 어떤 포지션으로 초대할지와 초대 멘트를 함께 보낼 수 있습니다.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">닉네임 검색</span>
          <input
            value={inviteQuery}
            onChange={(event) => onInviteQueryChange(event.target.value)}
            placeholder="닉네임, 이름, 이메일, 파트로 검색"
            className={baseInputClass}
          />
        </label>

        <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1">
          {filteredCandidates.map((candidate) => {
            const isSelected = selectedCandidateId === candidate.id;

            return (
              <button
                key={candidate.id}
                type="button"
                onClick={() => onCandidateSelect(candidate.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? "border-[#336DFE] bg-[#EEF3FF]"
                    : "border-slate-200 bg-white hover:border-[#D6E2FF] hover:bg-[#F8FAFF]"
                }`}
              >
                <div className="min-w-0">
                  <p className="font-black text-slate-900">
                    {candidate.nickname}
                    <span className="ml-2 font-medium text-slate-500">
                      {candidate.name}
                    </span>
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-500">{candidate.email}</p>
                  <p className="mt-2 text-sm text-slate-600">{candidate.intro}</p>
                </div>
              </button>
            );
          })}

          {filteredCandidates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
              검색 결과가 없습니다.
            </div>
          ) : null}
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">초대 포지션</span>
          <select
            value={invitePart}
            onChange={(event) => onInvitePartChange(event.target.value)}
            className={baseInputClass}
          >
            {teamPartOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">초대 멘트</span>
          <textarea
            rows={4}
            value={inviteMessage}
            onChange={(event) => onInviteMessageChange(event.target.value)}
            placeholder="함께하고 싶은 이유나 역할 기대치를 적어 주세요."
            className={`${baseInputClass} min-h-[110px] resize-none`}
          />
        </label>

        {inviteNotice ? (
          <div className="rounded-2xl bg-[#EEF3FF] px-4 py-3 text-sm font-semibold text-[#2458E6]">
            {inviteNotice}
          </div>
        ) : null}

        <PrimaryActionButton fullWidth onClick={onInvite} disabled={!isLeader}>
          팀원 초대 보내기
        </PrimaryActionButton>
      </div>
    </div>
  );
};

export default TeamInviteCard;
