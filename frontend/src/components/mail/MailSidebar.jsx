import { useEffect, useRef, useState } from "react";
import MailSearchPanel from "./MailSearchPanel";
import MailListItem from "./MailListItem";

const tabs = [
  { id: "all", label: "전체" },
  { id: "unread", label: "읽지 않음" },
  { id: "starred", label: "즐겨찾기" },
];

const MailSidebar = ({ messages, activeId, onSelect, activeTab, onTabChange, onOpenCompose, onToggleStar }) => {
  const listRef = useRef(null);
  const dragStateRef = useRef({ isDown: false, startY: 0, startScrollTop: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);
  const [listMaxHeight, setListMaxHeight] = useState(null);

  const updateListHeight = () => {
    const listEl = listRef.current;
    if (!listEl) return;

    const children = Array.from(listEl.children);
    if (children.length <= 5) {
      setListMaxHeight(null);
      return;
    }

    const firstRect = children[0].getBoundingClientRect();
    const fifthRect = children[4].getBoundingClientRect();
    const targetHeight = Math.ceil(fifthRect.bottom - firstRect.top);
    setListMaxHeight(targetHeight);
  };

  const handleListMouseDown = (event) => {
    if (event.button !== 0) return;
    const listEl = listRef.current;
    if (!listEl) return;

    dragStateRef.current = {
      isDown: true,
      startY: event.clientY,
      startScrollTop: listEl.scrollTop,
      moved: false,
    };

    setIsDragging(true);
    document.body.style.userSelect = "none";
  };

  const handleListClickCapture = (event) => {
    if (dragStateRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  useEffect(() => {
    updateListHeight();
    window.addEventListener("resize", updateListHeight);

    const handleMouseMove = (event) => {
      if (!dragStateRef.current.isDown) return;
      const listEl = listRef.current;
      if (!listEl) return;

      const deltaY = event.clientY - dragStateRef.current.startY;
      if (Math.abs(deltaY) > 3) {
        dragStateRef.current.moved = true;
      }
      listEl.scrollTop = dragStateRef.current.startScrollTop - deltaY;
    };

    const handleMouseUp = () => {
      if (!dragStateRef.current.isDown) return;
      dragStateRef.current.isDown = false;
      setIsDragging(false);
      document.body.style.userSelect = "";
      setTimeout(() => {
        dragStateRef.current.moved = false;
      }, 0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      dragStateRef.current.isDown = false;
      document.body.style.userSelect = "";
      window.removeEventListener("resize", updateListHeight);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [messages]);

  return (
    <aside className="w-full max-w-[360px] shrink-0 space-y-4">
      <MailSearchPanel
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onOpenCompose={onOpenCompose}
      />

      <div
        ref={listRef}
        onMouseDown={handleListMouseDown}
        onClickCapture={handleListClickCapture}
        className={`smart-scroll space-y-3 rounded-2xl overflow-y-auto ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={listMaxHeight ? { maxHeight: `${listMaxHeight}px` } : undefined}
      >
        {messages.map((item) => (
          <MailListItem
            key={item.id}
            item={item}
            active={item.id === activeId}
            onClick={onSelect}
            onToggleStar={onToggleStar}
          />
        ))}
      </div>
    </aside>
  );
};

export default MailSidebar;
