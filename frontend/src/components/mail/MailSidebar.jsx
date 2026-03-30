import { useEffect, useRef, useState } from "react";
import MailSearchPanel from "./MailSearchPanel";
import MailListItem from "./MailListItem";

// [필터 탭 정의] 컴포넌트 외부로 분리하여 불필요한 재선언 방지
const MESSAGE_TABS = [
  { id: "all", label: "전체" },
  { id: "unread", label: "읽지 않음" },
  { id: "starred", label: "즐겨찾기" },
];

const TEAM_TABS = [
  { id: "invited", label: "초대받음" },
  { id: "requested", label: "신청받음" },
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

  // 드래그 상태 관리 (Ref를 사용하여 렌더링 성능 최적화)
  const dragState = useRef({
    isDown: false,
    startY: 0,
    startScrollTop: 0,
    moved: false,
  });

  // 현재 모드에 따른 탭 결정
  const currentTabs = currentMode === "messages" ? MESSAGE_TABS : TEAM_TABS;

  // 드래그 및 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragState.current.isDown || !listRef.current) return;

      const deltaY = e.clientY - dragState.current.startY;
      // 미세한 움직임은 무시 (3px 이상 움직여야 드래그로 간주)
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

      // 클릭 캡처링 방지를 위해 다음 틱에서 moved 초기화
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
      {/* 1. 모드 전환 탭 (Messages / Teams) */}
      <div className="flex gap-1 rounded-2xl bg-white p-1.5 shadow-sm border border-[#E4E9F2]">
        <button
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

      {/* 2. 검색 및 필터 탭 패널 */}
      <MailSearchPanel
        tabs={currentTabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onOpenCompose={onOpenCompose}
        isTeamsMode={currentMode === "teams"}
      />

      {/* 3. 메시지 리스트 (무한 스크롤 스타일 적용) */}
      <div
        ref={listRef}
        onMouseDown={(e) => {
          if (e.button !== 0 || !listRef.current) return;
          dragState.current = {
            isDown: true,
            startY: e.clientY,
            startScrollTop: listRef.current.scrollTop,
            moved: false,
          };
          setIsDragging(true);
          document.body.style.userSelect = "none";
        }}
        onClickCapture={(e) => {
          // 드래그 중이었다면 클릭 이벤트가 발생하지 않도록 차단
          if (dragState.current.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`smart-scroll space-y-3 rounded-2xl overflow-y-auto ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        } max-h-[700px]`} // 5개 이상의 아이템을 자연스럽게 보여주는 고정 최대 높이
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
