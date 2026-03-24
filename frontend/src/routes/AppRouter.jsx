import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import MailPage from "../pages/MailPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/hackathons" element={<div>해커톤 페이지</div>} />
        <Route path="/mail" element={<MailPage />} />
        <Route path="/teams" element={<div>팀 빌딩 페이지</div>} />
        <Route path="/ranking" element={<div>랭킹 페이지</div>} />
        <Route path="/mypage" element={<div>마이페이지</div>} />
      </Route>

      <Route path="/login" element={<div>로그인 페이지</div>} />
      <Route path="/signup" element={<div>회원가입 페이지</div>} />
    </Routes>
  );
};

export default AppRouter;
