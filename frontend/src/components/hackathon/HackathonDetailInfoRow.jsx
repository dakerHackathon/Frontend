// 정보 행 컴포넌트 (레이블 + 값 한 줄 표시)
const HackathonDetailInfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
    <span className="text-sm font-medium text-slate-500">{label}</span>
    <span className="text-right text-sm font-semibold text-slate-800">{value}</span>
  </div>
);

export default HackathonDetailInfoRow;
