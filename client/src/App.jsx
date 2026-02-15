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
  // TANVIR: retrieve user information from stored session
  const sessionUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("userSession") || "null");
    } catch {
      return null;
    }
  })();
  
  // TANVIR: Get name from displayName, name, email, or default to "User"
  const rawName =
    sessionUser?.displayName ||
    sessionUser?.name ||
    sessionUser?.email ||
    "User";
  
  // TANVIR: Extract only first name from full name by splitting on space
  // If it's an email, extract the part before @ sign
  const extractFirstName = (fullName) => {
    if (!fullName) return "User";
    if (fullName.includes("@")) {
      return fullName.split("@")[0];
    }
    // Remove extra whitespace and split by space to get first name
    return fullName.trim().split(/\s+/)[0];
  };
  
  const displayName = extractFirstName(rawName);

  const handleLogin = (user) => {
    localStorage.setItem("userSession", JSON.stringify(user));
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userSession");
      setIsLoggedIn(false);
    } 
    // for security and privacy reasons, we want to ensure that the user's session is fully cleared on logout
    catch (e) {
      console.error("Error signing out:", e);
    }
  };

  // Auto sign-out when page is closed/unloaded ADDED 2/10 because there was a bug where users would stay logged in after closing the tab
  // which caused confusion when they returned and found their session still active. 

  useEffect(() => {
    const handleBeforeUnload = async () => {
      try {
        await signOut(auth);
        localStorage.removeItem("userSession");
      } catch (e) {
        console.error("Error signing out on unload:", e);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Ensure local session is cleared and app state updates after sign-out
  const handleLogoutCleanup = async () => {
    await handleLogout();
    localStorage.removeItem("userSession");
    setIsLoggedIn(false);
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
    <Layout onLogout={handleLogoutCleanup} displayName={displayName}>
      <Dashboard />
    </Layout>
  }
/>

<Route
  path="/workflow"
  element={
    <Layout onLogout={handleLogoutCleanup} displayName={displayName}>
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

