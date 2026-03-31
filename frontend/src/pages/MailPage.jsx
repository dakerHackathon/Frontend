import { useMemo, useState } from "react";
import { mockMessages, mockInvitations } from "../mocks/data/mailData";
import MailSidebar from "../components/mail/MailSidebar";
import MailViewer from "../components/mail/MailViewer";
import NewMessageModal from "../components/mail/NewMessageModal";

const MailPage = () => {
  const [currentMode, setCurrentMode] = useState("messages");
  const [messages, setMessages] = useState(mockMessages);
  const [invitations] = useState(mockInvitations);
  const [activeTab, setActiveTab] = useState("all");
  const [activeMessageId, setActiveMessageId] = useState(mockMessages[0]?.id);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (currentMode === "messages") {
      if (activeTab === "unread")
        return messages.filter((message) => !message.isRead);
      if (activeTab === "starred")
        return messages.filter((message) => message.isStar);
      return messages;
    } else {
      // Teams 모드 필터 (type 1: 팀 참가 신청받음, type 2: 팀 초대받음)
      if (activeTab === "invited")
        return invitations.filter((i) => i.type === 1);
      if (activeTab === "requested")
        return invitations.filter((i) => i.type === 2);
      return invitations;
    }
  }, [currentMode, activeTab, messages, invitations]);

  const selectedMessage = useMemo(
    () =>
      filteredItems.find(
        (item) => (item.id || item.invitationId) === activeMessageId,
      ) ?? filteredItems[0],
    [activeMessageId, filteredItems],
  );

  // [핸들러] 메시지 선택 (지연된 읽음 처리 로직)
  const handleSelectMessage = (nextId) => {
    // 1. 현재 선택된 메일이 있고, 모드가 messages일 때만 실행
    if (currentMode === "messages") {
      // 2. 이미 선택된 메일을 다시 클릭한 경우 (마지막 1개 남았을 때 등)
      if (activeMessageId === nextId) {
        setMessages((prev) =>
          prev.map((m) => (m.id === nextId ? { ...m, isRead: true } : m)),
        );
        // 리스트에서 사라질 것이므로 다음 선택 초기화
        setActiveMessageId(null);
        return;
      }

      // 3. 다른 메일을 클릭한 경우: '이전' 메일(activeMessageId)을 읽음 처리
      if (activeMessageId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === activeMessageId ? { ...m, isRead: true } : m,
          ),
        );
      }
    }

    // 4. 새로운 메일로 화면 전환
    setActiveMessageId(nextId);
  };

  const handleToggleStar = (id) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id ? { ...message, isStar: !message.isStar } : message,
      ),
    );
  };

  const handleDeleteMessage = (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setMessages((prev) => prev.filter((message) => message.id !== id));
      setActiveMessageId(null);
    }
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    setActiveTab(mode === "messages" ? "all" : "invited");
    setActiveMessageId(null);
  };

  return (
    <div className="bg-[#F4F6FA] px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 lg:flex-row">
        <MailSidebar
          currentMode={currentMode}
          onModeChange={handleModeChange}
          messages={filteredItems}
          activeId={selectedMessage?.id || selectedMessage?.invitationId}
          onSelect={handleSelectMessage}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenCompose={() => setIsComposeOpen(true)}
          onToggleStar={handleToggleStar}
        />

        <MailViewer
          message={selectedMessage}
          mode={currentMode}
          onToggleStar={handleToggleStar}
          onDelete={handleDeleteMessage}
        />
      </div>

      <NewMessageModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </div>
  );
};

export default MailPage;
