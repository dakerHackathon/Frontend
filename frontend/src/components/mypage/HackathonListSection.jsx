import { useEffect, useRef, useState } from "react";
import { cardClass } from "./constants";

const VoteButton = ({ icon, label, onClick, disabled, tone }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    disabled={disabled}
    onClick={onClick}
    className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm disabled:cursor-not-allowed disabled:opacity-90 ${tone}`}
  >
    {icon}
  </button>
);

const ThumbUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <path
      d="M10 21H6.5C5.7 21 5 20.3 5 19.5V11.5C5 10.7 5.7 10 6.5 10H10M10 21V10M10 21L14.8 21C16 21 17 20.1 17.2 18.9L18.1 13.9C18.4 12.2 17.1 10.7 15.4 10.7H13V7.2C13 6 12 5 10.8 5H10L8.2 10"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ThumbDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <path
      d="M14 3H17.5C18.3 3 19 3.7 19 4.5V12.5C19 13.3 18.3 14 17.5 14H14M14 3V14M14 3H9.2C8 3 7 3.9 6.8 5.1L5.9 10.1C5.6 11.8 6.9 13.3 8.6 13.3H11V16.8C11 18 12 19 13.2 19H14L15.8 14"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HackathonListSection = ({ hackathons, voteLocks, onVote }) => {
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const listRef = useRef(null);
  const [thumbStyle, setThumbStyle] = useState({ top: 0, height: 0, visible: false });
  const dragStateRef = useRef({ isDown: false, startY: 0, startScrollTop: 0 });

  const closeModal = () => setSelectedHackathon(null);

  const updateThumbStyle = () => {
    const listEl = listRef.current;
    if (!listEl) return;

    const maxScroll = listEl.scrollHeight - listEl.clientHeight;
    const visible = maxScroll > 0;
    const height = visible ? Math.max(28, (listEl.clientHeight * listEl.clientHeight) / listEl.scrollHeight) : 0;
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
    <>
      <section className={`${cardClass} space-y-3`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">참여한 해커톤</h2>
        </div>

        <div className="relative">
          <div
            ref={listRef}
            onMouseDown={handleListMouseDown}
            onScroll={handleListScroll}
            className={`smart-scroll max-h-[320px] space-y-2 overflow-y-auto ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
          >
            {hackathons.map((hackathon) => (
              <div key={hackathon.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{hackathon.title}</p>
                    <p className="text-xs text-slate-500">{hackathon.date}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{hackathon.status}</span>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 p-2">
                  <p className="text-xs font-semibold text-slate-500">팀원 {hackathon.members.length}명 평가 가능</p>
                  <button
                    type="button"
                    onClick={() => setSelectedHackathon(hackathon)}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    투표하기
                  </button>
                </div>
              </div>
            ))}
          </div>
          {isScrolling && thumbStyle.visible ? (
            <div
              onMouseDown={handleThumbMouseDown}
              className="absolute -right-2 cursor-grab rounded-full bg-slate-400/45 transition-opacity duration-150 active:cursor-grabbing"
              style={{ top: `${thumbStyle.top + 2}px`, height: `${thumbStyle.height}px`, width: "6px" }}
            />
          ) : null}
        </div>
      </section>

      {selectedHackathon ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedHackathon.title} 팀원 투표`}
            className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm text-slate-500">{selectedHackathon.date}</p>
                <h3 className="text-lg font-bold text-slate-900">{selectedHackathon.title}</h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">팀원당 1회 평가가 가능합니다.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                닫기
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {selectedHackathon.members.map((member) => {
                const memberKey = `${selectedHackathon.id}:${member.id}`;
                const selectedVote = voteLocks[memberKey];
                const isVoted = Boolean(selectedVote);
                const upTone =
                  selectedVote === "up"
                    ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                    : selectedVote
                      ? "border-slate-200 text-slate-400"
                      : "border-slate-200 text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50";
                const downTone =
                  selectedVote === "down"
                    ? "border-rose-300 bg-rose-100 text-rose-700"
                    : selectedVote
                      ? "border-slate-200 text-slate-400"
                      : "border-slate-200 text-rose-700 hover:border-rose-200 hover:bg-rose-50";

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <span>{member.name}</span>
                    <div className="flex items-center gap-1">
                      <VoteButton
                        icon={<ThumbUpIcon />}
                        label="좋아요"
                        disabled={isVoted}
                        onClick={() => onVote(selectedHackathon.id, member.id, 0.3)}
                        tone={upTone}
                      />
                      <VoteButton
                        icon={<ThumbDownIcon />}
                        label="나빠요"
                        disabled={isVoted}
                        onClick={() => onVote(selectedHackathon.id, member.id, -0.2)}
                        tone={downTone}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default HackathonListSection;
