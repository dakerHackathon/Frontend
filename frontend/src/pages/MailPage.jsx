import { useMemo, useState } from "react";
import MailSidebar from "../components/mail/MailSidebar";
import MailViewer from "../components/mail/MailViewer";
import NewMessageModal from "../components/mail/NewMessageModal";

const initialMailData = [
  {
    id: 1,
    sender: "김철수",
    role: "운영진",
    time: "오전 10:24",
    date: "오전 10:24",
    subject: "해커톤 본선 진출을 축하합니다!",
    preview:
      "안녕하세요 김철수입니다. 귀하의 팀이 이번 해커톤 예선을 통과하여 본선에 진출하게 되었음을 알립니다...",
    isUnread: false,
    isStarred: false,
    body: [
      "<strong><u>안녕하세요, 김철수 (운영진)입니다.</u></strong>",
      '귀하의 팀 "AI 인벤터스"가 이번 해커톤 예선 심사를 우수한 성적으로 통과하여 본선 진출 32개 팀에 선정되었음을 기쁜 마음으로 전달드립니다. 예선 기간 동안 보여주신 혁신적인 아이디어와 기술적 구현 능력은 심사위원단으로부터 매우 높은 평가를 받았습니다.',
      "본선은 다가오는 <strong style='color:#336DFE'>3월 10일(일) 서울 코엑스 D홀</strong>에서 오프라인으로 진행될 예정입니다. 행사 당일 원활한 진행을 위해 오전 9시까지 현장 등록을 마쳐주시기 바랍니다.",
      "추가적인 궁금한 사항이 있으시면 언제든지 운영사무국으로 문의해 주시기 바랍니다. 본선 무대에서 여러분의 빛나는 가능성을 다시 한 번 만날 수 있기를 기대하겠습니다.",
    ],
  },
  {
    id: 2,
    sender: "이영희",
    role: "팀 리더",
    time: "어제",
    date: "어제 오후 7:10",
    subject: "기획안 수정 피드백 부탁해요",
    preview:
      "우리가 지난번에 논의했던 MVP 기능 중에서 결제 시스템 부분은 우선순위를 낮추는 게 어떨까 싶어요...",
    isUnread: false,
    isStarred: false,
    body: ["기획안 피드백 요청 메시지입니다."],
  },
  {
    id: 3,
    sender: "박민준",
    role: "프론트엔드",
    time: "2월 14일",
    date: "2월 14일 오후 1:20",
    subject: "API 명세서 확인 부탁드립니다",
    preview:
      "백엔드 팀에서 전달받은 API 명세서에 몇 가지 누락된 필드가 있는 것 같습니다...",
    isUnread: true,
    isStarred: false,
    body: ["API 관련 확인 요청 메시지입니다."],
  },
  {
    id: 4,
    sender: "최수지",
    role: "디자이너",
    time: "2월 13일",
    date: "2월 13일 오전 11:00",
    subject: "메인화면 목업 업데이트 완료",
    preview:
      "피그마에 새로운 업데이트된 디자인 시스템 적용했습니다. 다크모드 대응을 위해 컬러 토큰도...",
    isUnread: false,
    isStarred: true,
    body: ["디자인 업데이트 알림 메시지입니다."],
  },
  {
    id: 5,
    sender: "정다은",
    role: "팀장",
    time: "방금 전",
    date: "오후 2:35",
    subject: "[팀 초대] Team Blooming 합류 요청",
    preview:
      "안녕하세요! Team Blooming에서 프론트엔드 포지션으로 함께 해주실 수 있는지 제안드립니다.",
    isUnread: true,
    isStarred: false,
    type: "team-invite",
    body: [
      "<strong>안녕하세요, Team Blooming 팀장 정다은입니다.</strong>",
      "이번 해커톤 프로젝트에서 프론트엔드 개발을 담당해 주실 팀원을 찾고 있습니다.",
      "팀 소개와 역할이 맞는다고 생각되어 팀 합류를 제안드립니다. 아래 버튼에서 수락 또는 거절을 선택해 주세요.",
    ],
  },
  {
    id: 6,
    sender: "한지훈",
    role: "프론트엔드 개발자",
    time: "방금 전",
    date: "오후 3:02",
    subject: "[합류 요청] Team Blooming에 지원합니다",
    preview:
      "안녕하세요! Team Blooming의 프론트엔드 포지션에 합류하고 싶어 요청드립니다.",
    isUnread: true,
    isStarred: false,
    type: "team-join-request",
    body: [
      "<strong>안녕하세요, Team Blooming 팀장님.</strong>",
      "저는 React/TypeScript 기반 서비스 개발 경험이 있는 프론트엔드 개발자 한지훈입니다.",
      "팀 프로젝트 방향이 제 경험과 잘 맞아 보여 함께 참여하고 싶습니다. 아래에서 합류 요청을 수락 또는 거절해 주세요.",
    ],
  },
];

const Hackathons = () => {
  const [messages, setMessages] = useState(initialMailData);
  const [activeTab, setActiveTab] = useState("all");
  const [activeMessageId, setActiveMessageId] = useState(initialMailData[0].id);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const filteredMessages = useMemo(() => {
    if (activeTab === "all") {
      return messages;
    }

    if (activeTab === "unread") {
      return messages.filter((message) => message.isUnread);
    }

    return messages.filter((message) => message.isStarred);
  }, [activeTab, messages]);

  const selectedMessage =
    filteredMessages.find((message) => message.id === activeMessageId) ??
    filteredMessages[0];

  const handleSelectMessage = (id) => {
    setActiveMessageId(id);
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id ? { ...message, isUnread: false } : message,
      ),
    );
  };

  const handleToggleStar = (id) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id
          ? { ...message, isStarred: !message.isStarred }
          : message,
      ),
    );
  };

  const handleDeleteMessage = (id) => {
    // 1. 컨펌창 띄우기 (확인: true, 취소: false 반환)
    const isConfirmed = window.confirm("해당 메일을 삭제하시겠습니까?");

    // 2. '예(확인)'를 눌렀을 때만 삭제 실행
    if (isConfirmed) {
      setMessages((prev) => {
        const updatedMessages = prev.filter((message) => message.id !== id);

        // 만약 삭제한 메일이 지금 화면에 떠 있는 메일이라면?
        // 다음 메일이나 이전 메일을 자동으로 보여주도록 처리
        if (activeMessageId === id) {
          setActiveMessageId(updatedMessages[0]?.id || null);
        }

        return updatedMessages;
      });
    }
  };

  return (
    <div className="bg-[#F4F6FA] px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 lg:flex-row">
        <MailSidebar
          messages={filteredMessages}
          activeId={selectedMessage?.id}
          onSelect={handleSelectMessage}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenCompose={() => setIsComposeOpen(true)}
          onToggleStar={handleToggleStar}
        />

        <MailViewer
          message={selectedMessage}
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

export default Hackathons;
