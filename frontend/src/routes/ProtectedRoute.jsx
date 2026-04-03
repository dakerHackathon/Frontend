import { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkIsLoggedIn } from "../utils/auth";

const ProtectedRoute = () => {
  const isLoggedIn = checkIsLoggedIn();
  // 1. 알림이 떴는지 기억할 변수 (렌더링에 영향을 주지 않음)
  const hasAlerted = useRef(false);

  useEffect(() => {
    // 로그인이 안 되어 있고 + 아직 알림을 보여준 적이 없을 때만 실행
    if (!isLoggedIn && !hasAlerted.current) {
      alert("로그인 후 이용 가능합니다.");
      hasAlerted.current = true; // 2. 실행 후 플래그를 true로 변경
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
