// 섹션 제목 컴포넌트 (아이콘 + 제목 + 선택적 액션 버튼)
const HackathonDetailSectionTitle = ({ icon, title, action }) => (
  <div className="mb-5 flex items-center justify-between gap-4">
    <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
      {icon}
      <h2>{title}</h2>
    </div>
    {action}
  </div>
);

export default HackathonDetailSectionTitle;
