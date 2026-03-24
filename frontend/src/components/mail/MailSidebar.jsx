import MailSearchPanel from "./MailSearchPanel";
import MailListItem from "./MailListItem";

const tabs = [
  { id: "all", label: "전체" },
  { id: "unread", label: "읽지 않음" },
  { id: "starred", label: "별표" },
];

const MailSidebar = ({ messages, activeId, onSelect, activeTab, onTabChange }) => {
  return (
    <aside className="w-full max-w-[360px] shrink-0 space-y-4">
      <MailSearchPanel tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

      <div className="space-y-3 rounded-2xl">
        {messages.map((item) => (
          <MailListItem
            key={item.id}
            item={item}
            active={item.id === activeId}
            onClick={onSelect}
          />
        ))}
      </div>
    </aside>
  );
};

export default MailSidebar;