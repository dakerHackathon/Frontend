import BaseInfoCard from "./BaseInfoCard";

const SidebarPanel = ({ title, action, children, className = "" }) => {
  return (
    <BaseInfoCard className={`group ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-[#336DFE] transition group-hover:text-[#2458E6]">
            {title}
          </h2>
          {action ? (
            <span className="text-sm font-bold text-slate-900">{action}</span>
          ) : null}
        </div>
        {children}
      </div>
    </BaseInfoCard>
  );
};

export default SidebarPanel;
