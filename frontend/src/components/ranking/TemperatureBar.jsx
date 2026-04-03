// 온도 값을 막대 그래프로 시각화하는 컴포넌트
const TemperatureBar = ({ value }) => (
  <div className="flex items-center gap-4">
    <div className="h-2.5 w-28 overflow-hidden rounded-full bg-[#E5ECFF]">
      <div
        className="h-full rounded-full bg-[#336DFE]"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
    <span className="min-w-[64px] text-sm font-bold text-slate-700">{value.toFixed(1)}°C</span>
  </div>
);

export default TemperatureBar;
