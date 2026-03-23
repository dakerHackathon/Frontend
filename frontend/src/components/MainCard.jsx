import { useNavigate } from "react-router-dom";

const MainCard = ({ title, description, path }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="group flex flex-col items-center justify-between p-6 bg-white rounded-[2rem] shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl w-full max-w-[380px] min-h-[500px]"
    >
      {/* 이미지/컨텐츠 영역 */}
      <div className="w-full h-[85%] bg-[#D9D9D9] rounded-2xl flex items-center justify-center p-10 text-center text-lg font-medium text-gray-700 break-keep">
        {description}
      </div>

      {/* 하단 타이틀 및 화살표 */}
      <div className="w-full flex justify-end items-center mt-4 pr-2 gap-3">
        <span className="font-bold text-gray-800 text-lg">{title}</span>
        <div className="text-[#336DFE] text-2xl transition-transform duration-300 group-hover:translate-x-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
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
