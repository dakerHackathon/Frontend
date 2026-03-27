import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logoImg from "../assets/BloomingLogo.png";
import { checkIsLoggedIn, getCurrentUser, logoutUser } from "../utils/auth";

const navigationItems = [
  { to: "/hackathons", label: "해커톤 목록" },
  { to: "/teams", label: "팀원 모집" },
  { to: "/ranking", label: "랭킹" },
];

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(checkIsLoggedIn());
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-300 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-28 max-w-[1440px] items-center justify-between gap-6 px-4 lg:px-8">
        <Link to="/" className="flex h-24 items-center gap-2 self-center">
          <span className="flex h-20 w-20 items-center justify-center self-center">
            <img src={logoImg} alt="Blooming logo" className="block h-20 w-20 object-contain" />
          </span>
          <span className="flex h-20 items-center self-center">
            <span className="block text-3xl font-black leading-none tracking-tight text-[#336DFE]">
              Blooming
            </span>
          </span>
        </Link>

        <nav className="hidden h-28 items-stretch gap-10 lg:flex">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group relative inline-flex h-full items-center text-lg font-bold transition ${
                  isActive ? "text-[#336DFE]" : "text-slate-600 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={`absolute inset-x-0 bottom-0 z-10 h-1 rounded-full bg-[#336DFE] transition duration-200 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="rounded-xl bg-[#336DFE] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#2458E6]"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-xl border border-[#336DFE] px-6 py-3 text-sm font-bold text-[#336DFE] transition hover:bg-[#EEF3FF]"
              >
                회원가입
              </Link>
            </>
          ) : (
            <div className="relative flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className="flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-left transition hover:bg-slate-200"

              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#DDE5FF] text-lg font-black text-[#336DFE]">
                  {(currentUser?.name ?? "강석진").slice(0, 1)}
                </span>
                <span className="hidden md:block">
                  <span className="block text-sm font-black text-slate-900">
                    {currentUser?.name ?? "강석진"}
                  </span>
                  <span className="block text-sm text-slate-400">
                    {currentUser?.email ?? "asdf123@gmail.com"}
                  </span>
                </span>
                <span
                  className={`text-slate-500 transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                >
                  v
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-48 rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl">
                  <Link
                    to="/mypage"
                    className="block px-5 py-3 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    마이페이지
                  </Link>
                  <hr className="my-1 border-slate-100" />
                  <Link
                    to="/mails"
                    className="block px-5 py-3 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    쪽지
                  </Link>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-5 py-3 text-left font-medium text-red-500 transition hover:bg-red-50"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;