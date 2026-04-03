import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginId, setloginId] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!loginId || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    // 3. 훅의 handleLogin(API 기반)을 호출합니다.
    const result = await handleLogin(loginId, password);

    if (result && result.isSuccess) {
      navigate("/"); // 성공 시 홈으로
    } else {
      // 4. 에러 메시지 처리 (메시지가 없으면 기본값 출력)
      alert(result?.message || "로그인에 실패했습니다.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 왼쪽 영역: 일러스트레이션 (데스크탑 전용) */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-100 to-blue-200 items-center justify-center p-12">
        <div className="relative max-w-lg w-full">
          <img
            src="/api/placeholder/600/600"
            alt="Security Illustration"
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>
      </div>

      {/* 오른쪽 영역: 로그인 폼 */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* 헤더 섹션 */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">로그인</h1>
            <p className="text-sm text-gray-500 leading-relaxed">어쩌고저쩌고</p>
          </div>

          {/* 폼 섹션 */}
          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4">
              {/* 아이디 입력 */}
              <div>
                <label htmlFor="id" className="block text-sm font-semibold text-gray-700 mb-2">
                  아이디
                </label>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setloginId(e.target.value)}
                  placeholder="아이디"
                  className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="pw" className="text-sm font-semibold text-gray-700">
                    비밀번호
                  </label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* 버튼 섹션 */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                로그인
              </button>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="w-full py-3 bg-white text-blue-600 font-semibold border border-blue-600 rounded-sm hover:bg-blue-50 transition-colors"
              >
                회원가입
              </button>
            </div>
          </form>

          {/* 하단 구분선 (데코레이션) */}
          <div className="flex items-center justify-between pt-4">
            <div className="h-px w-24 bg-gray-200"></div>
            <div className="h-px w-24 bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
