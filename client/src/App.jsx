import { useEffect, useState } from "react";
import "./App.css";
import PostIdeas from "./PostIdeas.jsx";
import PendingReview from "./PendingReview.jsx";
import Calendar from "./Calendar.jsx";

function App() {
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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "20px", gap: "20px" }}>
      <div style={{ fontSize: 24}}>{msg}</div>

      <div style={{ display: "flex", gap: "20px", flex: 1 }}>
        <div style={{ width: "25%", height: "100%" }}>
          {<PostIdeas />}
        </div>
        <div style={{ width: "25%", height: "100%" }}>
          {<PendingReview />}
        </div>
        <div style={{ width: "40%", height: "100%" }}>
          {<Calendar />}
        </div>
      </div>
    </div>
  );
}

export default App;
