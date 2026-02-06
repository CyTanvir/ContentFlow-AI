import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

import Layout from "./components/layout/Layout";
import Dashboard from "./components/pages/Dashboard";
import Workflow from "./components/pages/Workflow";
import Login from "./components/pages/Login";

function App() {
  console.log("App rendering");
  
  const [route, setRoute] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("userSession");
  });

  console.log("isLoggedIn:", isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

    const updateRoute = () => {
      const hash = window.location.hash.replace("#/", "");
      setRoute(hash || "dashboard");
    };

    updateRoute();
    window.addEventListener("hashchange", updateRoute);

    return () => window.removeEventListener("hashchange", updateRoute);
  }, [isLoggedIn]);

  const handleLogin = (user) => {
    localStorage.setItem("userSession", JSON.stringify(user));
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      localStorage.removeItem("userSession");
      setIsLoggedIn(false);
    }
  };

  if (!isLoggedIn) {
    console.log("Rendering Login");
    return <Login onLogin={handleLogin} />;
  }

  let page;
  if (route === "workflow") {
    page = <Workflow />;
  } else {
    page = <Dashboard />;
  }

  return <Layout onLogout={handleLogout}>{page}</Layout>;
}

export default App;
