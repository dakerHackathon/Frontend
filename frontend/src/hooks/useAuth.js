// src/hooks/useAuth.js
import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";

export const useAuth = () => {
  const loginApi = useApi(API.auth.login);
  const signupApi = useApi(API.auth.signup); // API 레지스트리에 등록된 것 사용

  // --- 로그인 ---
  const handleLogin = async (loginId, password) => {
    try {
      const result = await loginApi.execute({ loginId, password });
      if (result && result.isSuccess) {
        localStorage.setItem("currentUser", JSON.stringify(result.data));
      }
      return result;
    } catch (e) {
      console.error("로그인 중 에러 발생 : ", e);
      return { isSuccess: false, message: e.message };
    }
  };

  // --- 회원가입 ---
  const handleSignUp = async (userData) => {
    try {
      // 1. signupApi.execute를 실행하면 Handler로 데이터가 들어갑니다.
      const result = await signupApi.execute(userData);
      return result;
    } catch (e) {
      console.error("회원가입 처리 중 에러:", e);
      return {
        isSuccess: false,
        message:
          e.response?.data?.message || "회원가입 중 오류가 발생했습니다.",
      };
    }
  };

  return {
    handleLogin,
    handleSignUp, // 이제 외부에서 이 함수를 씁니다.
    isLoading: loginApi.isLoading || signupApi.isLoading,
    loginError: loginApi.error,
    signupError: signupApi.error,
  };
};
