import { useState } from "react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="panel" style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <button onClick={handlePrevMonth} style={{ padding: "5px 10px" }}>←</button>
        <h3 style={{ margin: 0 }}>{monthName}</h3>
        <button onClick={handleNextMonth} style={{ padding: "5px 10px" }}>→</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} style={{ fontWeight: "bold", textAlign: "center", padding: "5px" }}>
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            style={{
              textAlign: "center",
              padding: "8px",
              border: day ? "1px solid #ddd" : "none",
              borderRadius: "4px",
              backgroundColor: day ? "#f9f9f9" : "transparent",
            }}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}