import { Navigate, Outlet, useLocation } from "react-router-dom";
import { checkIsLoggedIn } from "../utils/auth";

const ProtectedRoute = () => {
  const location = useLocation();
  const isLoggedIn = checkIsLoggedIn();

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          authNotice: "로그인 후 이용할 수 있습니다.",
          from: `${location.pathname}${location.search}${location.hash}`,
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
