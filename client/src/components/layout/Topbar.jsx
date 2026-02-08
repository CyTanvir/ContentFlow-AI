import React, { useEffect, useRef, useState } from "react";
import "../styles/layout.css";
import userIcon from "../../assets/user.png";

const Topbar = ({ displayName, title = "Dashboard", subtitle = "Automated content workflow overview", onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const handleSignOut = () => {
    setOpen(false);
    if(typeof onLogout === "function") onLogout();
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
      <h2>{displayName ? `Welcome, ${displayName}` : title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="topbar-right" ref={ref}>
        <button
          className="avatar-btn"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
        >
            <div className="user-avatar">
                <img src={userIcon} alt="User profile" />
            </div>

        </button>

        {open && (
          <div className="avatar-menu" role="menu">
            <button className="menu-item" role="menuitem">Profile</button>
            <button className="menu-item" role="menuitem">Settings</button>
            <div className="menu-divider" />
            <button className="menu-item danger" role="menuitem" onClick={handleSignOut}>Sign out</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
