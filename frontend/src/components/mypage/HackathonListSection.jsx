import { cardClass } from "./constants";

const VoteButton = ({ icon, label, onClick, disabled, tone }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    disabled={disabled}
    onClick={onClick}
    className={`rounded-md px-2 py-1 text-sm disabled:bg-slate-200 disabled:text-slate-400 ${tone}`}
  >
    {icon}
  </button>
);

const HackathonListSection = ({ hackathons, voteLocks, onVote }) => {
  return (
    <section className={`${cardClass} space-y-3`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">참여한 해커톤</h2>
      </div>
      <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
        {hackathons.map((hackathon) => (
          <div key={hackathon.id} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{hackathon.title}</p>
                <p className="text-xs text-slate-500">{hackathon.date}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{hackathon.status}</span>
            </div>
            <div className="mt-2 rounded-lg bg-slate-50 p-2">
              <p className="mb-1 text-xs font-semibold text-slate-500">팀원 목록 (팀원당 1회 평가 가능)</p>
              {hackathon.members.map((member) => {
                const memberKey = `${hackathon.id}:${member.id}`;
                const isVoted = Boolean(voteLocks[memberKey]);

                return (
                  <div key={member.id} className="mb-1 flex items-center justify-between text-sm last:mb-0">
                    <span>{member.name}</span>
                    <div className="flex items-center gap-1">
                      <VoteButton
                        icon="👍"
                        label="좋아요"
                        disabled={isVoted}
                        onClick={() => onVote(hackathon.id, member.id, 0.3)}
                        tone="bg-emerald-100 text-emerald-700"
                      />
                      <VoteButton
                        icon="👎"
                        label="나빠요"
                        disabled={isVoted}
                        onClick={() => onVote(hackathon.id, member.id, -0.2)}
                        tone="bg-rose-100 text-rose-700"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HackathonListSection;