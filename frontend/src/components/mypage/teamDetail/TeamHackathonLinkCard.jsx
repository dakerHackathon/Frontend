import PrimaryActionButton from "../../common/PrimaryActionButton";
import { pageCardClass } from "./shared.jsx";

const TeamHackathonLinkCard = ({
  activeHackathons,
  selectedHackathonId,
  linkedHackathon,
  isLeader,
  onSelect,
  onLink,
}) => {
  return (
    <div className={pageCardClass}>
      <h2 className="text-xl font-black text-slate-950">해커톤 연결</h2>
      <p className="mt-1 text-sm text-slate-500">
        현재 진행 중인 해커톤에 팀을 연결해 바로 출전 상태로 관리할 수 있습니다.
      </p>

      <div className="mt-5 space-y-3">
        {activeHackathons.map((hackathon) => {
          const isSelected = selectedHackathonId === hackathon.id;

          return (
            <button
              key={hackathon.id}
              type="button"
              disabled={!isLeader}
              onClick={() => onSelect(hackathon.id)}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                isSelected
                  ? "border-[#336DFE] bg-[#EEF3FF]"
                  : "border-slate-200 bg-white hover:border-[#C9D7FF] hover:bg-[#F8FAFF]"
              } disabled:cursor-not-allowed disabled:opacity-70`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black text-slate-900">{hackathon.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{hackathon.date}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#336DFE]">
                  {hackathon.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-4">
        <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">
          현재 연결 상태
        </p>
        <p className="mt-2 text-base font-black text-slate-900">
          {linkedHackathon?.title ?? "아직 연결된 해커톤이 없습니다."}
        </p>
      </div>

      <div className="mt-5 flex justify-end">
        <PrimaryActionButton onClick={onLink} disabled={!isLeader}>
          출전 연결
        </PrimaryActionButton>
      </div>
    </div>
  );
};

export default TeamHackathonLinkCard;
