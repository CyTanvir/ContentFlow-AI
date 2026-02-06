import { useEffect, useState } from "react";

const Dashboard = () => {
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => setMsg(data.message))
      .catch((err) => {
        console.error(err);
        setMsg("Error connecting to backend");
      });
  }, []);

  return (
    <div>
      <h3>Backend Status</h3>
      <p>{msg}</p>
    </div>
  );
};

export default Dashboard;
