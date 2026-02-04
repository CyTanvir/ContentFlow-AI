import { useEffect, useState } from "react";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/pages/Dashboard";
import Workflow from "./components/pages/Workflow";

function App() {
  const [route, setRoute] = useState("dashboard");

  useEffect(() => {
    const updateRoute = () => {
      const hash = window.location.hash.replace("#/", "");
      setRoute(hash || "dashboard");
    };

    updateRoute();
    window.addEventListener("hashchange", updateRoute);

    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  let page;
  if (route === "workflow") {
    page = <Workflow />;
  } else {
    page = <Dashboard />;
  }

  return <Layout>{page}</Layout>;
}

export default App;
