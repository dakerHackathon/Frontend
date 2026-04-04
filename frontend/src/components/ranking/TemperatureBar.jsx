// 온도 값을 막대 그래프로 시각화하는 컴포넌트
const TemperatureBar = ({ value }) => (
  <div className="flex w-full items-center gap-3 sm:w-auto sm:gap-4">
    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E5ECFF] sm:w-28 sm:flex-none">
      <div
        className="h-full rounded-full bg-[#336DFE]"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
    <span className="min-w-[58px] text-xs font-bold text-slate-700 sm:min-w-[64px] sm:text-sm">
      {value.toFixed(1)}°C
    </span>
  </div>
);

export default TemperatureBar;
