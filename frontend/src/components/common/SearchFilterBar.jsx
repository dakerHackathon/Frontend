import { useEffect, useRef, useState } from "react";

const toneDotClass = {
  neutral: "bg-slate-400",
  active: "bg-[#28C840]",
  upcoming: "bg-[#336DFE]",
  closed: "bg-[#EB3B3B]",
};

const FilterDropdown = ({
  value,
  onChange,
  options,
  className = "",
  showDot = false,
  compact = false,
  segmented = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-12 w-full items-center justify-between bg-white text-sm font-bold text-slate-800 outline-none transition duration-200 ${
          segmented
            ? "rounded-l-2xl rounded-r-none border-0 px-6 hover:bg-slate-50"
            : "rounded-2xl border border-slate-300 px-4 hover:border-[#BFD0FF] hover:bg-[#F7F9FF] hover:shadow-[0_10px_24px_rgba(51,109,254,0.08)]"
        } ${compact ? "min-w-[132px]" : ""}`}
      >
        <span className="flex items-center gap-2">
          {showDot && selectedOption.dotTone ? (
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                toneDotClass[selectedOption.dotTone] ?? toneDotClass.neutral
              }`}
            />
          ) : null}
          <span>{selectedOption.label}</span>
        </span>
        <span className={`text-slate-500 transition duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 stroke-current">
            <path d="M5 7.5L10 12.5L15 7.5" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold transition hover:bg-[#F4F7FF] ${
                option.value === value ? "bg-[#EEF3FF] text-[#2458E6]" : "text-slate-800"
              }`}
            >
              {showDot && option.dotTone ? (
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    toneDotClass[option.dotTone] ?? toneDotClass.neutral
                  }`}
                />
              ) : null}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const SearchFilterBar = ({
  searchOptions,
  searchCategory,
  onSearchCategoryChange,
  searchValue,
  onSearchValueChange,
  searchPlaceholder,
  filters = [],
  actionButton,
}) => {
  return (
    <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-[1.75] overflow-visible rounded-2xl border border-slate-300 bg-white xl:flex-[2.05]">
          <div className="relative shrink-0 border-r border-slate-200">
            <FilterDropdown
              value={searchCategory}
              onChange={onSearchCategoryChange}
              options={searchOptions}
              segmented
              compact
              className="min-w-[158px]"
            />
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-3 px-5">
            <input
              value={searchValue}
              onChange={(event) => onSearchValueChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-12 w-full bg-transparent text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400 sm:text-sm"
            />
            <span className="shrink-0 text-slate-500">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 stroke-current">
                <circle cx="11" cy="11" r="6.5" strokeWidth="1.8" />
                <path d="M16 16L21 21" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-3 xl:justify-end">
          {filters.map((filter) => (
            <FilterDropdown
              key={filter.key}
              value={filter.value}
              onChange={filter.onChange}
              options={filter.options}
              showDot={filter.type === "status"}
              compact
              className="w-[132px]"
            />
          ))}
        </div>
      </div>

      {actionButton ? <div className="shrink-0">{actionButton}</div> : null}
    </div>
  );
};

export default SearchFilterBar;
