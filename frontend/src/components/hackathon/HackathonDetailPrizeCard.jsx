// 상금 카드 컴포넌트 (금/은/동 등급별 스타일 적용)
const HackathonDetailPrizeCard = ({ item }) => {
  const toneMap = {
    gold: {
      shell: "border-[#F8D88B] bg-[linear-gradient(135deg,#FFF9E6_0%,#FFF1BE_100%)]",
      badge: "bg-[#F5B23A] text-white",
      amount: "text-[#9B6400]",
    },
    silver: {
      shell: "border-[#D5DCEE] bg-[linear-gradient(135deg,#F9FBFF_0%,#E9EFFB_100%)]",
      badge: "bg-[#AAB7D4] text-white",
      amount: "text-[#54657F]",
    },
    bronze: {
      shell: "border-[#E9D3C8] bg-[linear-gradient(135deg,#FFF7F3_0%,#F7E4DA_100%)]",
      badge: "bg-[#C88B68] text-white",
      amount: "text-[#8A5435]",
    },
  };

  const tone = toneMap[item.tone] ?? toneMap.gold;

  return (
    <div className={`rounded-[24px] border p-4 ${tone.shell}`}>
      <span className={`rounded-full px-3 py-1 text-xs font-black ${tone.badge}`}>{item.tier}</span>
      <p className={`mt-5 text-2xl font-black ${tone.amount}`}>{item.amount}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
    </div>
  );
};

export default HackathonDetailPrizeCard;
