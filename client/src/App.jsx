import { useEffect, useState } from "react";

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
    <div style={{ padding: "40px", fontSize: "24px" }}>
      {msg}
    </div>
  );
}

export default App;
