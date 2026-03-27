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
        // 2. 보관함(users)에서 전체 유저 목록을 꺼냅니다.
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // 3. 입력한 loginId와 password가 모두 일치하는 유저 찾기
        const matchedUser = users.find(
          (u) => u.loginId === loginId && u.password === password,
        );

        if (matchedUser) {
          // 4. 찾은 유저의 전체 정보를 currentUser에 저장
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              ...matchedUser,
              userId: result.data.userId, // 백엔드에서 준 실제 PK(숫자 ID)로 덮어쓰기
            }),
          );
        }
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
      // 1. signupApi.execute를 실행하면 Handler로 데이터가 날아갑니다.
      const result = await signupApi.execute(userData);

      if (result && result.isSuccess) {
        // 기존에 가입된 유저 리스트
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const newUser = {
          ...userData,
          id: result.data?.userId || Date.now(), // 서버가 준 ID가 있으면 쓰고 없으면 생성
        };
        //유저 리스트에 새 유저 추가
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
      }
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
    handleSignUp, // 이제 외부에서 이 함수를 씁니다!
    isLoading: loginApi.isLoading || signupApi.isLoading,
    loginError: loginApi.error,
    signupError: signupApi.error,
  };
};
