import { teamPartOptions } from "../constants";

export const pageCardClass =
  "rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-6";

export const baseInputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#AFC5FF] focus:ring-4 focus:ring-[#EEF3FF]";

const partStyleMap = {
  frontend: {
    chip: "bg-[#2A3FFF] text-white",
    card: "bg-[#EEF2FF] text-[#2A3FFF]",
    icon: "FE",
  },
  backend: {
    chip: "bg-[#4CD137] text-white",
    card: "bg-[#EDFBEF] text-[#218838]",
    icon: "BE",
  },
  ai: {
    chip: "bg-[#666666] text-white",
    card: "bg-[#F2F4F7] text-[#4B5563]",
    icon: "AI",
  },
  designer: {
    chip: "bg-[#FF7AB6] text-white",
    card: "bg-[#FFF0F6] text-[#D63384]",
    icon: "DE",
  },
  planner: {
    chip: "bg-[#FFB547] text-white",
    card: "bg-[#FFF7E8] text-[#B7791F]",
    icon: "PM",
  },
};

export const getPartMeta = (part) =>
  teamPartOptions.find((option) => option.value === part) ?? teamPartOptions[0];

export const getPartStyle = (part) => partStyleMap[part] ?? partStyleMap.frontend;

export const PartBadge = ({ part }) => {
  const meta = getPartMeta(part);
  const style = getPartStyle(part);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${style.chip}`}
    >
      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-[10px]">
        {style.icon}
      </span>
      {meta.label}
    </span>
  );
};
