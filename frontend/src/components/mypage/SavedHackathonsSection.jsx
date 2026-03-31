import { useEffect, useRef, useState } from "react";

const BookmarkIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-blue-600">
    <path
      d="M7 4.5H17C17.6 4.5 18 4.9 18 5.5V19.5L12 15.7L6 19.5V5.5C6 4.9 6.4 4.5 7 4.5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const SavedHackathonsSection = ({ savedHackathons, onRemove }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const listRef = useRef(null);
  const [thumbStyle, setThumbStyle] = useState({ top: 0, height: 0, visible: false });
  const dragStateRef = useRef({ isDown: false, startY: 0, startScrollTop: 0 });

  const updateThumbStyle = () => {
    const listEl = listRef.current;
    if (!listEl) return;

    const maxScroll = listEl.scrollHeight - listEl.clientHeight;
    const visible = maxScroll > 0;
    const height = visible
      ? Math.max(24, (listEl.clientHeight * listEl.clientHeight) / listEl.scrollHeight)
      : 0;
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

  const handleThumbMouseDown = (event) => {
    event.preventDefault();
    const listEl = listRef.current;
    if (!listEl) return;

    const maxScroll = listEl.scrollHeight - listEl.clientHeight;
    const trackHeight = listEl.clientHeight - thumbStyle.height;
    if (maxScroll <= 0 || trackHeight <= 0) return;

    const startY = event.clientY;
    const startScrollTop = listEl.scrollTop;
    setIsScrolling(true);

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const nextScrollTop = startScrollTop + (deltaY / trackHeight) * maxScroll;
      listEl.scrollTop = Math.max(0, Math.min(maxScroll, nextScrollTop));
      updateThumbStyle();
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 550);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleListMouseDown = (event) => {
    if (event.button !== 0) return;
    if (event.target.closest("button, a, input, textarea, select, label")) return;

    const listEl = listRef.current;
    if (!listEl) return;

    dragStateRef.current = {
      isDown: true,
      startY: event.clientY,
      startScrollTop: listEl.scrollTop,
    };

    setIsDragging(true);
    setIsScrolling(true);
    clearTimeout(scrollTimeoutRef.current);
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    updateThumbStyle();
    window.addEventListener("resize", updateThumbStyle);

    const handleMouseMove = (event) => {
      if (!dragStateRef.current.isDown) return;
      const listEl = listRef.current;
      if (!listEl) return;

      const deltaY = event.clientY - dragStateRef.current.startY;
      listEl.scrollTop = dragStateRef.current.startScrollTop - deltaY;
      updateThumbStyle();
    };

    const handleMouseUp = () => {
      if (!dragStateRef.current.isDown) return;
      dragStateRef.current.isDown = false;
      setIsDragging(false);
      document.body.style.userSelect = "";
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 550);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      dragStateRef.current.isDown = false;
      document.body.style.userSelect = "";
      clearTimeout(scrollTimeoutRef.current);
      window.removeEventListener("resize", updateThumbStyle);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white pt-4 pb-5 shadow-[0_10px_20px_rgba(15,23,42,0.05)]">
      <h2 className="px-4 text-lg font-bold">저장한 해커톤</h2>
      <div className="relative mt-3">
        <div
          ref={listRef}
          onMouseDown={handleListMouseDown}
          onScroll={handleListScroll}
          className={`smart-scroll max-h-[220px] space-y-2 overflow-y-auto px-4 pb-3 ${
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
        >
          {savedHackathons.map((saved) => (
            <div
              key={saved.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
            >
              <div>
                <p className="text-sm font-semibold">{saved.title}</p>
                <p className="text-xs text-slate-500">{saved.org}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(saved.id)}
                className="rounded-lg p-1 text-blue-600 transition hover:bg-blue-50"
                aria-label="북마크 해제"
                title="북마크 해제"
              >
                <BookmarkIcon />
              </button>
            </div>
          ))}
        </div>
        {isScrolling && thumbStyle.visible ? (
          <div
            onMouseDown={handleThumbMouseDown}
            className="absolute right-1 cursor-grab rounded-full bg-slate-400/45 transition-opacity duration-150 active:cursor-grabbing"
            style={{ top: `${thumbStyle.top + 2}px`, height: `${thumbStyle.height}px`, width: "6px" }}
          />
        ) : null}
      </div>
    </section>
  );
};

export default SavedHackathonsSection;
