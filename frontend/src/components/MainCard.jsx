// maincard.jsx
import { useNavigate } from "react-router-dom";

const MainCard = ({ title, description, path, imageUrl }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="group flex flex-col p-6 bg-white rounded-[2.5rem] shadow-xl border border-gray-50 cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl w-full max-w-[380px] min-h-[500px]"
    >
      {/* 1. 이미지/컨텐츠 영역 (비율 유지) */}
      <div className="w-full aspect-square bg-[#F1F3F6] rounded-[2rem] flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-center text-lg font-medium text-gray-500 break-keep">
            이미지가 들어갈 곳
          </span>
        )}
      </div>

      {/* 2. 중간 텍스트 영역 (제목 + 상세 설명) */}
      <div className="flex flex-col gap-2 mt-6 mb-4 px-1">
        <h2 className="font-extrabold text-gray-900 text-xl">{title}</h2>
        <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      {/* 3. 하단 링크 영역 (구분선 + 양끝 배치) */}
      <div className="mt-auto pt-5 border-t border-gray-100 flex justify-between items-center pr-1">
        <span className="font-bold text-[#336DFE] text-[15px]">
          {title} 페이지로 이동
        </span>

        {/* 디자인의 핵심: 동그란 화살표 버튼 */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F4F7FF] text-[#336DFE] transition-transform duration-300 group-hover:translate-x-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
