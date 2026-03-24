import { useMemo, useState } from "react";
import MailSidebar from "../components/mail/MailSidebar";
import MailViewer from "../components/mail/MailViewer";

const mailData = [
  {
    id: 1,
    sender: "김철수",
    role: "운영진",
    time: "오전 10:24",
    date: "오전 10:24",
    subject: "해커톤 본선 진출을 축하합니다!",
    preview:
      "안녕하세요 김철수입니다. 귀하의 팀이 이번 해커톤 예선을 통과하여 본선에 진출하게 되었음을 알립니다...",
    tags: ["본선진출", "운영진공지", "2024해커톤"],
    category: "all",
    body: [
      "<strong><u>안녕하세요, 김철수 (운영진)입니다.</u></strong>",
      "귀하의 팀 \"AI 인벤터스\"가 이번 해커톤 예선 심사를 우수한 성적으로 통과하여 본선 진출 32개 팀에 선정되었음을 기쁜 마음으로 전달드립니다. 예선 기간 동안 보여주신 혁신적인 아이디어와 기술적 구현 능력은 심사위원단으로부터 매우 높은 평가를 받았습니다.",
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
    preview: "우리가 지난번에 논의했던 MVP 기능 중에서 결제 시스템 부분은 우선순위를 낮추는 게 어떨까 싶어요...",
    tags: ["팀공지", "기획"],
    category: "all",
    body: ["기획안 피드백 요청 메시지입니다."],
  },
  {
    id: 3,
    sender: "박민준",
    role: "프론트엔드",
    time: "2월 14일",
    date: "2월 14일 오후 1:20",
    subject: "API 명세서 확인 부탁드립니다",
    preview: "백엔드 팀에서 전달받은 API 명세서에 몇 가지 누락된 필드가 있는 것 같습니다...",
    tags: ["개발", "api"],
    category: "unread",
    body: ["API 관련 확인 요청 메시지입니다."],
  },
  {
    id: 4,
    sender: "최수지",
    role: "디자이너",
    time: "2월 13일",
    date: "2월 13일 오전 11:00",
    subject: "메인화면 목업 업데이트 완료",
    preview: "피그마에 새로운 업데이트된 디자인 시스템 적용했습니다. 다크모드 대응을 위해 컬러 토큰도...",
    tags: ["디자인"],
    category: "starred",
    body: ["디자인 업데이트 알림 메시지입니다."],
  },
];

const Hackathons = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [activeMessageId, setActiveMessageId] = useState(mailData[0].id);

  const filteredMessages = useMemo(() => {
    if (activeTab === "all") {
      return mailData;
    }

    return mailData.filter((message) => message.category === activeTab);
  }, [activeTab]);

  const selectedMessage =
    filteredMessages.find((message) => message.id === activeMessageId) ?? filteredMessages[0];

  return (
    <div className="bg-[#F4F6FA] px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 lg:flex-row">
        <MailSidebar
          messages={filteredMessages}
          activeId={selectedMessage?.id}
          onSelect={setActiveMessageId}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <MailViewer message={selectedMessage} />
      </div>
    </div>
  );
};

export default Hackathons;