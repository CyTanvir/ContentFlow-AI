import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Layout from "./components/layout/Layout";
import Dashboard from "./components/pages/Dashboard";
import Workflow from "./components/pages/Workflow";
import Login from "./components/pages/Login";

function App() {
  const [route, setRoute] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCheckingAuth(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const updateRoute = () => {
      const hash = window.location.hash.replace("#/", "");
      setRoute(hash || "dashboard");
    };

    updateRoute();
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      window.location.hash = "#/dashboard";
    }
  };

  if (checkingAuth) return null;

  if (!user) {
    return <Login />;
  }

  const rawName = user.displayName || user.email || "User";
  const displayName = rawName.split("@")[0];

  const page = route === "workflow" ? <Workflow /> : <Dashboard />;

  return (
    <Layout onLogout={handleLogout} displayName={displayName}>
      {page}
    </Layout>
  );
}

export default App;