import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const { handleLogin, isLoading } = useAuth();

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!loginId.trim() || !password.trim()) {
      setFeedbackMessage("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setFeedbackMessage("");
    const result = await handleLogin(loginId, password);

    if (result?.isSuccess) {
      navigate("/");
      return;
    }

    setFeedbackMessage(result?.message || "로그인에 실패했습니다.");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-12 lg:flex lg:w-2/5">
        <div className="relative w-full max-w-lg">
          <img
            src="/api/placeholder/600/600"
            alt="로그인 안내 일러스트"
            className="h-auto w-full drop-shadow-2xl"
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-3/5">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-blue-600">로그인</h1>
            <p className="text-sm leading-relaxed text-gray-500">
              계정을 연결하고 해커톤 탐색과 팀 기능을 계속 이용해 보세요.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            {feedbackMessage ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {feedbackMessage}
              </div>
            ) : null}

            <div className="space-y-4">
              <div>
                <label htmlFor="id" className="block text-sm font-semibold text-gray-700 mb-2">
                  아이디
                </label>
                <input
                  id="login-id"
                  type="text"
                  value={loginId}
                  onChange={(event) => setLoginId(event.target.value)}
                  placeholder="이메일"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="비밀번호"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-sm bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="w-full rounded-sm border border-blue-600 bg-white py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
              >
                회원가입
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between pt-4">
            <div className="h-px w-24 bg-gray-200" />
            <div className="h-px w-24 bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
