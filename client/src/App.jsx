import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

import Layout from "./components/layout/Layout";
import Dashboard from "./components/pages/Dashboard";
import Workflow from "./components/pages/Workflow";
import Login from "./components/pages/Login";
import Signup from './components/pages/Signup';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("userSession");
  });
  const sessionUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("userSession") || "null");
    } catch {
      return null;
    }
  })();
  
  const rawName =
    sessionUser?.displayName ||
    sessionUser?.name ||
    sessionUser?.email ||
    "User";
  
  const displayName = rawName.split("@")[0];

  const handleLogin = (user) => {
    localStorage.setItem("userSession", JSON.stringify(user));
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/signup" replace />} />
          </>
        ) : (
          <>
            <Route
  path="/dashboard"
  element={
    <Layout onLogout={handleLogout} displayName={displayName}>
      <Dashboard />
    </Layout>
  }
/>

<Route
  path="/workflow"
  element={
    <Layout onLogout={handleLogout} displayName={displayName}>
      <Workflow />
    </Layout>
  }
/>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;

