import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

import Landing from "./pages/landing";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Generate from "./pages/generate";
import MyRoadmap from "./pages/myroadmap";
import Quiz from "./pages/quiz";
import Profile from "./pages/profile";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {

  useEffect(() => {
    axios.get("http://localhost:3000/users")
      .then(() => {})
      .catch(() => {});
  }, []);

  return (
  <BrowserRouter>
    <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/generate"
      element={
        <ProtectedRoute>
          <Generate />
        </ProtectedRoute>
      }
    />

    <Route
      path="/my-roadmap"
      element={
        <ProtectedRoute>
          <MyRoadmap />
        </ProtectedRoute>
      }
    />

    <Route
      path="/quiz"
      element={
        <ProtectedRoute>
          <Quiz />
        </ProtectedRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
  </Routes>
  </BrowserRouter>
);
}