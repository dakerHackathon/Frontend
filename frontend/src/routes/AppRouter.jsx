import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import SignUp from "../pages/SignUp";
import RecruitMemberPage from "../pages/RecruitMemberPage";
import MailPage from "../pages/MailPage";
import HackathonListPage from "../pages/HackathonListPage";
import RankingPage from "../pages/RankingPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/mails" element={<MailPage/>}/>
          <Route path="/hackathons" element={<div>해커톤 페이지</div>} />
          <Route path="/teams" element={<RecruitMemberPage />} />
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
