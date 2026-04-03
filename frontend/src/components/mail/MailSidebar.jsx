import { useEffect, useRef, useState } from "react";
import MailListItem from "./MailListItem";
import MailSearchPanel from "./MailSearchPanel";

const MESSAGE_TABS = [
  { id: "all", label: "전체" },
  { id: "unread", label: "읽지 않음" },
  { id: "starred", label: "즐겨찾기" },
];

const TEAM_TABS = [
  { id: "requested", label: "요청받음" },
  { id: "invited", label: "초대받음" },
];

const MailSidebar = ({
  currentMode,
  onModeChange,
  messages,
  activeId,
  onSelect,
  activeTab,
  onTabChange,
  onOpenCompose,
  onToggleStar,
}) => {
  const listRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({
    isDown: false,
    startY: 0,
    startScrollTop: 0,
    moved: false,
  });

  const currentTabs = currentMode === "messages" ? MESSAGE_TABS : TEAM_TABS;

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!dragState.current.isDown || !listRef.current) return;

      const deltaY = event.clientY - dragState.current.startY;
      if (Math.abs(deltaY) > 3) {
        dragState.current.moved = true;
      }

      listRef.current.scrollTop = dragState.current.startScrollTop - deltaY;
    };

    const handleMouseUp = () => {
      if (!dragState.current.isDown) return;

      dragState.current.isDown = false;
      setIsDragging(false);
      document.body.style.userSelect = "";

      setTimeout(() => {
        dragState.current.moved = false;
      }, 0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <aside className="w-full max-w-[360px] shrink-0 space-y-4 font-sans">
      <div className="flex gap-1 rounded-2xl border border-[#E4E9F2] bg-white p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => onModeChange("messages")}
          className={`flex-1 rounded-xl py-2.5 text-[13px] font-bold transition-all ${
            currentMode === "messages"
              ? "bg-[#336DFE] text-white shadow-md"
              : "text-[#99A2B4] hover:bg-[#F8F9FB]"
          }`}
        >
          Messages
        </button>
        <button
          type="button"
          onClick={() => onModeChange("teams")}
          className={`flex-1 rounded-xl py-2.5 text-[13px] font-bold transition-all ${
            currentMode === "teams"
              ? "bg-[#336DFE] text-white shadow-md"
              : "text-[#99A2B4] hover:bg-[#F8F9FB]"
          }`}
        >
          Teams
        </button>
      </div>

      <MailSearchPanel
        tabs={currentTabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onOpenCompose={onOpenCompose}
        currentMode={currentMode}
      />

      <div
        ref={listRef}
        onMouseDown={(event) => {
          if (event.button !== 0 || !listRef.current) return;

          dragState.current = {
            isDown: true,
            startY: event.clientY,
            startScrollTop: listRef.current.scrollTop,
            moved: false,
          };
          setIsDragging(true);
          document.body.style.userSelect = "none";
        }}
        onClickCapture={(event) => {
          if (dragState.current.moved) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        className={`smart-scroll max-h-[700px] space-y-3 overflow-y-auto rounded-2xl ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {messages.map((item) => {
          const itemId = item.id || item.invitationId;
          return (
            <MailListItem
              key={itemId}
              item={item}
              active={itemId === activeId}
              onClick={() => onSelect(itemId)}
              onToggleStar={onToggleStar}
            />
          );
        })}
      </div>
    </aside>
  );
};

export default MailSidebar;
