import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import SignUp from "../pages/SignUp";
import MailPage from "../pages/MailPage";
import HackathonDetailPage from "../pages/HackathonDetailPage";
import HackathonListPage from "../pages/HackathonListPage";
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
            <Route path="/teams" element={<div>팀원 모집 페이지</div>} />
            <Route path="/ranking" element={<div>랭킹 페이지</div>} />
            <Route path="/mypage" element={<div>마이페이지</div>} />
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
