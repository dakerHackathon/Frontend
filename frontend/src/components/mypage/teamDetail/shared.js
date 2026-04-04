export const pageCardClass =
  "rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-6";

export const baseInputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#AFC5FF] focus:ring-4 focus:ring-[#EEF3FF]";

const partStyleMap = {
  planner: {
    chip: "bg-[#FFB547] text-white",
    card: "bg-[#FFF7E8] text-[#B7791F]",
    icon: "PM",
  },
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
};

const fallbackPartStyle = {
  chip: "bg-slate-500 text-white",
  card: "bg-slate-100 text-slate-700",
  icon: "ETC",
};

const getFallbackPartMeta = (part) => {
  const rawLabel = String(part || "포지션").trim();

  return {
    value: part || "unknown",
    label: rawLabel || "포지션",
    shortLabel: rawLabel.slice(0, 3).toUpperCase() || "ETC",
  };
};

export const getPartMeta = (part, partOptions = []) =>
  partOptions.find((option) => option.value === part) ?? getFallbackPartMeta(part);

export const getPartStyle = (part, partOptions = []) => {
  const partMeta = getPartMeta(part, partOptions);

  return {
    ...(partStyleMap[part] ?? fallbackPartStyle),
    icon: partStyleMap[part]?.icon ?? partMeta.shortLabel,
  };
};
