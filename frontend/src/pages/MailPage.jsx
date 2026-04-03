import { useMemo, useState, useEffect } from "react";
import { useMail } from "../hooks/useMail";
import MailSidebar from "../components/mail/MailSidebar";
import MailViewer from "../components/mail/MailViewer";
import NewMessageModal from "../components/mail/NewMessageModal";

const MailPage = () => {
  // 1. 초기값 설정: localStorage에서 가져옴
  const [userId] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser)?.userId : null;
  });

  const {
    messages,
    invitations,
    isLoading,
    fetchMessages,
    fetchInvitations,
    markAsRead,
    removeMessage,
    toggleStar,
    sendMail,
    respondToInvitation,
  } = useMail(userId);

  const [currentMode, setCurrentMode] = useState("messages");
  const [activeTab, setActiveTab] = useState("all");
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // --- [로직 1: 데이터 로딩] ---
  // userId가 null에서 ID값으로 바뀌는 순간, 리액트가 이 useEffect를 자동으로 다시 실행합니다.
  useEffect(() => {
    if (!userId) return;

    if (currentMode === "messages") {
      const filter = activeTab === "starred" ? "star" : activeTab;
      fetchMessages(filter);
    } else {
      const type = activeTab === "invited" ? 1 : activeTab === "requested" ? 2 : null;
      fetchInvitations(type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, currentMode, activeTab]);

  // --- [로직 2: UI용 리스트 필터링] ---
  const filteredItems = useMemo(() => {
    const base = currentMode === "messages" ? messages || [] : invitations || [];

    if (currentMode === "messages") {
      if (activeTab === "unread") {
        return base.filter((msg) => !msg.isRead || msg.id === activeMessageId);
      }
      if (activeTab === "starred") {
        return base.filter((msg) => msg.isStar);
      }
    }
    return base;
  }, [currentMode, messages, invitations, activeTab, activeMessageId]);

  // --- [로직 3: 첫 번째 아이템 자동 선택] ---
  useEffect(() => {
    // 로딩이 끝났고 리스트가 있는데 선택된 ID가 없거나 유효하지 않을 때
    if (!isLoading && filteredItems.length > 0) {
      const idField = currentMode === "messages" ? "id" : "invitationId";
      const isCurrentIdValid = filteredItems.some((item) => item[idField] === activeMessageId);
      // 현재 선택된 ID가 없거나, 탭 전환 등으로 리스트에서 사라졌을 때만 첫 번째 요소 선택
      if (!activeMessageId || !isCurrentIdValid) {
        const timer = setTimeout(() => {
          setActiveMessageId(filteredItems[0][idField]);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [filteredItems, isLoading, currentMode, activeMessageId]);

  // --- [로직 4: 상세 뷰어 데이터] ---
  const selectedMessage = useMemo(() => {
    if (filteredItems.length === 0) return null;
    const idField = currentMode === "messages" ? "id" : "invitationId";
<<<<<<< HEAD
    return (
      filteredItems.find((item) => item[idField] === activeMessageId) ||
      filteredItems[0]
    );
=======
    return filteredItems.find((item) => item[idField] === activeMessageId) || filteredItems[0];
>>>>>>> main
  }, [activeMessageId, filteredItems, currentMode]);

  // --- [핸들러] ---
  const handleSelectMessage = async (id) => {
    setActiveMessageId(id);
    if (currentMode === "messages") {
      await markAsRead(id);
    }
  };

  const handleToggleStar = async (id) => {
    await toggleStar(id);
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const success = await removeMessage(id);
      if (success) setActiveMessageId(null);
    }
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    setActiveTab(mode === "messages" ? "all" : "invited");
    setActiveMessageId(null);
  };

  return (
    <div className="bg-[#F4F6FA] px-6 py-8 lg:px-10">
      {isLoading && (
        <div className="fixed top-0 left-0 z-50 h-1 w-full animate-pulse bg-blue-500" />
      )}

      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 lg:flex-row">
        <MailSidebar
          currentMode={currentMode}
          onModeChange={handleModeChange}
          messages={filteredItems}
          activeId={activeMessageId}
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
          onRespond={respondToInvitation}
        />
      </div>

      <NewMessageModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={sendMail}
      />
    </div>
  );
};

export default MailPage;
