// Routes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/home";
import PageNotFound from "./components/error/error";
import MasterEngagement from "./components/engagements/masterEngagement";
import Login from "./components/auth/login";
import SignUp from "./components/auth/signup";
import Community from "./components/community/Community";
import PaymentPage from "./components/payment/e-khalti";
import DoctorProfile from "./components/Profile/Doctor/DoctorProfile";
import Feed from "./components/home/feed";
import AptitudeTest from "./components/aptitudeTest/appitudeComp";
import MediatatorProfile from "./components/MeditationInstructor/MeditatorProfile";
import AnnoyUser from "./components/Profile/User/AnonyUser";
import Quiz from "./components/engagements/quizGame";
import JobPosts from "./components/JobPosts/JobPosts";
import ShareResources from "./components/ShareResources/ShareResources";
import ShareResourcesList from "./components/ShareResources/ShareResourcesList";
import PostReels from "./components/MakeReels/PostReels";
import HistogramForTalent from "./components/Histogram/TalentRegion";
import ChatRoom from "./components/LiveChat/liveChatRoom";
import AiNews from "./components/News/AiNews";

export default function MainRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/engagement" element={<MasterEngagement />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/community" element={<Community />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/profile/doctor" element={<DoctorProfile />} />
      <Route path="/profile/mediator-teacher" element={<MediatatorProfile />} />
      <Route path="/profile/user" element={<AnnoyUser />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/aptitude-test" element={<AptitudeTest />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/jobPostings" element={<JobPosts />} />
      <Route path="/ShareResources" element={<ShareResources></ShareResources>}/>
      <Route path="/ShareResourcesList" element={<ShareResourcesList></ShareResourcesList>}/>
      <Route path="/MakeReels" element={<PostReels></PostReels>} />
      <Route path="/" element={<PostReels></PostReels>} />
      <Route path="/historgramTalent" element={<HistogramForTalent />} />
      <Route path="/livechat" element={<ChatRoom />} />
      <Route path="/ainews" element={<AiNews />} />
    </Routes>
  );
}
