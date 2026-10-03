import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ChatWidget from "./components/ChatWidget/ChatWidget";
import Home from "./pages/Home/Home";
import Jobs from "./pages/Jobs/Jobs";
import JobDetail from "./pages/JobDetail/JobDetail";
import Employers from "./pages/Employers/Employers";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import MyApplications from "./pages/Applications/MyApplications";
import AdminApplications from "./pages/Applications/AdminApplications";
import PostJob from "./pages/Employers/PostJob";
import EmployerDashboard from "./pages/Employers/EmployerDashboard";

const Layout = () => (
  <>
    <Navbar />
    <main><Outlet /></main>
    <Footer />
    <ChatWidget />
  </>
);

export default function App() {
  const { i18n } = useTranslation();

  // <html lang="kn"> lets CSS and screen readers know which language is showing
  useEffect(() => {
    const lang = i18n.resolvedLanguage || i18n.language || "en";
    document.documentElement.lang = lang.startsWith("kn") ? "kn" : "en";
  }, [i18n.resolvedLanguage, i18n.language]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/employers" element={<Employers />} />
        <Route path="/companies" element={<Employers />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/applications" element={<MyApplications />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/employers/post-job" element={<PostJob />} />
        <Route path="/employers/dashboard" element={<EmployerDashboard />} />
      </Route>
    </Routes>
  );
}