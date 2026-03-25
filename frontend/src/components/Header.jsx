import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkIsLoggedIn, logoutUser } from "../utils/auth";
import logoImg from "../assets/BloomingLogo.png";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(checkIsLoggedIn());
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    navigate("/login");
  };
  return (
    <header className="flex justify-between items-center px-12 h-20 bg-white shadow-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-1">
        <img src={logoImg} alt="logo" className="h-20 w-auto -mr-5 mt-1.5" />
        <span className="text-3xl font-black text-[#336DFE]">Blooming</span>
      </Link>

      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="px-6 py-2.5 bg-[#336DFE] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2.5 border-2 border-[#336DFE] text-[#336DFE] font-bold rounded-lg hover:bg-blue-50 transition-colors"
            >
              회원가입
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4 relative">
            <Link
              to="/mails"
              className="block px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
            >쪽지</Link>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // 포커스 해제시 닫힘
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              사용자님{" "}
              <span
                className={`transition-transform ${showDropdown ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 py-2">
                <Link
                  to="/mypage"
                  className="block px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
                >
                  마이페이지
                </Link>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 text-red-500 hover:bg-red-50 font-medium"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
