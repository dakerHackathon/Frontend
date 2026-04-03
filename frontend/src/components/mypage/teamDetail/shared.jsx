import { getPartMeta, getPartStyle } from "./shared";

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
