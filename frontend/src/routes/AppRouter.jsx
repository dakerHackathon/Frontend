import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import SignUp from "../pages/SignUp";
import RecruitMemberPage from "../pages/RecruitMemberPage";
import RecruitWritePage from "../pages/RecruitWritePage";
import MailPage from "../pages/MailPage";
import HackathonDetailPage from "../pages/HackathonDetailPage";
import HackathonListPage from "../pages/HackathonListPage";
import RankingPage from "../pages/RankingPage";
import MyPage from "../pages/MyPage";
import TeamDetailPage from "../pages/TeamDetailPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/mails" element={<MailPage />} />
            <Route path="/hackathons" element={<HackathonListPage />} />
            <Route path="/hackathons/:slug" element={<HackathonDetailPage />} />
            <Route path="/teams" element={<RecruitMemberPage />} />
            <Route path="/teams/write" element={<RecruitWritePage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/teams/:teamId" element={<TeamDetailPage />} />
          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>

      {backgroundLocation ? (
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/hackathons/:slug" element={<HackathonDetailPage />} />
          </Route>
        </Routes>
      ) : null}
    </>
  );
};

export default AppRouter;
