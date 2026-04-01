import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const { handleSignUp, isLoading } = useAuth();
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    loginId: "",
    password: "",
    passwordCheck: "",
    nickName: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, loginId, password, passwordCheck, nickName } = formData;

    if (!name || !email || !loginId || !password || !passwordCheck || !nickName) {
      setFeedback({ type: "error", message: "모든 필수 항목을 입력해 주세요." });
      return;
    }

    if (!validateEmail(email)) {
      setFeedback({ type: "error", message: "올바른 이메일 형식을 입력해 주세요." });
      return;
    }

    if (password !== passwordCheck) {
      setFeedback({ type: "error", message: "비밀번호와 비밀번호 확인이 일치하지 않습니다." });
      return;
    }

    if (password.length < 8) {
      setFeedback({ type: "error", message: "비밀번호는 최소 8자 이상이어야 합니다." });
      return;
    }

    const result = await handleSignUp(formData);

    if (result?.isSuccess) {
      setFeedback({ type: "success", message: result.message || "회원가입이 완료되었습니다." });
      navigate("/");
      return;
    }

    setFeedback({ type: "error", message: result?.message || "회원가입에 실패했습니다." });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] p-6">
      <h1 className="mb-10 text-3xl font-bold text-[#3B82F6]">회원가입</h1>

      <div className="w-full max-w-lg rounded-xl border border-gray-100 bg-white p-10 shadow-sm lg:p-14">
        <h2 className="mb-8 font-bold text-[#3B82F6]">회원정보를 입력해 주세요.</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {feedback.message ? (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                feedback.type === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-600"
                  : "border border-rose-200 bg-rose-50 text-rose-600"
              }`}
            >
              {feedback.message}
            </div>
          ) : null}

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
              className="w-full rounded-md border border-gray-200 px-4 py-3 outline-none transition-all placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              className="w-full rounded-md border border-gray-200 px-4 py-3 outline-none transition-all placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              아이디 <span className="text-yellow-400">*</span>
            </label>
            <input
              name="loginId"
              type="text"
              value={formData.loginId}
              onChange={handleChange}
              placeholder="아이디"
              className="w-full rounded-md border border-gray-200 px-4 py-3 outline-none transition-all placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              className="w-full rounded-md border border-gray-200 px-4 py-3 outline-none transition-all placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              비밀번호 확인 <span className="text-yellow-400">*</span>
            </label>
            <input
              name="passwordCheck"
              type="password"
              value={formData.passwordCheck}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해 주세요"
              className="w-full rounded-md border border-gray-200 px-4 py-3 outline-none transition-all placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              닉네임 <span className="text-yellow-400">*</span>
            </label>
            <input
              name="nickName"
              type="text"
              value={formData.nickName}
              onChange={handleChange}
              placeholder="닉네임"
              className="w-full rounded-md border border-gray-200 px-4 py-3 outline-none transition-all placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-8 w-full rounded-md bg-[#3B82F6] py-4 font-bold text-white shadow-lg shadow-blue-100 transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "회원가입 처리 중..." : "회원가입"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            이미 계정이 있으신가요?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-bold text-blue-500 hover:underline"
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
