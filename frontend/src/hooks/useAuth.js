import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";

export const useAuth = () => {
  const loginApi = useApi(API.auth.login);
  const signupApi = useApi(API.auth.signup);

  const handleLogin = async (loginId, password) => {
    try {
      const result = await loginApi.execute({ loginId, password });

      if (result?.isSuccess) {
        localStorage.setItem("currentUser", JSON.stringify(result.data));
      }

      return result;
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || error.message || "로그인에 실패했습니다.",
      };
    }
  };

  const handleSignUp = async (userData) => {
    try {
      return await signupApi.execute(userData);
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || "회원가입 중 오류가 발생했습니다.",
      };
    }
  };

  return {
    handleLogin,
    handleSignUp,
    isLoading: loginApi.isLoading || signupApi.isLoading,
    loginError: loginApi.error,
    signupError: signupApi.error,
  };
};
