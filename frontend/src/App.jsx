import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignPage from "./pages/SignPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminPage from "./pages/AdminPage";

const App = () => {
  // const { user, checkAuth, checkingAuth } = useUserStore();
  const user = useUserStore((state) => state.user);
  const checkingAuth = useUserStore((state) => state.checkingAuth);
  const checkAuth = useUserStore((state) => state.checkAuth);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  // checking auth
  if (checkingAuth) return <LoadingSpinner />;
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={!user ? <SignPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/secret-dashboard"
            element={
              user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
