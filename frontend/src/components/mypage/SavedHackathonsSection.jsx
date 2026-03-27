import { useEffect, useRef, useState } from "react";

const BookmarkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-blue-600">
    <path
      d="M7 4.5H17C17.6 4.5 18 4.9 18 5.5V19.5L12 15.7L6 19.5V5.5C6 4.9 6.4 4.5 7 4.5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const SavedHackathonsSection = ({ savedHackathons }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const listRef = useRef(null);
  const [thumbStyle, setThumbStyle] = useState({ top: 0, height: 0, visible: false });

  const updateThumbStyle = () => {
    const listEl = listRef.current;
    if (!listEl) return;

    const maxScroll = listEl.scrollHeight - listEl.clientHeight;
    const visible = maxScroll > 0;
    const height = visible ? Math.max(24, (listEl.clientHeight * listEl.clientHeight) / listEl.scrollHeight) : 0;
    const trackHeight = Math.max(0, listEl.clientHeight - height);
    const top = maxScroll > 0 ? (listEl.scrollTop / maxScroll) * trackHeight : 0;
    setThumbStyle({ top, height, visible });
  };

  const handleListScroll = () => {
    updateThumbStyle();
    setIsScrolling(true);
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 550);
  };

  useEffect(() => {
    updateThumbStyle();
    window.addEventListener("resize", updateThumbStyle);
    return () => {
      clearTimeout(scrollTimeoutRef.current);
      window.removeEventListener("resize", updateThumbStyle);
    };
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white pt-4 pb-5 shadow-[0_10px_20px_rgba(15,23,42,0.05)]">
      <h2 className="px-4 text-lg font-bold">저장한 해커톤</h2>
      <div className="relative mt-3">
        <div
          ref={listRef}
          onScroll={handleListScroll}
          className="smart-scroll max-h-[220px] space-y-2 overflow-y-auto px-4 pb-3"
        >
          {savedHackathons.map((saved) => (
            <div key={saved.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div>
                <p className="text-sm font-semibold">{saved.title}</p>
                <p className="text-xs text-slate-500">{saved.org}</p>
              </div>
              <BookmarkIcon />
            </div>
          ))}
        </div>
        {isScrolling && thumbStyle.visible ? (
          <div
            className="pointer-events-none absolute right-1 rounded-full bg-slate-400/45 transition-opacity duration-150"
            style={{ top: `${thumbStyle.top + 2}px`, height: `${thumbStyle.height}px`, width: "6px" }}
          />
        ) : null}
      </div>
    </section>
  );
};

export default SavedHackathonsSection;
