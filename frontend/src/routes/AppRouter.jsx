import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import SignUp from "../pages/SignUp";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/hackathons" element={<div>해커톤 페이지</div>} />
          <Route path="/teams" element={<div>팀 빌딩 페이지</div>} />
          <Route path="/ranking" element={<div>랭킹 페이지</div>} />
          <Route path="/mypage" element={<div>마이페이지</div>} />
        </Route>
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default AppRouter;
