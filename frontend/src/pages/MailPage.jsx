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
      if (activeTab === "unread") return messages.filter((message) => !message.isRead);
      if (activeTab === "starred") return messages.filter((message) => message.isStar);
      return messages;
    }

    if (activeTab === "invited") {
      return invitations.filter((invitation) => invitation.type === 1);
    }

    if (activeTab === "requested") {
      return invitations.filter((invitation) => invitation.type === 2);
    }

    return invitations;
  }, [activeTab, currentMode, invitations, messages]);

  const selectedMessage = useMemo(
    () =>
      filteredItems.find((item) => (item.id || item.invitationId) === activeMessageId) ??
      filteredItems[0],
    [activeMessageId, filteredItems],
  );

  const handleSelectMessage = (id) => {
    setActiveMessageId(id);

    if (currentMode === "messages") {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === id ? { ...message, isRead: true } : message,
        ),
      );
    }
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
