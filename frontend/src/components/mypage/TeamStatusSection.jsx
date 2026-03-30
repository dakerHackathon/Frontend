import { cardClass } from "./constants";

const TeamStatusSection = ({ teams, onOpenTeam }) => {
  return (
    <section className={`${cardClass} space-y-3`}>
      <h2 className="text-lg font-bold">소속 팀 현황</h2>
      {teams.map((team) => (
        <div key={team.id} className="rounded-xl border border-slate-200 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold">{team.name}</p>
              <p className="truncate text-xs text-slate-500">{team.description}</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenTeam(team.id)}
              className="shrink-0 rounded-md border border-blue-200 px-2 py-1 text-xs text-blue-600"
            >
              상세보기
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default TeamStatusSection;
