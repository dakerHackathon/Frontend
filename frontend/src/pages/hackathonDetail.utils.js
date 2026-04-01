// 포지션에 따른 배경/텍스트 색상 클래스 반환
const getPositionToneClass = (position) => {
  const normalized = position.trim().toLowerCase();

  if (["fe", "frontend", "프론트", "프론트엔드"].includes(normalized)) {
    return "bg-[#2F46FF] text-white";
  }
  if (["be", "backend", "백엔드"].includes(normalized)) {
    return "bg-[#5ACB35] text-white";
  }
  if (["ai", "ml", "머신러닝"].includes(normalized)) {
    return "bg-[#6B7280] text-white";
  }
  if (["db", "data", "데이터"].includes(normalized)) {
    return "bg-[#FFB84D] text-white";
  }
  if (["designer", "design", "디자인", "디자이너", "ux/ui"].includes(normalized)) {
    return "bg-[#FF72B6] text-white";
  }
  if (["기획", "pm", "po", "planner"].includes(normalized)) {
    return "bg-[#8B5CF6] text-white";
  }

  return "bg-slate-100 text-slate-600";
};

// 팀 데이터에서 포지션 목록 추출
const extractTeamPositions = (team) =>
  (team.positions ?? team.role.split("/")).map((item) => item.trim()).filter(Boolean);

// 포지션 이름을 약칭 레이블로 변환
const formatPositionLabel = (position) => {
  const normalized = position.trim().toLowerCase();

  if (["frontend", "프론트", "프론트엔드"].includes(normalized)) return "FE";
  if (["backend", "백엔드"].includes(normalized)) return "BE";
  if (["ai", "ml", "머신러닝"].includes(normalized)) return "AI";
  if (["db", "data", "데이터"].includes(normalized)) return "DB";
  if (["designer", "design", "디자인", "디자이너", "ux/ui"].includes(normalized)) {
    return "DESIGNER";
  }
  if (["기획", "pm", "po", "planner"].includes(normalized)) return "PM";

  return position.toUpperCase();
};

export { getPositionToneClass, extractTeamPositions, formatPositionLabel };
