const STATUS_STYLES = {
  active: "bg-[#E8FFF0] text-[#17A34A]",
  upcoming: "bg-[#EAF0FF] text-[#336DFE]",
  closed: "bg-[#FFEAEA] text-[#EB3B3B]",
  recruiting: "bg-[#EEFFF3] text-[#17A34A]",
  filled: "bg-[#FFF8E8] text-[#C77A00]",
};

const STATUS_DOT_STYLES = {
  active: "bg-[#28C840]",
  upcoming: "bg-[#336DFE]",
  closed: "bg-[#EB3B3B]",
  recruiting: "bg-[#28C840]",
  filled: "bg-[#F59E0B]",
};

const StatusBadge = ({ label, tone = "active", withDot = false }) => {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[tone] ?? STATUS_STYLES.active}`}
    >
      {withDot ? (
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            STATUS_DOT_STYLES[tone] ?? STATUS_DOT_STYLES.active
          }`}
        />
      ) : null}
      {label}
    </span>
  );
};

export default StatusBadge;
