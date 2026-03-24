import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/auth"; // auth.js에서 가져오기

const SignUp = () => {
  const navigate = useNavigate();

  // 1. 입력 데이터를 객체 하나로 관리
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userId: "",
    password: "",
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 2. 이메일 유효성 검사 로직
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, userId, password } = formData;

    // 간단한 유효성 검사
    if (!name || !email || !userId || !password) {
      alert("모든 필수 항목(*)을 입력해주세요.");
      return;
    }

    if (!validateEmail(email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (password.length < 8) {
      alert("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    // 3. auth.js의 registerUser 호출
    const result = registerUser(formData);

    if (result.isSuccess) {
      alert(result.message);
      navigate("/login"); // 가입 성공 시 로그인 페이지로 이동
    } else {
      alert(result.message); // 중복 이메일/아이디 등 에러 메시지
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-[#3B82F6] mb-10">회원가입</h1>

      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-100 p-10 lg:p-14">
        <h2 className="text-[#3B82F6] font-bold mb-8">
          회원정보를 입력해주세요
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 이름 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              이름 <span className="text-yellow-400">*</span>
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름"
              className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          {/* E-mail */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              E-mail <span className="text-yellow-400">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail"
              className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          {/* 아이디 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              아이디 <span className="text-yellow-400">*</span>
            </label>
            <input
              name="userId"
              type="text"
              value={formData.userId}
              onChange={handleChange}
              placeholder="아이디"
              className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              비밀번호 <span className="text-yellow-400">*</span>
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호"
              className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#3B82F6] text-white font-bold rounded-md hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100 mt-8"
          >
            회원가입
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 font-bold hover:underline"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
