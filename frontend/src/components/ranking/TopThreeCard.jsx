import AvatarBadge from "./AvatarBadge";
import { medalTones } from "../../pages/rankingPage.constants";

// 상위 3위 플레이어를 보여주는 카드 컴포넌트
const TopThreeCard = ({ player, highlighted = false, delay = 0, enterRotateY = 0 }) => {
  const tone = medalTones[player.rank];

  return (
    <article
      className={`relative overflow-visible rounded-[30px] border border-slate-200 px-6 pb-8 pt-16 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ${tone.card} ${
        highlighted ? "xl:translate-y-0" : ""
      }`}
      style={{
        animation: `rankingTopCardFlip 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`,
        "--ranking-enter-rotate-y": `${enterRotateY}deg`,
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        backfaceVisibility: "hidden",
      }}
    >
      <div className={`absolute left-0 right-0 top-0 h-1 rounded-t-[30px] ${tone.line}`} />

      <div className="flex justify-center">
        <div className="-mt-[5.5rem] mb-4">
          <AvatarBadge player={player} large={highlighted} />
        </div>
      </div>

      <div className="text-center">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${tone.badge}`}>
          Rank {player.rank}
        </span>
        <h3 className="mt-3 text-[1.7rem] font-black text-slate-950">{player.name}</h3>
        <p className="mt-4 text-[1.9rem] font-black text-[#336DFE]">{player.points}</p>
        <p className="mt-1 text-sm font-semibold italic text-slate-400">Points</p>
      </div>
    </article>
  );
};

export default TopThreeCard;
